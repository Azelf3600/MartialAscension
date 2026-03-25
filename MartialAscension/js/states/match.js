// Single Player Match (vs AI)
let singlePlayer1, singlePlayer2;
let singleGroundY;
let singleMatchOver = false;
let singleWinnerName = "";
let singleCountdown = 3;
let singleCountdownTimer = 60;
let singleFightStarted = false;
let singleShowFightText = false;
let singleFightTextTimer = 60;

// Round System (Best of 3)
let singleCurrentRound = 1;
let singlePlayer1RoundsWon = 0;
let singlePlayer2RoundsWon = 0;
let singleGameOver = false;
let singleRoundOver = false;
let singleShowRoundResult = false;
let singleRoundResultTimer = 0;

// Timer System
const SINGLE_ROUND_TIME = 99;
let singleMatchTimer = SINGLE_ROUND_TIME;
let singleMatchTimerFrames = 60;

function initMatchSingle() {
  console.log("🔷 initMatchSingle() called - Round", singleCurrentRound);
  
  singleGroundY = height - 100;
  singleMatchOver = false;
  singleRoundOver = false;
  singleShowRoundResult = false;
  singleRoundResultTimer = 0;
  singleWinnerName = "";
  singleDamageIndicators = [];

  singleCountdown = 3;
  singleCountdownTimer = 60;
  singleFightStarted = false;
  singleShowFightText = false;
  singleFightTextTimer = 60;

  // Timer reset
  singleMatchTimer = SINGLE_ROUND_TIME;
  singleMatchTimerFrames = 60;

  // Reset round wins only on first round
  if (singleCurrentRound === 1) {
    singlePlayer1RoundsWon = 0;
    singlePlayer2RoundsWon = 0;
    singleGameOver = false;
  }

  projectiles = [];
  if (p1Buffer) p1Buffer.clear();
  aiController = null;


  // Null checks (For Debugging)
  if (typeof campaignPlayerChar === 'undefined') {
    console.error("❌ campaignPlayerChar is undefined!");
    return;
  }
  
  if (!campaignOpponents || campaignOpponents.length === 0) {
    console.error("❌ campaignOpponents is empty or undefined!");
    return;
  }
  
  if (!FIGHTERS || FIGHTERS.length === 0) {
    console.error("❌ FIGHTERS array is empty or undefined!");
    return;
  }

  // Create player character
  let charH = height * 0.5;
  let playerData = FIGHTERS[campaignPlayerChar];
  
  singlePlayer1 = new Character(
    width * 0.2, 
    singleGroundY - charH,
    width * 0.08, 
    charH, 
    color(80, 120, 255), 
    PLAYER_CONTROLS.P1, 
    playerData.name, 
    1,
    playerData.archetype
  );

  // Create AI character
  let opponentIndex = campaignOpponents[campaignProgress];
  let opponentData = FIGHTERS[opponentIndex];
  
  singlePlayer2 = new Character(
    width * 0.8, 
    singleGroundY - charH, 
    width * 0.08, 
    charH, 
    color(255, 80, 80), 
    PLAYER_CONTROLS.P2,
    opponentData.name, 
    -1,
    opponentData.archetype
  );

  // Camera reset
  if (gameCamera) {
    gameCamera.pos = createVector(width/2, height/2);
  }

  console.log("✅ Match initialized - Round", singleCurrentRound);
}

