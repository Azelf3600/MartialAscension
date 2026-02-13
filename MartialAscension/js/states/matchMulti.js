// Global instances for the match
let player1, player2;
let groundY;
let damageIndicators = [];
let matchOver = false;
let winnerName = "";

// Countdown Variables
let countdown = 3;
let countdownTimer = 60; 
let fightStarted = false;
let showFightText = false;
let fightTextTimer = 60;

// Match Timer Variables
const ROUND_TIME = 60; 
let matchTimer = ROUND_TIME;
let matchTimerFrames = 60;

function initMatch() {
  // groundY is the line where feet touch
  groundY = height - 100;
  matchOver = false;
  winnerName = "";
  damageIndicators = [];

  countdown = 3;
  countdownTimer = 60;
  fightStarted = false;
  showFightText = false;
  fightTextTimer = 60;

  matchTimer = ROUND_TIME;
  matchTimerFrames = 60;

  let charH = height * 0.5; // Standardize height for spawn math
  let p1Data = FIGHTERS[p1Selected];
  player1 = new Character(
    width * 0.2, 
    groundY - charH, // Pinning feet to groundY
    width * 0.08, 
    charH, 
    color(80, 120, 255), 
    PLAYER_CONTROLS.P1, 
    p1Data.name, 
    1,
    p1Data.archetype
  );

  let p2Data = FIGHTERS[p2Selected];
  player2 = new Character(
    width * 0.8, 
    groundY - charH, 
    width * 0.08, 
    charH, 
    color(255, 80, 80), 
    PLAYER_CONTROLS.P2, 
    p2Data.name, 
    -1,
    p2Data.archetype
  );

  if (gameCamera) {
    gameCamera.pos = createVector(width/2, height/2);
  }
}

function drawMatchMulti() {
  if (!player1 || !player2) {
    initMatch();
    return;
  }

  background(20); 

  // 1. UPDATE CAMERA
  gameCamera.update(player1, player2);

  // 2. DRAW THE "WORLD" (Camera Space)
  push();
    gameCamera.apply();
    
    // Fixed Floor: Drawing from groundY down so characters stand ON it
    rectMode(CORNER);
    fill(60);
    noStroke();
    rect(-10000, groundY, 20000, 2000); 

    handleCountdown();

    if (!matchOver && fightStarted) {
      updateMatchLogic();
    }

    // World-space elements
    player1.draw();
    player2.draw();
    updateDamageIndicators();
    drawDamageIndicators();
  pop(); 

  // 3. DRAW THE "UI" (Screen Space)
  drawInterface();
  drawCountdownOverlay();
  
  if (matchOver) {
    drawWinScreen();
  }
}

function handleCountdown() {
  if (!fightStarted) {
    countdownTimer--;
    if (countdownTimer <= 0) {
      countdown--;
      countdownTimer = 60;
      if (countdown <= 0) {
        fightStarted = true;
        showFightText = true;
      }
    }
  } else if (showFightText) {
    fightTextTimer--;
    if (fightTextTimer <= 0) {
      showFightText = false;
    }
  }
}

function drawCountdownOverlay() {
  push();
  // Ensure we are in Screen Space (ignoring camera)
  textAlign(CENTER, CENTER);
  if (!fightStarted && countdown > 0) {
    drawTitle(countdown.toString(), width / 2, height / 2, width * 0.15);
  } else if (showFightText) {
    drawTitle("FIGHT!", width / 2, height / 2, width * 0.2);
  }
  pop();
}

function drawInterface() {
  let barW = width * 0.4;
  let barH = 30;
  let padding = 50;

  // Timer: White, turns Red at 10s, No Stroke
  push();
  textAlign(CENTER, TOP);
  textFont(metalFont);
  textSize(55);
  noStroke();
  fill(matchTimer <= 10 ? color(255, 0, 0) : 255);
  text(matchTimer, width / 2, padding - 20);
  pop();

  // Health Bars
  drawHealthBar(padding, padding, barW, barH, player1.hp, player1.maxHp, false);
  drawHealthBar(width - padding - barW, padding, barW, barH, player2.hp, player2.maxHp, true);

  // Player Names (Above) and HP Numeric (Below)
  push();
  fill(255);
  noStroke();
  textFont(metalFont);
  
  // Player 1 UI
  textAlign(LEFT, BOTTOM);
  textSize(24);
  text(player1.name.toUpperCase(), padding, padding - 5);
  textSize(18);
  text(floor(player1.hp) + " / " + player1.maxHp, padding, padding + barH + 25);

  // Player 2 UI
  textAlign(RIGHT, BOTTOM);
  textSize(24);
  text(player2.name.toUpperCase(), width - padding, padding - 5);
  textSize(18);
  text(floor(player2.hp) + " / " + player2.maxHp, width - padding, padding + barH + 25);
  pop();

  // Control Instructions (RESPONSIVE)
  push();
  textFont(metalFont);
  noStroke();
  
  // Responsive sizing and positioning
  let controlTextSize = width * 0.011;
  let controlDetailSize = width * 0.009;
  let bottomY = height * 0.85;  // Changed from fixed value to percentage
  let lineSpacing = height * 0.035;  // Changed from fixed value to percentage
  let sidePadding = width * 0.05;  // Responsive padding
  
  // P1 Controls (Left Side)
  fill(0, 150, 255);
  textAlign(LEFT, TOP);
  textSize(controlTextSize);
  text("P1 CONTROLS", sidePadding, bottomY);
  
  fill(255);
  textSize(controlDetailSize);
  text("  W            Y U", sidePadding, bottomY + lineSpacing);
  text("A S D          H J      SPACE", sidePadding, bottomY + lineSpacing * 2);
  text("MOVE       ATTACK    BLOCK", sidePadding, bottomY + lineSpacing * 3);
  
  // P2 Controls (Right Side)
  fill(255, 50, 50);
  textAlign(RIGHT, TOP);
  textSize(controlTextSize);
  text("P2 CONTROLS", width - sidePadding, bottomY);
  
  fill(255);
  textSize(controlDetailSize);
  
  // Calculate P2 position responsively
  let p2X = width - sidePadding - (width * 0.13);  // Responsive offset
  textAlign(LEFT, TOP);
  
  text("  ^          NUM4  NUM5", p2X, bottomY + lineSpacing);
  text("< v >        NUM1  NUM2         NUM0", p2X, bottomY + lineSpacing * 2);
  text("MOVE           ATTACK           BLOCK", p2X, bottomY + lineSpacing * 3);
  
  pop();
}

