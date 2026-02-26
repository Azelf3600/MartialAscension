// Training Mode - Single player practice with dummy
let trainingPlayer, trainingDummy;
let trainingGroundY;
let trainingDamageIndicators = [];

// Training UI State
let showInputHistory = false; // Toggle with T
let inputHistoryBuffer = []; // Last 10 inputs
const MAX_INPUT_HISTORY = 10;

function initTraining() {
  trainingGroundY = height - 100;
  trainingDamageIndicators = [];
  inputHistoryBuffer = [];
  showInputHistory = false;

  projectiles = [];
  if (p1Buffer) p1Buffer.clear();

  // Create player character (from selection)
  let charH = height * 0.5;
  let playerData = FIGHTERS[selectedTrainingChar];
  trainingPlayer = new Character(
    width * 0.3, 
    trainingGroundY - charH,
    width * 0.08, 
    charH, 
    color(80, 120, 255), 
    PLAYER_CONTROLS.P1, 
    playerData.name, 
    1,
    playerData.archetype
  );

  // Create dummy character (random)
  let dummyData = FIGHTERS[randomDummyIndex];
  trainingDummy = new Character(
    width * 0.7, 
    trainingGroundY - charH, 
    width * 0.08, 
    charH, 
    color(200, 200, 200), // Gray color for dummy
    PLAYER_CONTROLS.P2, // Dummy doesn't use controls
    dummyData.name, 
    -1,
    dummyData.archetype
  );

  // Reset all states
  trainingPlayer.attacking = null;
  trainingPlayer.attackTimer = 0;
  trainingPlayer.isPerformingCombo = false;
  trainingPlayer.hasHit = false;
  trainingPlayer.recoveryTimer = 0;
  
  trainingDummy.attacking = null;
  trainingDummy.attackTimer = 0;
  trainingDummy.isPerformingCombo = false;
  trainingDummy.hasHit = false;
  trainingDummy.recoveryTimer = 0;

  // Camera reset
  if (gameCamera) {
    gameCamera.pos = createVector(width/2, height/2);
  }
}

function drawTraining() {
  if (!trainingPlayer || !trainingDummy) {
    initTraining();
    return;
  }

  background(20);

  gameCamera.update(trainingPlayer, trainingDummy);

  // ✅ Update input buffer (required for dash detection)
  if (p1Buffer) p1Buffer.update();

  push();
  gameCamera.apply();

  // Draw ground
  rectMode(CORNER);
  fill(60);
  noStroke();
  rect(-10000, trainingGroundY, 20000, 2000);

  drawWorldBorders();

  // ✅ FIXED: Update player normally, but manually handle dummy physics
  trainingPlayer.update(trainingDummy, trainingGroundY);
  
  // ✅ Dummy: Only update status effects and physics, NO movement
  updateDummyPhysicsOnly(trainingDummy, trainingPlayer, trainingGroundY);

  updateProjectiles();
  checkProjectileCollisions(trainingPlayer, trainingDummy);

  applyWorldBorders(trainingPlayer);
  applyWorldBorders(trainingDummy);

  handleBodyCollision(trainingPlayer, trainingDummy);
  if (typeof checkHit === "function") {
    checkHit(trainingPlayer, trainingDummy);
    checkHit(trainingDummy, trainingPlayer);
  }

  trainingPlayer.draw();
  trainingDummy.draw();

  drawProjectiles();
  drawPoisonFieldEffect(trainingPlayer, trainingDummy); // ✅ NEW
  drawAzureDragonIndicators(trainingPlayer, trainingDummy);
  updateTrainingDamageIndicators();
  drawTrainingDamageIndicators();

  pop();

  // Draw Training UI
  drawTrainingInterface();
}