function drawMatch() {
  if (!singlePlayer1 || !singlePlayer2) {
    console.error("❌ CRITICAL: Players not initialized in drawMatch()!");
    background(20);
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("ERROR: Players not initialized!", width/2, height/2);
    return;
  }

  background(20);
  
  // Render the unique campaign location before updating camera offsets!
  let cStageIndex = campaignStages[campaignProgress];
  let currentStageMap = (typeof cStageIndex === "number" && STAGES[cStageIndex]) ? STAGES[cStageIndex] : {};
  // Render match-specific high quality background image if available, else fallback to select screen thumnail
  let bgImg = currentStageMap.ingameImg || currentStageMap.img;
  
  if (bgImg) {
    if (typeof drawStageBackground === "function") {
      drawStageBackground(bgImg);
    } else {
      push();
      imageMode(CENTER);
      image(bgImg, width/2, height/2, width, height);
      pop();
    }
  }

  gameCamera.update(singlePlayer1, singlePlayer2);

  if (p1Buffer) p1Buffer.update();

  push();
  gameCamera.apply();

  // Draw detailed ground
  if (typeof drawStageGround === "function") {
    drawStageGround(currentStageMap, singleGroundY);
  } else {
    rectMode(CORNER);
    fill(60);
    noStroke();
    rect(-10000, singleGroundY, 20000, 2000);
  }

  drawSingleWorldBorders();
  handleSingleCountdown();

  // Update match logic
  if (singleShowRoundResult) {
    handleSingleRoundResult();
  } else if (singleFightStarted && !singleRoundOver && !singleMatchOver) {
    updateSingleMatchLogic();
  }

  singlePlayer1.draw();
  singlePlayer2.draw();

  drawProjectiles();
  drawPoisonFieldEffectSingle(singlePlayer1, singlePlayer2);
  drawAzureDragonIndicators(singlePlayer1, singlePlayer2);
  updateSingleMatchDamageIndicators();
  drawSingleMatchDamageIndicators();
  drawAIDebug(singlePlayer1);
  pop();

  drawSingleMatchUI();
  
  if (!singleShowRoundResult && !singleGameOver) {
    drawSingleCountdownOverlay();
  }
  
  if (singleShowRoundResult) {
    drawSingleRoundResultScreen();
  }
}

function updateSingleMatchLogic() {
  if (!singleFightStarted) return;

  // Timer countdown
  singleMatchTimerFrames--;
  if (singleMatchTimerFrames <= 0) {
    if (singleMatchTimer > 0) {
      singleMatchTimer--;
      singleMatchTimerFrames = 60;
    } else {
      checkSingleTimeOver();
    }
  }

  singlePlayer1.update(singlePlayer2, singleGroundY);
  updateAIPhysicsOnly(singlePlayer2, singlePlayer1, singleGroundY);
  updateSinglePoisonEffects();
  updateProjectiles();
  checkProjectileCollisions(singlePlayer1, singlePlayer2);

  applySingleWorldBorders(singlePlayer1);
  applySingleWorldBorders(singlePlayer2);

  handleBodyCollision(singlePlayer1, singlePlayer2);
  
  if (typeof checkHit === "function") {
    checkHit(singlePlayer1, singlePlayer2);
    checkHit(singlePlayer2, singlePlayer1);
  }

  checkSingleMatchWinCondition();
}

function handleSingleRoundResult() {
  singleRoundResultTimer--;
  
  if (singleRoundResultTimer <= 0) {
    singleShowRoundResult = false;
    
    // Check win condition
    if (singlePlayer1RoundsWon >= 2 || singlePlayer2RoundsWon >= 2) {
      singleGameOver = true;
      // PLAYER WON THE MATCH
      if (singlePlayer1RoundsWon >= 2) {
        campaignProgress++; 
        // Check if campaign is complete 
        if (campaignProgress >= 3) {
          // Campaign complete - go to final lore screen 
          currentState = GAME_STATE.LORE_SCREEN;
        } else {
          // More opponents remain - go to next lore screen
          singleCurrentRound = 1;
          currentState = GAME_STATE.LORE_SCREEN;
        }
      } 
      // PLAYER LOST THE MATCH
      else {
        currentState = GAME_STATE.WIN_SCREEN;
      }
    } else {
      singleCurrentRound++;
      initMatchSingle();
    }
  }
}

// Check timer expired
function checkSingleTimeOver() {
  if (singleRoundOver) return;
  
  singleRoundOver = true;
  let p1Ratio = singlePlayer1.hp / singlePlayer1.maxHp;
  let p2Ratio = singlePlayer2.hp / singlePlayer2.maxHp;
  
  if (p1Ratio > p2Ratio) {
    singleWinnerName = singlePlayer1.name;
    singlePlayer1RoundsWon++;
  } else if (p2Ratio > p1Ratio) {
    singleWinnerName = singlePlayer2.name;
    singlePlayer2RoundsWon++;
  } else {
    singleWinnerName = "DRAW";
  }
  
  singleShowRoundResult = true;
  singleRoundResultTimer = 180;
}