function drawHealthBar(x, y, w, h, current, max, mirrored) {
  push();
  rectMode(CORNER);
  // Background
  fill(100, 0, 0);
  rect(x, y, w, h);
  // Health
  let healthW = map(constrain(current, 0, max), 0, max, 0, w);
  fill(0, 255, 100);
  if (mirrored) {
    rect(x + w - healthW, y, healthW, h);
  } else {
    rect(x, y, healthW, h);
  }
  // Border
  noFill();
  stroke(255, 150);
  strokeWeight(2);
  rect(x, y, w, h);
  pop();
}

function drawWinScreen() {
  push();
  rectMode(CORNER);
  fill(0, 200); 
  rect(0, 0, width, height); // Darken the whole screen
  
  textAlign(CENTER, CENTER);
  let header = (matchTimer <= 0 && winnerName === "DRAW") ? "TIME'S UP" : "K.O.";
  
  // Center Header
  drawTitle(header, width / 2, height / 2 - 50, width * 0.1);
  
  // Winner Text
  let msg = (winnerName === "DRAW") ? "IT'S A DRAW!" : winnerName.toUpperCase() + " WINS!";
  drawTitle(msg, width / 2, height / 2 + 80, width * 0.05);
  
  // Reset prompt
  fill(255);
  noStroke();
  textFont(metalFont);
  textSize(width * 0.02);
  text("RELOAD TO PLAY AGAIN", width / 2, height / 2 + 180);
  pop();
}

function spawnDamageIndicator(x, y, amount, isBlocked) {
  damageIndicators.push({
    x: x,
    y: y,
    amount: amount,
    label: isBlocked ? "BLOCK " : "",
    life: 255,
    velY: -2
  });
}

function updateDamageIndicators() {
  for (let i = damageIndicators.length - 1; i >= 0; i--) {
    let ind = damageIndicators[i];
    ind.y += ind.velY;
    ind.life -= 4;
    if (ind.life <= 0) damageIndicators.splice(i, 1);
  }
}

function drawDamageIndicators() {
  push();
  textAlign(CENTER);
  textFont(metalFont);
  for (let ind of damageIndicators) {
    fill(255, 0, 0, ind.life); 
    stroke(0, ind.life);
    strokeWeight(2);
    textSize(24);
    text(ind.label + "-" + ind.amount, ind.x, ind.y);
  }
  pop();
}

function updateMatchLogic() {
  matchTimerFrames--;
  if (matchTimerFrames <= 0) {
    if (matchTimer > 0) {
      matchTimer--;
      matchTimerFrames = 60;
    } else {
      checkTimeOver(); 
    }
  }
  player1.update(player2, groundY);
  player2.update(player1, groundY);
  handleBodyCollision(player1, player2);
  if (typeof checkHit === "function") {
    checkHit(player1, player2);
    checkHit(player2, player1);
  }
  checkWinCondition(); 
}

function checkTimeOver() {
  matchOver = true;
  let p1Ratio = player1.hp / player1.maxHp;
  let p2Ratio = player2.hp / player2.maxHp;
  if (p1Ratio > p2Ratio) winnerName = player1.name;
  else if (p2Ratio > p1Ratio) winnerName = player2.name;
  else winnerName = "DRAW";
}

function checkWinCondition() {
  if (player1.hp <= 0) {
    matchOver = true;
    winnerName = player2.name;
  } else if (player2.hp <= 0) {
    matchOver = true;
    winnerName = player1.name;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  groundY = height - 100;
}