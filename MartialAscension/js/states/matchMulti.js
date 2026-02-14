// Global instances for the match
let player1, player2;
let groundY;
let damageIndicators = [];
let matchOver = false;
let winnerName = "";

let leftBorder = -9800;
let rightBorder = 9800;
const STAGE_WIDTH = 20000; // Total stage width
const STAGE_START_X = -10000; // Left edge of stage

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

// Round System Variables - FIRST TO 3 WINS
let currentRound = 1;
const WINS_NEEDED = 3; // Changed from MAX_ROUNDS
let p1RoundsWon = 0;
let p2RoundsWon = 0;
let roundOver = false;
let roundWinner = "";
let showRoundResult = false;
let roundResultTimer = 180; // 3 seconds (180 frames)
let gameOver = false;

function initMatch() {
  groundY = height - 100;
  matchOver = false;
  winnerName = "";
  damageIndicators = [];

  // Borders are now fixed to stage dimensions (no need to recalculate)

  countdown = 3;
  countdownTimer = 60;
  fightStarted = false;
  showFightText = false;
  fightTextTimer = 60;

  matchTimer = ROUND_TIME;
  matchTimerFrames = 60;

  if (currentRound === 1) {
    p1RoundsWon = 0;
    p2RoundsWon = 0;
    gameOver = false;
  }
  
  roundOver = false;
  roundWinner = "";
  showRoundResult = false;
  roundResultTimer = 180;

  let charH = height * 0.5;
  let p1Data = FIGHTERS[p1Selected];
  player1 = new Character(
    width * 0.2, 
    groundY - charH,
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

  gameCamera.update(player1, player2);

  push();
    gameCamera.apply();
    
    rectMode(CORNER);
    fill(60);
    noStroke();
    rect(-10000, groundY, 20000, 2000);
    
    drawWorldBorders();

    handleCountdown();

    if (showRoundResult) {
      handleRoundResult();
    } else if (!matchOver && !roundOver && fightStarted) {
      updateMatchLogic();
    }

    player1.draw();
    player2.draw();
    updateDamageIndicators();
    drawDamageIndicators();
  pop(); 

  drawInterface();
  
  if (!showRoundResult && !gameOver) {
    drawCountdownOverlay();
  }
  
  if (showRoundResult) {
    drawRoundResultScreen();
  }
}

// NEW: Draw visible border walls
function drawWorldBorders() {
  push();
  rectMode(CORNER);
  fill(100, 100, 120); // Gray-blue wall color
  noStroke();
  
  // Left wall
  let wallWidth = 50;
  rect(leftBorder - wallWidth, groundY - height, wallWidth, height);
  
  // Right wall
  rect(rightBorder, groundY - height, wallWidth, height);
  
  // Optional: Add border line on ground
  stroke(150, 150, 170);
  strokeWeight(3);
  line(leftBorder, groundY, leftBorder, groundY - 200);
  line(rightBorder, groundY, rightBorder, groundY - 200);
  
  pop();
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

function handleRoundResult() {
  roundResultTimer--;
  
  if (roundResultTimer <= 0) {
    showRoundResult = false;
    
    // Check if game is over (someone won 3 rounds)
    if (p1RoundsWon >= WINS_NEEDED || p2RoundsWon >= WINS_NEEDED) {
      gameOver = true;
      winnerName = (p1RoundsWon >= WINS_NEEDED) ? player1.name : player2.name;
      
      // NEW: Go to win screen instead of showing overlay
      currentState = GAME_STATE.WIN_SCREEN_MULTI;
    } else {
      // Start next round
      currentRound++;
      initMatch();
    }
  }
}

function drawCountdownOverlay() {
  push();
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

  // Round Indicators - Dynamic based on wins
  push();
  let roundSize = 20;
  let roundSpacing = 5;
  let roundY = padding + 45;

  // P1 Round Wins (Right to Left - fills from right)
  let maxDisplay = Math.max(WINS_NEEDED, Math.max(p1RoundsWon, p2RoundsWon));
  for (let i = 0; i < maxDisplay; i++) {
    // Start from right side of P1's health bar
    let x = padding + barW - (i * (roundSize + roundSpacing));
  
    // FIXED: Fill from right properly
    if (i < p1RoundsWon) { // Changed from (maxDisplay - 1 - i) < p1RoundsWon
      fill(0, 150, 255); // Blue (won)
    } else {
      fill(50); // Dark gray (not won)
    }
    noStroke();
    circle(x, roundY, roundSize);
  }

  // P2 Round Wins (Left to Right - fills from left)
  for (let i = 0; i < maxDisplay; i++) {
    // Start from left side of P2's health bar
    let x = (width - padding - barW) + (i * (roundSize + roundSpacing));
  
    if (i < p2RoundsWon) {
      fill(255, 50, 50); // Red (won)
    } else {
      fill(50); // Dark gray (not won)
    }
      noStroke();
    circle(x, roundY, roundSize);
  }

  // Current Round Number
  textAlign(CENTER, TOP);
  textFont(metalFont);
  textSize(18);
  fill(255);
  noStroke();
  text("ROUND " + currentRound, width / 2, padding + 50);
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
  let bottomY = height * 0.85;
  let lineSpacing = height * 0.035;
  let sidePadding = width * 0.05;
  
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
  let p2X = width - sidePadding - (width * 0.13);
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

function drawRoundResultScreen() {
  push();
  rectMode(CORNER);
  fill(0, 220); // Semi-transparent black overlay
  rect(0, 0, width, height);
  
  textAlign(CENTER, CENTER);
  
  // K.O. or Time's Up - Better positioning
  let header = (matchTimer <= 0 && roundWinner === "DRAW") ? "TIME'S UP" : "K.O.";
  drawTitle(header, width / 2, height * 0.35, width * 0.1);
  
  // Round Winner - Better spacing
  let msg;
  if (roundWinner === "DRAW") {
    msg = "DRAW!";
  } else {
    msg = roundWinner.toUpperCase() + " WINS!";
  }
  drawTitle(msg, width / 2, height * 0.52, width * 0.05);
  
  // Round score - Using metalFont, better positioning
  fill(255);
  noStroke();
  textFont(metalFont);
  textSize(width * 0.022);
  text(player1.name.toUpperCase() + " " + p1RoundsWon + " - " + p2RoundsWon + " " + player2.name.toUpperCase(), 
       width / 2, height * 0.62);
  
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
  
  // Apply world borders
  applyWorldBorders(player1);
  applyWorldBorders(player2);
  
  handleBodyCollision(player1, player2);
  if (typeof checkHit === "function") {
    checkHit(player1, player2);
    checkHit(player2, player1);
  }
  checkWinCondition(); 
}

// World border collision
function applyWorldBorders(fighter) {
  // Left border (stage edge)
  if (fighter.x < leftBorder) {
    fighter.x = leftBorder;
    fighter.velX = 0;
  }
  
  // Right border (stage edge)
  if (fighter.x + fighter.w > rightBorder) {
    fighter.x = rightBorder - fighter.w;
    fighter.velX = 0;
  }
}

// Draw border walls at stage edges
function drawWorldBorders() {
  push();
  rectMode(CORNER);
  
  // Wall appearance
  let wallWidth = 100;
  let wallHeight = height * 2; // Tall enough to be visible
  
  // Left wall (gray-blue)
  fill(80, 90, 100);
  noStroke();
  rect(leftBorder - wallWidth, groundY - wallHeight, wallWidth, wallHeight);
  
  // Right wall (gray-blue)
  fill(80, 90, 100);
  rect(rightBorder, groundY - wallHeight, wallWidth, wallHeight);
  
  // Border indicators on ground (optional - shows exact boundary)
  stroke(200, 200, 220, 150);
  strokeWeight(5);
  line(leftBorder, groundY, leftBorder, groundY - 300);
  line(rightBorder, groundY, rightBorder, groundY - 300);
  
  pop();
}

function checkTimeOver() {
  if (roundOver) return;
  
  roundOver = true;
  let p1Ratio = player1.hp / player1.maxHp;
  let p2Ratio = player2.hp / player2.maxHp;
  
  if (p1Ratio > p2Ratio) {
    roundWinner = player1.name;
    p1RoundsWon++;
  } else if (p2Ratio > p1Ratio) {
    roundWinner = player2.name;
    p2RoundsWon++;
  } else {
    roundWinner = "DRAW";
  }
  
  showRoundResult = true;
  roundResultTimer = 180;
}

function checkWinCondition() {
  if (player1.hp <= 0 && !roundOver) {
    roundOver = true;
    roundWinner = player2.name;
    p2RoundsWon++;
    showRoundResult = true;
    roundResultTimer = 180;
  } else if (player2.hp <= 0 && !roundOver) {
    roundOver = true;
    roundWinner = player1.name;
    p1RoundsWon++;
    showRoundResult = true;
    roundResultTimer = 180;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  groundY = height - 100;
}