function handleSingleCountdown() {
  if (!singleFightStarted) {
    singleCountdownTimer--;
    if (singleCountdownTimer <= 0) {
      singleCountdown--;
      singleCountdownTimer = 60;
      if (singleCountdown <= 0) {
        singleFightStarted = true;
        singleShowFightText = true;
        // Play voice cue when the FIGHT overlay appears.
        soundSystem.playSfx("fightVoice");
      }
    }
  } else if (singleShowFightText) {
    singleFightTextTimer--;
    if (singleFightTextTimer <= 0) {
      singleShowFightText = false;
    }
  }
}

function drawSingleCountdownOverlay() {
  push();
  textAlign(CENTER, CENTER);
  
  if (!singleFightStarted && singleCountdown > 0) {
    drawTitle(singleCountdown.toString(), width / 2, height / 2, width * 0.15);
  } else if (singleShowFightText) {
    drawTitle("FIGHT!", width / 2, height / 2, width * 0.2);
  }
  
  pop();
}

function checkSingleMatchWinCondition() {
  if (singlePlayer1.hp <= 0 && !singleRoundOver) {
    singleRoundOver = true;
    singleWinnerName = singlePlayer2.name;
    singlePlayer2RoundsWon++;
    singleShowRoundResult = true;
    singleRoundResultTimer = 180;
    
  } else if (singlePlayer2.hp <= 0 && !singleRoundOver) {
    singleRoundOver = true;
    singleWinnerName = singlePlayer1.name;
    singlePlayer1RoundsWon++;
    singleShowRoundResult = true;
    singleRoundResultTimer = 180;
  }
}

