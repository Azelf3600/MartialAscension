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
const ROUND_TIME = 60; // Set this once here
let matchTimer = ROUND_TIME;
let matchTimerFrames = 60;

function initMatch() {
  groundY = height - 100;
  matchOver = false;
  winnerName = "";
  damageIndicators = [];

  // Reset Countdown State
  countdown = 3;
  countdownTimer = 60;
  fightStarted = false;
  showFightText = false;
  fightTextTimer = 60;

  // Reset Match Timer
  matchTimer = ROUND_TIME;
  matchTimerFrames = 60;

  let p1Data = FIGHTERS[p1Selected];
  player1 = new Character(
    width * 0.2, 
    groundY - (height * 0.6), 
    width * 0.08, 
    height * 0.6, 
    color(80, 120, 255), 
    PLAYER_CONTROLS.P1, 
    p1Data.name, 
    1,
    p1Data.archetype
  );

  let p2Data = FIGHTERS[p2Selected];
  player2 = new Character(
    width * 0.8 - (width * 0.08), 
    groundY - (height * 0.6), 
    width * 0.08, 
    height * 0.6, 
    color(255, 80, 80), 
    PLAYER_CONTROLS.P2, 
    p2Data.name, 
    -1,
    p2Data.archetype
  );
}

function drawMatchMulti() {
  if (!player1 || !player2) {
    initMatch();
    return;
  }

  background(20); 
  drawStageBackground();

  handleCountdown();

  // ONLY update players if fight has started and match isn't over
  if (!matchOver && fightStarted) {
    
    // --- TIMER LOGIC ---
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

  updateDamageIndicators();
  drawDamageIndicators();
  
  player1.draw();
  player2.draw();

  drawInterface();
  drawInputDebug();
  
  drawCountdownOverlay();
  if (matchOver) drawWinScreen();
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
  textAlign(CENTER, CENTER);
  textFont(metalFont); 
  
  if (!fightStarted && countdown > 0) {
    textSize(width * 0.12);
    fill(255);
    stroke(0);
    strokeWeight(8);
    text(countdown, width / 2, height / 2);
  } else if (showFightText) {
    textSize(width * 0.18);
    fill(255, 0, 0); 
    stroke(255);    
    strokeWeight(10);
    text("FIGHT!", width / 2, height / 2);
  }
  pop();
}

function drawStageBackground() {
  fill(80); 
  noStroke();
  rect(0, groundY, width, height - groundY); 
}

function drawInterface() {
  let barW = width * 0.4;
  let barH = 30;
  let padding = 50;

  // --- TIMER ---
  push();
  textAlign(CENTER, TOP);
  textSize(50);
  textFont(metalFont);
  stroke(0);
  strokeWeight(4);
  fill(matchTimer <= 10 ? color(255, 0, 0) : 255);
  text(matchTimer, width / 2, padding);
  pop();

  // --- P1 UI ---
  drawHealthBar(padding, padding, barW, barH, player1.hp, player1.maxHp);
  fill(255);
  noStroke();
  textAlign(LEFT, BOTTOM);
  textSize(24);
  text(player1.name.toUpperCase(), padding, padding - 5);

  fill(255);
  stroke(0); 
  strokeWeight(2);
  textAlign(LEFT, TOP);
  textSize(16);
  text(`${Math.floor(player1.hp)} / ${player1.maxHp}`, padding, padding + barH + 5);

  // --- P2 UI ---
  drawHealthBar(width - padding - barW, padding, barW, barH, player2.hp, player2.maxHp, true);
  noStroke();
  fill(255);
  textAlign(RIGHT, BOTTOM);
  textSize(24);
  text(player2.name.toUpperCase(), width - padding, padding - 5);

  fill(255);
  stroke(0);
  strokeWeight(2);
  textAlign(RIGHT, TOP);
  textSize(16);
  text(`${Math.floor(player2.hp)} / ${player2.maxHp}`, width - padding, padding + barH + 5);
}

function drawHealthBar(x, y, w, h, current, max, mirrored = false) {
  fill(100, 0, 0);
  rect(x, y, w, h);
  fill(0, 255, 100);
  let healthW = map(current, 0, max, 0, w);
  if (mirrored) {
    rect(x + w - healthW, y, healthW, h);
  } else {
    rect(x, y, healthW, h);
  }
}

function drawInputDebug() {
  textAlign(CENTER, TOP);
  textSize(16);
  fill(80, 120, 255);
  if (player1.hitStun > 0) text("STUNNED!", player1.x + player1.w/2, player1.y + player1.h + 10);
  fill(255, 80, 80);
  if (player2.hitStun > 0) text("STUNNED!", player2.x + player2.w/2, player2.y + player2.h + 10);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  groundY = height - 100;
  if (player1 && player2) {
    let p1Hp = player1.hp;
    let p2Hp = player2.hp;
    initMatch(); 
    player1.hp = p1Hp;
    player2.hp = p2Hp;
  }
}

function updateDamageIndicators() {
  for (let i = damageIndicators.length - 1; i >= 0; i--) {
    let ind = damageIndicators[i];
    ind.y -= 2;
    ind.life -= 5;
    if (ind.life <= 0) damageIndicators.splice(i, 1);
  }
}

function drawDamageIndicators() {
  push();
  textAlign(CENTER);
  textSize(24);
  textStyle(BOLD);
  for (let ind of damageIndicators) {
    fill(255, 0, 0, ind.life); 
    stroke(0, ind.life);
    strokeWeight(2);
    text(ind.label + ind.amount, ind.x, ind.y);
  }
  pop();
}

function spawnDamageIndicator(x, y, amount, wasBlocked = false) {
  damageIndicators.push({
    x: x, y: y, amount: amount, 
    label: wasBlocked ? "BLOCK " : "", 
    life: 255
  });
}

function checkTimeOver() {
  matchOver = true;
  let p1Ratio = player1.hp / player1.maxHp;
  let p2Ratio = player2.hp / player2.maxHp;

  if (p1Ratio > p2Ratio) {
    winnerName = player1.name;
  } else if (p2Ratio > p1Ratio) {
    winnerName = player2.name;
  } else {
    winnerName = "DRAW";
  }
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

function drawWinScreen() {
  push();
  fill(0, 180); 
  rect(0, 0, width, height);
  textAlign(CENTER, CENTER);
  
  textFont(metalFont); 
  
  textSize(width * 0.08);
  fill(255, 0, 0); 
  stroke(0);
  strokeWeight(5);
  let header = (matchTimer <= 0) ? "TIME'S UP" : "K.O.";
  text(header, width / 2, height / 2 - 80);
  
  textSize(width * 0.04);
  fill(255);
  noStroke();
  let msg = (winnerName === "DRAW") ? "IT'S A DRAW!" : winnerName.toUpperCase() + " WINS!";
  text(msg, width / 2, height / 2 + 30);
  
  textSize(width * 0.02);
  text("RELOAD TO PLAY AGAIN", width / 2, height / 2 + 100);
  pop();
}