function drawTrainingInterface() {
  push();
  
  // ═══════════════════════════════════════════════════════════
  // PLAYER INFO (Top Left)
  // ═══════════════════════════════════════════════════════════
  
  let padding = 50;
  let barW = width * 0.4;
  let barH = 30;

  // Player name
  fill(255);
  noStroke();
  textFont(metalFont);
  textAlign(LEFT, BOTTOM);
  textSize(24);
  text(trainingPlayer.name.toUpperCase(), padding, padding - 5);

  // Health bar
  drawHealthBar(padding, padding, barW, barH, trainingPlayer.hp, trainingPlayer.maxHp, false);

  // HP numeric
  textSize(18);
  text(floor(trainingPlayer.hp) + " / " + trainingPlayer.maxHp, padding, padding + barH + 25);

  // ═══════════════════════════════════════════════════════════
  // DUMMY INFO (Top Right)
  // ═══════════════════════════════════════════════════════════

  fill(255);
  textAlign(RIGHT, BOTTOM);
  textSize(24);
  text("DUMMY " + trainingDummy.name.toUpperCase(), width - padding, padding - 5);

  // Health bar
  drawHealthBar(width - padding - barW, padding, barW, barH, trainingDummy.hp, trainingDummy.maxHp, true);

  // HP numeric
  textSize(18);
  text(floor(trainingDummy.hp) + " / " + trainingDummy.maxHp, width - padding, padding + barH + 25);

  // ═══════════════════════════════════════════════════════════
  // TRAINING CONTROLS (Bottom Left)
  // ═══════════════════════════════════════════════════════════

  let controlX = padding;
  let controlY = height - 120;
  let lineSpacing = 25;

  fill(255, 215, 0);
  textAlign(LEFT, TOP);
  textFont(metalFont);
  textSize(20);
  text("TRAINING CONTROLS:", controlX, controlY);

  fill(255);
  textSize(16);
  controlY += lineSpacing;
  text("R - Reset Position", controlX, controlY);
  controlY += lineSpacing;
  text("E - Reset HP", controlX, controlY);
  controlY += lineSpacing;
  text("T - Toggle Input History", controlX, controlY);
  controlY += lineSpacing;

  // ═══════════════════════════════════════════════════════════
  // INPUT HISTORY (Bottom Right) - Toggle with T
  // ═══════════════════════════════════════════════════════════

if (showInputHistory) {
  // ✅ NEW: Position at bottom center, above controls
  let historyW = width * 0.6; // Wide horizontal box
  let historyH = 80; // Shorter height
  let historyX = width / 2 - 200; // Center horizontally
  let historyY = height - 120; // Above player controls

  // Background box
  fill(20, 220);
  stroke(255, 215, 0);
  strokeWeight(2);
  rectMode(CORNER);
  rect(historyX, historyY, historyW, historyH, 5);

  // Title
  fill(255, 215, 0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(16);
  text("INPUT HISTORY:", historyX + 10, historyY + 10);

  // ✅ NEW: Display last 10 inputs HORIZONTALLY (newest at right)
  fill(255);
  textSize(14);
  textAlign(LEFT, TOP);
  
  // Get last 10 inputs
  let displayStart = Math.max(0, inputHistoryBuffer.length - 14);
  let displayInputs = inputHistoryBuffer.slice(displayStart);
  
  // Calculate spacing for horizontal layout
  let inputSpacing = 60; // Space between each input
  let startX = historyX + 10;
  let inputY = historyY + 40;
  
  // Draw each input horizontally with arrow between them
  for (let i = 0; i < displayInputs.length; i++) {
    let inputX = startX + (i * inputSpacing);
    
    // Draw input text
    fill(255);
    text(displayInputs[i], inputX, inputY);
    
    // Draw arrow between inputs (except after last one)
    if (i < displayInputs.length - 1) {
      fill(200, 200, 200);
      textSize(12);
      text("→", inputX + 30, inputY + 2);
      textSize(14); // Reset size
    }
  }
}

  // ═══════════════════════════════════════════════════════════
  // PLAYER CONTROLS (Bottom Center)
  // ═══════════════════════════════════════════════════════════

  let p1ControlX = width / 2 - 400;
  let p1ControlY = height - 120;

  fill(0, 150, 255);
  textAlign(LEFT, TOP);
  textSize(20);
  text("P1 CONTROLS", p1ControlX, p1ControlY);

  fill(255);
  textSize(16);
  text("  W            Y U", p1ControlX, p1ControlY + 25);
  text("A S D          H J      SPACE", p1ControlX, p1ControlY + 45);
  text("MOVE       ATTACK    BLOCK", p1ControlX, p1ControlY + 65);

  pop();
}

function handleTrainingInput(key, keyCode) {
  // ✅ NEW: ESC to pause
  if (keyCode === ESCAPE) {
    currentState = GAME_STATE.PAUSE_MENU_TRAINING;
    return; // Don't process other inputs
  }

  // Reset Position (R)
  if (key === 'r' || key === 'R') {
    let charH = height * 0.5;
    trainingPlayer.x = width * 0.3;
    trainingPlayer.y = trainingGroundY - charH;
    trainingPlayer.velX = 0;
    trainingPlayer.velY = 0;
    trainingPlayer.isGrounded = true;

    trainingDummy.x = width * 0.7;
    trainingDummy.y = trainingGroundY - charH;
    trainingDummy.velX = 0;
    trainingDummy.velY = 0;
    trainingDummy.isGrounded = true;

    console.log("Positions reset!");
  }

  // Reset HP (E)
  if (key === 'e' || key === 'E') {
    trainingPlayer.hp = trainingPlayer.maxHp;
    trainingDummy.hp = trainingDummy.maxHp;
    console.log("HP reset!");
  }

  // Toggle Input History (T)
  if (key === 't' || key === 'T') {
    showInputHistory = !showInputHistory;
    console.log("Input History:", showInputHistory ? "ON" : "OFF");
  }

  // Normal combat input (player only)
  if (typeof trainingPlayer !== 'undefined') {
    handleRecording(trainingPlayer, p1Buffer, keyCode);
  }
}

function recordTrainingInput(move) {
  // Add to history buffer
  inputHistoryBuffer.push(move);
  
  // Keep only last 20 inputs
  if (inputHistoryBuffer.length > 20) {
    inputHistoryBuffer.shift();
  }
}

// Training damage indicators (same as match)
function spawnTrainingDamageIndicator(x, y, amount, isBlocked) {
  trainingDamageIndicators.push({
    x: x,
    y: y,
    amount: amount,
    label: isBlocked ? "BLOCK " : "",
    life: 255,
    velY: -2
  });
}

function updateTrainingDamageIndicators() {
  for (let i = trainingDamageIndicators.length - 1; i >= 0; i--) {
    let ind = trainingDamageIndicators[i];
    ind.y += ind.velY;
    ind.life -= 4;
    if (ind.life <= 0) trainingDamageIndicators.splice(i, 1);
  }
}

function drawTrainingDamageIndicators() {
  push();
  textAlign(CENTER);
  textFont(metalFont);
  for (let ind of trainingDamageIndicators) {
    fill(255, 0, 0, ind.life);
    stroke(0, ind.life);
    strokeWeight(2);
    textSize(24);
    text(ind.label + "-" + ind.amount, ind.x, ind.y);
  }
  pop();
}

// Override global spawnDamageIndicator when in training
function spawnDamageIndicator(x, y, amount, isBlocked) {
  if (currentState === GAME_STATE.TRAINING) {
    spawnTrainingDamageIndicator(x, y, amount, isBlocked);
  } else {
    // Use matchMulti version
    damageIndicators.push({
      x: x,
      y: y,
      amount: amount,
      label: isBlocked ? "BLOCK " : "",
      life: 255,
      velY: -2
    });
  }
}

// Draw Poison Flower Field ground effect
function drawPoisonFieldEffect(p1, p2) {
  let fieldCaster = null;
  if (p1.isPoisonFieldActive) fieldCaster = p1;
  else if (p2.isPoisonFieldActive) fieldCaster = p2;
  
  if (fieldCaster) {
    push();
    
    // Pulsing green ground line across entire stage
    let pulseAlpha = 150 + sin(frameCount * 0.1) * 100;
    let pulseThick = 4 + sin(frameCount * 0.15) * 2;
    
    drawingContext.shadowBlur = 30;
    drawingContext.shadowColor = 'rgba(0, 255, 0, 0.9)';
    
    // Main ground line
    stroke(0, 255, 80, pulseAlpha);
    strokeWeight(pulseThick);
    line(-10000, trainingGroundY, 10000, trainingGroundY);
    
    // Secondary glow line
    stroke(100, 255, 150, pulseAlpha * 0.5);
    strokeWeight(pulseThick * 2);
    line(-10000, trainingGroundY, 10000, trainingGroundY);
    
    // Flower particles rising from ground
    for (let i = 0; i < 20; i++) {
      let flowerX = random(-10000, 10000);
      let flowerY = trainingGroundY - random(5, 40);
      
      fill(0, 255, 100, random(100, 200));
      noStroke();
      ellipse(flowerX, flowerY, random(4, 12), random(4, 12));
    }
    
    // Timer indicator on ground
    let timeLeft = Math.ceil(fieldCaster.poisonFieldTimer / 60);
    fill(0, 255, 80, 200);
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(20);
    text(`☠ POISON FIELD: ${timeLeft}s ☠`, 0, trainingGroundY - 10);
    
    pop();
  }
}

// Update dummy physics without allowing movement
function updateDummyPhysicsOnly(dummy, opponent, groundY) {
  // ✅ Handle hitstun countdown
  if (dummy.hitStun > 0) {
    dummy.hitStun--;
    dummy.isHit = true;
    dummy.attacking = null;
  } else {
    dummy.isHit = false;
  }

  // ✅ Handle recovery timer
  if (dummy.recoveryTimer > 0) {
    dummy.recoveryTimer--;
  }

  // ✅ Update cooldowns
  for (let comboName in dummy.comboCooldowns) {
    if (dummy.comboCooldowns[comboName] > 0) {
      dummy.comboCooldowns[comboName]--;
    }
  }

  // ✅ Update all status effects (poison, buffs, etc.)
  // Poison Hands
  if (dummy.isPoisonHandsActive && dummy.poisonHandsTimer > 0) {
    dummy.poisonHandsTimer--;
    if (dummy.poisonHandsTimer <= 0) {
      dummy.isPoisonHandsActive = false;
      if (dummy.poisonHandsCooldownPending) {
        dummy.comboCooldowns["Poison Hands"] = 120;
        dummy.poisonHandsCooldownPending = false;
      }
    }
  }

  // Azure Dragon Scales
  if (dummy.isAzureScalesActive && dummy.azureScalesTimer > 0) {
    dummy.azureScalesTimer--;
    if (dummy.azureScalesTimer <= 0) {
      dummy.isAzureScalesActive = false;
      if (dummy.azureScalesCooldownPending) {
        dummy.comboCooldowns["Azure Dragon Scales"] = 300;
        dummy.azureScalesCooldownPending = false;
      }
    }
  }

  // Tortoise Body
  if (dummy.isTortoiseBodyActive && dummy.tortoiseBodyTimer > 0) {
    dummy.tortoiseBodyTimer--;
    if (dummy.tortoiseBodyTimer <= 0) {
      dummy.isTortoiseBodyActive = false;
      if (dummy.tortoiseBodyCooldownPending) {
        dummy.comboCooldowns["Undying Tortoise Body"] = 300;
        dummy.tortoiseBodyCooldownPending = false;
      }
    }
  }

  // Poison DOT
  if (dummy.isPoisoned && dummy.poisonTimer > 0) {
    dummy.poisonTimer--;
    dummy.poisonTickTimer--;
    
    if (dummy.poisonTickTimer <= 0) {
      dummy.poisonTickTimer = dummy.poisonTickInterval;
      dummy.hp -= dummy.poisonDamage;
      if (dummy.hp < 0) dummy.hp = 0;
      
      if (typeof spawnDamageIndicator === 'function') {
        spawnDamageIndicator(dummy.x + dummy.w / 2, dummy.y - 20, dummy.poisonDamage, false);
      }
    }
    
    if (dummy.poisonTimer <= 0) {
      dummy.isPoisoned = false;
      dummy.poisonDamage = 0;
    }
  }

  // ✅ Face opponent (only visual, no movement)
  dummy.facing = (dummy.x < opponent.x) ? 1 : -1;

  // ✅ Apply physics (gravity, falling)
  dummy.applyPhysics(groundY);
  
  // ✅ NO handleMovement() - dummy stays stationary
  // ✅ NO handleAttack() - dummy doesn't attack
}