function drawSingleMatchUI() {
  push();
  
  let barW = width * 0.4;
  let barH = 30;
  let padding = 50;

  // Timer
  textAlign(CENTER, TOP);
  textFont(metalFont);
  textSize(55);
  noStroke();
  fill(singleMatchTimer <= 10 ? color(255, 0, 0) : 255);
  text(singleMatchTimer, width / 2, padding - 20);

  // Round Indicators
  let roundSize = 20;
  let roundSpacing = 5;
  let roundY = padding + 45;

  let maxDisplay = Math.max(2, Math.max(singlePlayer1RoundsWon, singlePlayer2RoundsWon));
  
  // P1 Round Wins 
  for (let i = 0; i < maxDisplay; i++) {
    let x = padding + barW - (i * (roundSize + roundSpacing));
    
    if (i < singlePlayer1RoundsWon) {
      fill(0, 150, 255);
    } else {
      fill(50);
    }
    noStroke();
    circle(x, roundY, roundSize);
  }

  // P2 Round Wins 
  for (let i = 0; i < maxDisplay; i++) {
    let x = (width - padding - barW) + (i * (roundSize + roundSpacing));
    
    if (i < singlePlayer2RoundsWon) {
      fill(255, 50, 50);
    } else {
      fill(50);
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
  text("ROUND " + singleCurrentRound, width / 2, padding + 50);

  // PLAYER 1 
  fill(255);
  noStroke();
  textFont(metalFont);
  textAlign(LEFT, BOTTOM);
  textSize(24);
  text(singlePlayer1.name.toUpperCase(), padding, padding - 5);
  
  drawHealthBar(padding, padding, barW, barH, singlePlayer1.hp, singlePlayer1.maxHp, false);
  
  textSize(18);
  text(floor(singlePlayer1.hp) + " / " + singlePlayer1.maxHp, padding, padding + barH + 25);

  // AI 
  textAlign(RIGHT, BOTTOM);
  textSize(24);
  text(singlePlayer2.name.toUpperCase(), width - padding, padding - 5);
  
  drawHealthBar(width - padding - barW, padding, barW, barH, singlePlayer2.hp, singlePlayer2.maxHp, true);
  
  textSize(18);
  text(floor(singlePlayer2.hp) + " / " + singlePlayer2.maxHp, width - padding, padding + barH + 25);

  // CONTROL INSTRUCTIONS 
  textFont(metalFont);
  noStroke();
  
  let controlTextSize = width * 0.011;
  let controlDetailSize = width * 0.009;
  let bottomY = height * 0.85;
  let lineSpacing = height * 0.035;
  let sidePadding = width * 0.05;
  
  fill(0, 150, 255);
  textAlign(LEFT, TOP);
  textSize(controlTextSize);
  text("P1 CONTROLS", sidePadding, bottomY);
  
  fill(255);
  textSize(controlDetailSize);
  text("  W            Y U", sidePadding, bottomY + lineSpacing);
  text("A S D          H J      SPACE", sidePadding, bottomY + lineSpacing * 2);
  text("MOVE       ATTACK    BLOCK", sidePadding, bottomY + lineSpacing * 3);
  
  pop();
}

// Draw round result screen
function drawSingleRoundResultScreen() {
  push();
  rectMode(CORNER);
  fill(0, 220);
  rect(0, 0, width, height);
  
  textAlign(CENTER, CENTER);
  
  // K.O. or Time's Up
  let header = (singleMatchTimer <= 0 && singleWinnerName === "DRAW") ? "TIME'S UP" : "K.O.";
  drawTitle(header, width / 2, height * 0.35, width * 0.1);
  
  // Round Winner
  let msg;
  if (singleWinnerName === "DRAW") {
    msg = "DRAW!";
  } else {
    msg = singleWinnerName.toUpperCase() + " WINS!";
  }
  drawTitle(msg, width / 2, height * 0.52, width * 0.05);
  
  // Round score
  fill(255);
  noStroke();
  textFont(metalFont);
  textSize(width * 0.022);
  text(singlePlayer1.name.toUpperCase() + " " + singlePlayer1RoundsWon + " - " + singlePlayer2RoundsWon + " " + singlePlayer2.name.toUpperCase(), 
       width / 2, height * 0.62);
  
  pop();
}

function drawSingleWorldBorders() {
  push();
  rectMode(CORNER);
  
  let leftBorder = -9800;
  let rightBorder = 9800;
  let wallWidth = 100;
  let wallHeight = height * 2;
  
  fill(80, 90, 100);
  noStroke();
  rect(leftBorder - wallWidth, singleGroundY - wallHeight, wallWidth, wallHeight);
  rect(rightBorder, singleGroundY - wallHeight, wallWidth, wallHeight);
  
  stroke(200, 220, 150);
  strokeWeight(5);
  line(leftBorder, singleGroundY, leftBorder, singleGroundY - 300);
  line(rightBorder, singleGroundY, rightBorder, singleGroundY - 300);
  
  pop();
}

function applySingleWorldBorders(fighter) {
  let leftBorder = -9800;
  let rightBorder = 9800;
  
  if (fighter.x < leftBorder) {
    fighter.x = leftBorder;
    fighter.velX = 0;
  }
  
  if (fighter.x + fighter.w > rightBorder) {
    fighter.x = rightBorder - fighter.w;
    fighter.velX = 0;
  }
}

function updateAIPhysicsOnly(ai, opponent, groundY) {
  // Initialize AI on first call
  if (!aiController) {
    initAI(ai);
  }
  
  // Update AI behavior
  updateAI(opponent, groundY);
   
  if (ai.hitStun > 0) {
    ai.hitStun--;
    ai.isHit = true;
    ai.attacking = null;
  } else {
    ai.isHit = false;
  }

  if (ai.recoveryTimer > 0) {
    ai.recoveryTimer--;
  }

  // Call handleAttack() to decrement attackTimer
  ai.handleAttack();

  // UPDATE ALL BUFF/DEBUFF TIMERS   
  const getOpponent = () => {
    return (ai === singlePlayer1) ? singlePlayer2 : singlePlayer1;
  };
  
  // Update cooldowns
  for (let comboName in ai.comboCooldowns) {
    if (ai.comboCooldowns[comboName] > 0) {
      ai.comboCooldowns[comboName]--;
    }
  }
  
  // Poison Hands duration and cooldown
  if (ai.isPoisonHandsActive && ai.poisonHandsTimer > 0) {
    ai.poisonHandsTimer--;
    
    if (ai.poisonHandsTimer <= 0) {
      ai.isPoisonHandsActive = false;
      
      if (ai.poisonHandsCooldownPending) {
        ai.comboCooldowns["Poison Hands"] = 120;
        ai.poisonHandsCooldownPending = false;
        console.log("AI Poison Hands ended. Cooldown started.");
      }
    }
  }

  // Azure Dragon Scales duration and cooldown
  if (ai.isAzureScalesActive && ai.azureScalesTimer > 0) {
    ai.azureScalesTimer--;
    
    if (ai.azureScalesTimer <= 0) {
      ai.isAzureScalesActive = false;
      
      if (ai.azureScalesCooldownPending) {
        ai.comboCooldowns["Azure Dragon Scales"] = 300;
        ai.azureScalesCooldownPending = false;
        console.log("AI Azure Dragon Scales ended. Cooldown started.");
      }
    }
  }

  // Undying Tortoise Body duration and cooldown
  if (ai.isTortoiseBodyActive && ai.tortoiseBodyTimer > 0) {
    ai.tortoiseBodyTimer--;
    
    if (ai.tortoiseBodyTimer <= 0) {
      ai.isTortoiseBodyActive = false;
      
      if (ai.tortoiseBodyCooldownPending) {
        ai.comboCooldowns["Undying Tortoise Body"] = 300;
        ai.tortoiseBodyCooldownPending = false;
        console.log("AI Undying Tortoise Body ended. Cooldown started.");
      }
    }
  }

  // Ocean Mending Water duration
  if (ai.isOceanMendingActive && ai.oceanMendingTimer > 0) {
    ai.oceanMendingTimer--;
    
    // Clear debuffs every frame while active
    ai.isPoisoned = false;
    ai.poisonDamage = 0;
    ai.poisonTimer = 0;
    ai.isInPoisonField = false;
    
    if (ai.oceanMendingTimer <= 0) {
      ai.isOceanMendingActive = false;
      console.log("AI Ocean Mending Water debuff immunity ended.");
    }
  }

  // Demonic Heaven's Awakening duration and cooldown
  if (ai.isDemonicAwakeningActive && ai.demonicAwakeningTimer > 0) {
    ai.demonicAwakeningTimer--;
    
    if (ai.demonicAwakeningTimer <= 0) {
      ai.isDemonicAwakeningActive = false;
      
      if (ai.demonicAwakeningCooldownPending) {
        ai.comboCooldowns["Demonic Heavens Awakening"] = 180;
        ai.demonicAwakeningCooldownPending = false;
        console.log("AI Demonic Heaven's Awakening ended. Cooldown started.");
      }
    }
  }

  // Demonic Heaven's Abyss duration and effects
  if (ai.isDemonicAbyssActive && ai.demonicAbyssTimer > 0) {
    ai.demonicAbyssTimer--;
    
    let abyssOpponent = getOpponent();
    
    // Check if opponent is in range
    let distanceToOpponent = abs(abyssOpponent.x - ai.x);
    let isInRange = false;
    
    if (ai.facing === 1 && abyssOpponent.x > ai.x && distanceToOpponent <= ai.demonicAbyssRange) {
      isInRange = true;
    } else if (ai.facing === -1 && abyssOpponent.x < ai.x && distanceToOpponent <= ai.demonicAbyssRange) {
      isInRange = true;
    }
    
    if (isInRange) {
      abyssOpponent.isInDemonicAbyss = true;
      let pullStrength = 2;
      let pullDirection = (abyssOpponent.x > ai.x) ? -pullStrength : pullStrength;
      abyssOpponent.x += pullDirection;
      
      ai.demonicAbyssDmgTickTimer--;
      if (ai.demonicAbyssDmgTickTimer <= 0) {
        ai.demonicAbyssDmgTickTimer = 60;
        
        let abyssDmg = 10;
        abyssOpponent.hp -= abyssDmg;
        if (abyssOpponent.hp < 0) abyssOpponent.hp = 0;
        
        if (typeof spawnDamageIndicatorSingle === 'function') {
          spawnDamageIndicatorSingle(
            abyssOpponent.x + abyssOpponent.w / 2,
            abyssOpponent.y - 20,
            abyssDmg,
            false
          );
        }
        console.log(`AI Demonic Abyss damage: -${abyssDmg} HP to opponent`);
      }
    } else {
      abyssOpponent.isInDemonicAbyss = false;
    }
    
    // Duration Ended
    if (ai.demonicAbyssTimer <= 0) {
      ai.isDemonicAbyssActive = false;
      ai.demonicClawOwnerLocked = false;
      abyssOpponent.isInDemonicAbyss = false;

      if (isInRange) {
        abyssOpponent.hitStun = 60;
        abyssOpponent.isHit = true;
        
        if (ai.isDemonicAwakeningActive) {
          abyssOpponent.hitStun = 180;
          console.log("AI Demonic Abyss explosion! Enemy stunned for 3 seconds!");
        } else {
          console.log("AI Demonic Abyss ended! Enemy stunned for 1 second!");
        }
      }
      
      if (ai.demonicAbyssCooldownPending) {
        ai.comboCooldowns["Demonic Heavens Abyss"] = 300;
        ai.demonicAbyssCooldownPending = false;
        console.log("AI Demonic Heaven's Abyss cooldown started.");
      }
    }
  }

  // Clear Abyss debuff if caster's field is no longer active
  if (ai.isInDemonicAbyss) {
    let abyssCaster = getOpponent();
    if (!abyssCaster.isDemonicAbyssActive) {
      ai.isInDemonicAbyss = false;
    }
  }

  // Demonic Heaven Annihilation mark countdown
  if (ai.isAnnihilationMarked && ai.annihilationTimer > 0) {
    ai.annihilationTimer--;
    
    if (ai.annihilationTimer <= 0) {
      ai.annihilationExploding = true;
      ai.annihilationExplosionTimer = 30;
      
      let explosionDamage = ai.annihilationCumulativeDamage;
      ai.hp -= explosionDamage;
      if (ai.hp < 0) ai.hp = 0;
      
      if (typeof spawnDamageIndicatorSingle === 'function') {
        spawnDamageIndicatorSingle(
          ai.x + ai.w / 2,
          ai.y - 50,
          Math.floor(explosionDamage),
          false
        );
      }
      
      console.log(`AI ANNIHILATION EXPLOSION! ${Math.floor(explosionDamage)} damage dealt!`);
      
      ai.annihilationCumulativeDamage = 0;
      ai.annihilationCaster = null;
    }
  }

  // Explosion visual timer
  if (ai.annihilationExploding && ai.annihilationExplosionTimer > 0) {
    ai.annihilationExplosionTimer--;
    
    if (ai.annihilationExplosionTimer <= 0) {
      ai.annihilationExploding = false;
      ai.isAnnihilationMarked = false;
      console.log("AI Annihilation mark cleared!");
    }
  }

  // Poison DOT tick
  if (ai.isPoisoned && ai.poisonTimer > 0) {
    ai.poisonTimer--;
    ai.poisonTickTimer--;
    
    if (ai.poisonTickTimer <= 0) {
      ai.poisonTickTimer = ai.poisonTickInterval;
      
      ai.hp -= ai.poisonDamage;
      if (ai.hp < 0) ai.hp = 0;
      
      if (typeof spawnDamageIndicatorSingle === 'function') {
        spawnDamageIndicatorSingle(
          ai.x + ai.w / 2,
          ai.y - 20,
          ai.poisonDamage,
          false
        );
      }
      
      console.log(`AI Poison tick! ${ai.poisonDamage} damage. ${Math.ceil(ai.poisonTimer / 60)}s remaining`);
    }
    
    if (ai.poisonTimer <= 0) {
      ai.isPoisoned = false;
      ai.poisonDamage = 0;
      ai.poisonAttacker = null;
      console.log("AI Poison expired!");
    }
  }

  // Poison Flower Field - caster update
  if (ai.isPoisonFieldActive && ai.poisonFieldTimer > 0) {
    ai.poisonFieldTimer--;
    
    let fieldOpponent = getOpponent();
    fieldOpponent.isInPoisonField = true;
    
    // Heal tick
    ai.poisonFieldHealTickTimer--;
    if (ai.poisonFieldHealTickTimer <= 0) {
      ai.poisonFieldHealTickTimer = 60;
      
      let healAmount = 10;
      ai.hp = min(ai.hp + healAmount, ai.maxHp);
      
      if (typeof spawnDamageIndicatorSingle === 'function') {
        spawnDamageIndicatorSingle(
          ai.x + ai.w / 2,
          ai.y - 20,
          healAmount,
          false
        );
      }
      console.log(`AI Poison Field heal: +${healAmount} HP`);
    }
    
    // Damage tick
    ai.poisonFieldDmgTickTimer--;
    if (ai.poisonFieldDmgTickTimer <= 0) {
      ai.poisonFieldDmgTickTimer = 60;
      
      if (fieldOpponent.isOceanMendingActive) {
        console.log("Poison Field damage blocked by Ocean Mending Water!");
      } else {
        let fieldDmg = 10;
        fieldOpponent.hp -= fieldDmg;
        if (fieldOpponent.hp < 0) fieldOpponent.hp = 0;
        
        if (typeof spawnDamageIndicatorSingle === 'function') {
          spawnDamageIndicatorSingle(
            fieldOpponent.x + fieldOpponent.w / 2,
            fieldOpponent.y - 20,
            fieldDmg,
            false
          );
        }
        console.log(`AI Poison Field damage: -${fieldDmg} HP to opponent`);
      }
    }
    
    if (ai.poisonFieldTimer <= 0) {
      ai.isPoisonFieldActive = false;
      fieldOpponent.isInPoisonField = false;
      ai.canPoisonFieldTeleport = false;
      
      if (ai.poisonFieldCooldownPending) {
        ai.comboCooldowns["Poison Flower Field"] = 300;
        ai.poisonFieldCooldownPending = false;
        console.log("AI Poison Flower Field ended. Cooldown started.");
      }
    }
  }

  // Clear field debuff if caster's field is no longer active
  if (ai.isInPoisonField) {
    let fieldCaster = getOpponent();
    if (!fieldCaster.isPoisonFieldActive) {
      ai.isInPoisonField = false;
    }
  }

  // Ten Thousand Poison Flower Rain - spawn raindrops
  if (ai.isPoisonRainActive && ai.poisonRainTimer > 0) {
    ai.poisonRainTimer--;
    ai.poisonRainSpawnTimer--;
    
    if (ai.poisonRainSpawnTimer <= 0) {
      ai.poisonRainSpawnTimer = 30;
      
      let rainTarget = getOpponent();
      let spawnX = rainTarget.x + rainTarget.w / 2;
      let spawnY = rainTarget.y - 300;
      
      spawnProjectile(spawnX, spawnY, 1, ai, "poison_rain");
      
      console.log(`AI Poison Rain drop spawned above enemy! ${Math.ceil(ai.poisonRainTimer / 60)}s remaining`);
    }
    
    if (ai.poisonRainTimer <= 0) {
      ai.isPoisonRainActive = false;
      console.log("AI Ten Thousand Poison Flower Rain ended!");
    }
  }

  // PHYSICS & MOVEMENT
  ai.facing = (ai.x < opponent.x) ? 1 : -1;
  
  // Apply dash momentum manually
  if (ai.isDashing && ai.dashTimer > 0) {
    ai.dashTimer--;
    
    let dashProgress = ai.dashTimer / (ai.dashDirection === ai.facing ? 18 : 16);
    if (dashProgress > 0.25) {
      let accel = (ai.dashDirection === ai.facing) ? 6.0 : 5.5;
      ai.velX += ai.dashDirection * accel;
      
      let maxSpeed = (ai.dashDirection === ai.facing) ? ai.dashMaxSpeed : ai.dashMaxSpeed * 0.85;
      if (Math.abs(ai.velX) > maxSpeed) {
        ai.velX = ai.dashDirection * maxSpeed;
      }
    }
    
    ai.velX *= 0.70;
    
    if (ai.dashTimer <= 0) {
      ai.isDashing = false;
      ai.dashDirection = 0;
    }
  } else if (!ai.isDashing) {
    ai.velX *= 0.82;
  }
  
  // Apply velocity to position
  ai.x += ai.velX;
  
  // Apply physics (gravity, special moves, etc.)
  ai.applyPhysics(groundY);
}

function updateSingleMatchDamageIndicators() {
  for (let i = singleDamageIndicators.length - 1; i >= 0; i--) {
    let ind = singleDamageIndicators[i];
    ind.y += ind.velY;
    ind.life -= 4;
    if (ind.life <= 0) singleDamageIndicators.splice(i, 1);
  }
}

function drawSingleMatchDamageIndicators() {
  push();
  textAlign(CENTER);
  textFont(metalFont);
  for (let ind of singleDamageIndicators) {
    fill(255, 0, 0, ind.life);
    stroke(0, ind.life);
    strokeWeight(2);
    textSize(24);
    text(ind.label + "-" + ind.amount, ind.x, ind.y);
  }
  pop();
}

function drawHealthBar(x, y, w, h, current, max, mirrored) {
  push();
  rectMode(CORNER);
  
  fill(100, 0, 0);
  rect(x, y, w, h);
  
  let healthW = map(constrain(current, 0, max), 0, max, 0, w);
  fill(0, 255, 100);
  
  if (mirrored) {
    rect(x + w - healthW, y, healthW, h);
  } else {
    rect(x, y, healthW, h);
  }
  
  noFill();
  stroke(255, 150);
  strokeWeight(2);
  rect(x, y, w, h);
  
  pop();
}

function drawPoisonFieldEffectSingle(p1, p2) {
  let fieldCaster = null;
  if (p1.isPoisonFieldActive) fieldCaster = p1;
  else if (p2.isPoisonFieldActive) fieldCaster = p2;
  
  if (fieldCaster) {
    push();
    
    let pulseAlpha = 150 + sin(frameCount * 0.1) * 100;
    let pulseThick = 4 + sin(frameCount * 0.15) * 2;
    
    drawingContext.shadowBlur = 30;
    drawingContext.shadowColor = 'rgba(0, 255, 0, 0.9)';
    
    stroke(0, 255, 80, pulseAlpha);
    strokeWeight(pulseThick);
    line(-10000, singleGroundY, 10000, singleGroundY);
    
    stroke(100, 255, 150, pulseAlpha * 0.5);
    strokeWeight(pulseThick * 2);
    line(-10000, singleGroundY, 10000, singleGroundY);
    
    for (let i = 0; i < 20; i++) {
      let flowerX = random(-10000, 10000);
      let flowerY = singleGroundY - random(5, 40);
      
      fill(0, 255, 100, random(100, 200));
      noStroke();
      ellipse(flowerX, flowerY, random(4, 12), random(4, 12));
    }
    
    let timeLeft = Math.ceil(fieldCaster.poisonFieldTimer / 60);
    fill(0, 255, 80, 200);
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(20);
    text(`☠ POISON FIELD: ${timeLeft}s ☠`, 0, singleGroundY - 10);
    
    pop();
  }
}

// Update poison DOT for both players
function updateSinglePoisonEffects() {
  // Update P1 poison
  if (singlePlayer1.isPoisoned && singlePlayer1.poisonTimer > 0) {
    singlePlayer1.poisonTimer--;
    singlePlayer1.poisonTickTimer--;
    
    if (singlePlayer1.poisonTickTimer <= 0) {
      singlePlayer1.poisonTickTimer = singlePlayer1.poisonTickInterval;
      singlePlayer1.hp -= singlePlayer1.poisonDamage;
      if (singlePlayer1.hp < 0) singlePlayer1.hp = 0;
      
      // Spawn damage indicator
      if (typeof spawnDamageIndicatorSingle === 'function') {
        spawnDamageIndicatorSingle(singlePlayer1.x + singlePlayer1.w / 2, singlePlayer1.y - 20, singlePlayer1.poisonDamage, false);
      }
    }
    
    if (singlePlayer1.poisonTimer <= 0) {
      singlePlayer1.isPoisoned = false;
      singlePlayer1.poisonDamage = 0;
      console.log("P1 poison expired!");
    }
  }
  
  // Update AI poison
  if (singlePlayer2.isPoisoned && singlePlayer2.poisonTimer > 0) {
    singlePlayer2.poisonTimer--;
    singlePlayer2.poisonTickTimer--;
    
    if (singlePlayer2.poisonTickTimer <= 0) {
      singlePlayer2.poisonTickTimer = singlePlayer2.poisonTickInterval;
      singlePlayer2.hp -= singlePlayer2.poisonDamage;
      if (singlePlayer2.hp < 0) singlePlayer2.hp = 0;
      
      // Spawn damage indicator
      if (typeof spawnDamageIndicatorSingle === 'function') {
        spawnDamageIndicatorSingle(singlePlayer2.x + singlePlayer2.w / 2, singlePlayer2.y - 20, singlePlayer2.poisonDamage, false);
      }
    }
    
    if (singlePlayer2.poisonTimer <= 0) {
      singlePlayer2.isPoisoned = false;
      singlePlayer2.poisonDamage = 0;
      console.log("P2 poison expired!");
    }
  }
}