// Global instances for the match
let player1, player2;
let groundY;
let damageIndicators = []; // Holds active floating numbers
let matchOver = false;
let winnerName = "";

function initMatch() {
  groundY = height - 100;

  let p1Data = FIGHTERS[p1Selected];
  player1 = new Character(
    width * 0.2, 
    groundY - (height * 0.6), 
    width * 0.08, 
    height * 0.6, 
    color(80, 120, 255), // Blue
    PLAYER_CONTROLS.P1, 
    p1Data.name, 
    1,
    p1Data.archetype // Ensure archetype is passed!
  );

  let p2Data = FIGHTERS[p2Selected];
  player2 = new Character(
    width * 0.8 - (width * 0.08), 
    groundY - (height * 0.6), 
    width * 0.08, 
    height * 0.6, 
    color(255, 80, 80), // Red
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

  background(25);
  drawStageBackground();

  // ONLY update players if the match isn't over
  if (!matchOver) {
    player1.update(player2, groundY);
    player2.update(player1, groundY);
    handleBodyCollision(player1, player2);

    if (typeof checkHit === "function") {
      checkHit(player1, player2);
      checkHit(player2, player1);
    }
    
    checkWinCondition(); // Check for 0 HP
  }

  updateDamageIndicators();
  drawDamageIndicators();
  
  player1.draw();
  player2.draw();

  drawInterface();
  drawInputDebug();
  if (matchOver) drawWinScreen(); // New overlay function
}

function drawStageBackground() {
  fill(120);
  noStroke();
  // Drawing the ground based on current groundY
  rect(0, groundY, width, height - groundY); 
}

//FOR ACTUAL PLAYING
/*function drawInterface() {
  let barW = width * 0.4;
  let barH = 30;
  let padding = 50;

  // --- P1 UI ---
  drawHealthBar(padding, padding, barW, barH, player1.hp, player1.maxHp);
  fill(255, 255, 255);
  textAlign(LEFT, BOTTOM);
  text(player1.name.toUpperCase(), padding, padding - 5);

  // --- P2 UI ---
  drawHealthBar(width - padding - barW, padding, barW, barH, player2.hp, player2.maxHp, true);
  fill(255, 255, 255);
  textAlign(RIGHT, BOTTOM);
  text(player2.name.toUpperCase(), width - padding, padding - 5);
}*/ 

function drawInterface() {
  let barW = width * 0.4;
  let barH = 30;
  let padding = 50;

  // --- P1 UI ---
  drawHealthBar(padding, padding, barW, barH, player1.hp, player1.maxHp);
  
  // P1 Name
  fill(255);
  noStroke();
  textAlign(LEFT, BOTTOM);
  textSize(24);
  text(player1.name.toUpperCase(), padding, padding - 5);

  // P1 HP Debug Text (Numerical)
  fill(255);
  stroke(0); // Black outline for readability
  strokeWeight(2);
  textAlign(LEFT, TOP);
  textSize(16);
  text(`${Math.floor(player1.hp)} / ${player1.maxHp}`, padding, padding + barH + 5);

  // --- P2 UI ---
  drawHealthBar(width - padding - barW, padding, barW, barH, player2.hp, player2.maxHp, true);
  
  // P2 Name
  noStroke();
  fill(255);
  textAlign(RIGHT, BOTTOM);
  textSize(24);
  text(player2.name.toUpperCase(), width - padding, padding - 5);

  // P2 HP Debug Text (Numerical)
  fill(255);
  stroke(0);
  strokeWeight(2);
  textAlign(RIGHT, TOP);
  textSize(16);
  text(`${Math.floor(player2.hp)} / ${player2.maxHp}`, width - padding, padding + barH + 5);
  
  noStroke(); // Reset stroke for other drawing functions
}

// Helper function to avoid repeating health bar code twice
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
  
  fill(80, 120, 255); // Blue for P1 Stun info
  if (player1.hitStun > 0) text("STUNNED!", player1.x + player1.w/2, player1.y + player1.h + 10);
  
  fill(255, 80, 80); // Red for P2 Stun info
  if (player2.hitStun > 0) text("STUNNED!", player2.x + player2.w/2, player2.y + player2.h + 10);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  groundY = height - 100;
  
  // Instead of manual lines, use a method (if you add it to your class) 
  // or just accept that resizing resets the match for now.
  if (player1 && player2) {
    // Keep existing HP but update sizes
    let p1Hp = player1.hp;
    let p2Hp = player2.hp;
    initMatch(); 
    player1.hp = p1Hp;
    player2.hp = p2Hp;
  }
}

//DAMAGE INDICATOR
function updateDamageIndicators() {
  for (let i = damageIndicators.length - 1; i >= 0; i--) {
    let ind = damageIndicators[i];
    ind.y -= 2;      // Float upward
    ind.life -= 5;   // Fade out over time
    
    if (ind.life <= 0) {
      damageIndicators.splice(i, 1); // Remove when faded
    }
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
    // Combine label and amount here for display only
    text(ind.label + ind.amount, ind.x, ind.y);
  }
  pop();
}

// Function to call from your collision system
function spawnDamageIndicator(x, y, amount, wasBlocked = false) {
  damageIndicators.push({
    x: x,
    y: y,
    amount: amount, 
    label: wasBlocked ? "BLOCK " : "", // Store label separately
    life: 255
  });
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
  fill(0, 150); // Darken the background
  rect(0, 0, width, height);
  
  textAlign(CENTER, CENTER);
  textSize(64);
  fill(255, 215, 0); // Gold
  stroke(0);
  strokeWeight(5);
  text("K.O.", width / 2, height / 2 - 50);
  
  textSize(32);
  fill(255);
  noStroke();
  text(winnerName.toUpperCase() + " WINS!", width / 2, height / 2 + 30);
  
  textSize(16);
  text("RELOAD TO PLAY AGAIN", width / 2, height / 2 + 80);
  pop();
}