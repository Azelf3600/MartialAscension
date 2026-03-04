const GAME_STATE = {
  MENU: "menu",
  CHARACTER_SELECT: "character_select",
  CHARACTER_SELECT_MULTI: "character_select_multi",
  CHARACTER_SELECT_TRAINING: "character_select_training",
  STAGE_SELECT_MULTI: "stage_select_multi",
  MATCH: "match",
  MATCH_MULTI: "match_multi",
  TRAINING: "training",
  PAUSE_MENU: "pause_menu",
  PAUSE_MENU_MULTI: "pause_menu_multi",
  PAUSE_MENU_TRAINING: "pause_menu_training",
  LOADING_MATCH: "loading_match",
  LOADING_MATCH_MULTI: "loading_match_multi",
  LOADING_MATCH_TRAINING: "loading_match_training",
  WIN_SCREEN_MULTI: "win_screen_multi",
  WIN_SCREEN: "win_screen",
  LORE_SCREEN: "lore_screen"
};

let currentState = GAME_STATE.MENU;
let previousState = GAME_STATE.MENU;
let p1Buffer;
let p2Buffer;
let gameCamera; 
let campaignProgress = 0; 
let campaignOpponents = []; 
let campaignStages = []; 
let campaignPlayerChar = 0; 
let singleDamageIndicators = [];

function preload() {
  preloadMainMenu();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER); 
  imageMode(CENTER);
  
  gameCamera = new CameraSystem(); 
  gameCamera.pos = createVector(width/2, height/2);
  
  p1Buffer = new InputBuffer();
  p2Buffer = new InputBuffer();
  
  setupMenuLayout();
}

function draw() {
  resetMatrix();  
  background(0);   
  push();     

  if (currentState !== previousState) {
    if (currentState === GAME_STATE.LORE_SCREEN) {
      initLoreScreen(); 
    }
    previousState = currentState;
  }

  switch (currentState) {
    case GAME_STATE.MENU:
      drawMenu();
      break;

    case GAME_STATE.CHARACTER_SELECT:
      drawCharacterSelect();
      break;

    case GAME_STATE.CHARACTER_SELECT_MULTI:
      drawCharacterSelectMulti();
      break;

    case GAME_STATE.STAGE_SELECT_MULTI:
      drawStageSelectMulti();
      break;

    case GAME_STATE.LOADING_MATCH:
      drawLoadingMatch();
      break;

    case GAME_STATE.LOADING_MATCH_MULTI:
      drawLoadingMatchMulti();
      break;

    case GAME_STATE.MATCH:
      if (!singlePlayer1 || !singlePlayer2) {
        console.log("⚠️ Force calling initMatchSingle() from sketch.js");
        if (typeof initMatchSingle === 'function') {
          initMatchSingle();
        }
      }
  
      p1Buffer.update();
      drawMatch();
      break;

    case GAME_STATE.MATCH_MULTI:
      p1Buffer.update();
      p2Buffer.update();
      drawMatchMulti();
      break;

    case GAME_STATE.PAUSE_MENU:
      drawPauseMenu();
      break;

    case GAME_STATE.PAUSE_MENU_MULTI:
      drawPauseMenuMulti();
      break;

    case GAME_STATE.WIN_SCREEN:
      drawWinScreen();
      break;

    case GAME_STATE.WIN_SCREEN_MULTI:
      drawWinScreenMulti();
      break;

    case GAME_STATE.TRAINING:
      drawTraining()
      break;

    case GAME_STATE.PAUSE_MENU_TRAINING:
      drawPauseMenuTraining()
      break;
    
    case GAME_STATE.CHARACTER_SELECT_TRAINING:
      drawCharacterSelectTraining()
      break;

    case GAME_STATE.LOADING_MATCH_TRAINING:
      drawLoadingMatchTraining()
      break;

    case GAME_STATE.LORE_SCREEN:
      drawLoreScreen(); 
      break;
    }

  pop(); 

  // DEBUG STATE and FPS OVERLAY
  push();
  fill(255); 
  noStroke();
  textAlign(LEFT, TOP);
  textFont('sans-serif');
  textSize(14);
  text("STATE: " + currentState, 10, 10);
  text("FPS:   " + floor(frameRate()), 10, 28);
  pop();
}

function mousePressed() {
  if (currentState === GAME_STATE.MENU) {
    handleMenuClick();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  // Recalculate menu positions based on the new width/height
  if (typeof setupMenuLayout === "function") {
    setupMenuLayout();
  }
  
  // Update camera center to match new screen size
  if (gameCamera) {
    gameCamera.pos.x = width / 2;
    gameCamera.pos.y = height / 2;
  }
}

function keyPressed() {
  // Pause Menu Toggle (ESC during single player match)
  if (currentState === GAME_STATE.MATCH && keyCode === ESCAPE) {
    currentState = GAME_STATE.PAUSE_MENU;
    return;
  }
  
  // ✅ FIXED: Pause Menu Input Handling (Single Player - Campaign Mode)
  if (currentState === GAME_STATE.PAUSE_MENU) {
    handlePauseMenuInputSingle(key, keyCode); // Use the correct function!
    return;
  }

  // Win Screen Input (Single Player)
  if (currentState === GAME_STATE.WIN_SCREEN) {
    handleWinScreenSingleInput(key, keyCode);
    return;
  }

  if (currentState === GAME_STATE.LORE_SCREEN) {
    handleLoreScreenInput(key, keyCode);
  }

  // Pause Menu Toggle (ESC during match)
  if (currentState === GAME_STATE.MATCH_MULTI && keyCode === ESCAPE) {
    currentState = GAME_STATE.PAUSE_MENU_MULTI;
    return;
  }
  
  // Pause Menu Input Handling (Multiplayer)
  if (currentState === GAME_STATE.PAUSE_MENU_MULTI) {
    handlePauseMenuInput(key, keyCode);
    return;
  }

    // Pause Menu Input Handling (Training)
  if (currentState === GAME_STATE.PAUSE_MENU_TRAINING) {
    handlePauseMenuTrainingInput(key, keyCode);
    return;
  }

// SINGLE PLAYER CHARACTER SELECTION CONTROLS
if (currentState === GAME_STATE.CHARACTER_SELECT) {
  // Navigate with A/D
  if (key === 'd' || key === 'D') {
    selectedChar = (selectedChar + 1) % FIGHTERS.length;
  }
  if (key === 'a' || key === 'A') {
    selectedChar = (selectedChar - 1 + FIGHTERS.length) % FIGHTERS.length;
  }
  
  // Confirm with Space - setup campaign and go to lore screen
  if (key === ' ') {
    setTimeout(() => {
      setupCampaign(selectedChar);
      currentState = GAME_STATE.LORE_SCREEN;
    }, 500);
  }
  
  // Back to menu with ESC
  if (keyCode === ESCAPE) {
    currentState = GAME_STATE.MENU;
  }
}

// TRAINING CHARACTER SELECTION CONTROLS
if (currentState === GAME_STATE.CHARACTER_SELECT_TRAINING) {
  // Navigate with A/D
  if (key === 'd' || key === 'D') {
    selectedTrainingChar = (selectedTrainingChar + 1) % FIGHTERS.length;
  }
  if (key === 'a' || key === 'A') {
    selectedTrainingChar = (selectedTrainingChar - 1 + FIGHTERS.length) % FIGHTERS.length;
  }
  
  // Confirm with Space
  if (key === ' ') {
    setTimeout(() => {
      console.log("Selected training character:", FIGHTERS[selectedTrainingChar].name);
      currentState = GAME_STATE.LOADING_MATCH_TRAINING;
    }, 500);
  }
  
  // Back to menu with ESC 
  if (keyCode === ESCAPE) {
    currentState = GAME_STATE.MENU;
  }
}

// TRAINING MODE CONTROLS
if (currentState === GAME_STATE.TRAINING) {
  handleTrainingInput(key, keyCode);
}

  // MULTIPLAYER CHARACTER SELECTION CONTROLS
  if (currentState === GAME_STATE.CHARACTER_SELECT_MULTI) {
    // PLAYER 1 Selection
    if (!p1Ready) {
      if (key === 'd' || key === 'D') p1Selected = (p1Selected + 1) % FIGHTERS.length;
      if (key === 'a' || key === 'A') p1Selected = (p1Selected - 1 + FIGHTERS.length) % FIGHTERS.length;
      if (key === 'f' || key === 'F') p1Ready = true;
    }

    // PLAYER 2 Selection
    if (!p2Ready) {
      if (keyCode === RIGHT_ARROW) p2Selected = (p2Selected + 1) % FIGHTERS.length;
      if (keyCode === LEFT_ARROW) p2Selected = (p2Selected - 1 + FIGHTERS.length) % FIGHTERS.length;
      if (keyCode === ENTER) p2Ready = true;
    }

    // Start Stage Selection
    if (p1Ready && p2Ready && key === ' ') {
      setTimeout(() => {
        currentState = GAME_STATE.STAGE_SELECT_MULTI;
      }, 500);
    }

    // Reset Selection
    if (key === 'q' || key === 'Q') {
      p1Ready = false;
      p2Ready = false;
    }

      // Back to menu with ESC
    if (keyCode === ESCAPE) {
      currentState = GAME_STATE.MENU;
    }
  }

  // STAGE SELECTION CONTROLS (MULTIPLAYER)
  if (currentState === GAME_STATE.STAGE_SELECT_MULTI) {
    // Navigate with A/D or Arrow Keys
    if (key === 'd' || key === 'D' || keyCode === RIGHT_ARROW) {
      selectedStage = (selectedStage + 1) % STAGES.length;
    }
    if (key === 'a' || key === 'A' || keyCode === LEFT_ARROW) {
      selectedStage = (selectedStage - 1 + STAGES.length) % STAGES.length;
    }
    
    // Confirm with Space 
    if (key === ' ') {
      setTimeout(() => {
        currentRound = 1;
        currentState = GAME_STATE.LOADING_MATCH_MULTI;
      }, 500);
    }
    
    // Back to character select with Escape
    if (keyCode === ESCAPE) {
      currentState = GAME_STATE.CHARACTER_SELECT_MULTI;
    }
  }

  // WIN SCREEN CONTROLS
  if (currentState === GAME_STATE.WIN_SCREEN_MULTI) {
    handleWinScreenInput(key, keyCode);
  }

  // MATCH INPUT RECORDING (COMBO SYSTEM)
  if (currentState === GAME_STATE.MATCH) {
    // Single player uses singlePlayer1
    if (typeof singlePlayer1 !== 'undefined') handleRecording(singlePlayer1, p1Buffer, keyCode);
  } else if (currentState === GAME_STATE.MATCH_MULTI) {
    // Multiplayer uses player1 and player2
    if (typeof player1 !== 'undefined') handleRecording(player1, p1Buffer, keyCode);
    if (typeof player2 !== 'undefined') handleRecording(player2, p2Buffer, keyCode);
  }
}

function handleRecording(char, buffer, code) {
  //  Check correct fightStarted flag based on game mode
  if (currentState === GAME_STATE.TRAINING) {
    // Training mode - no restrictions
  } else if (currentState === GAME_STATE.MATCH) {
    // Single player - check singleFightStarted
    if (!singleFightStarted || singleMatchOver) {
      return;
    }
  } else if (currentState === GAME_STATE.MATCH_MULTI) {
    // Multiplayer - check fightStarted, roundOver, showRoundResult
    if (!fightStarted || roundOver || showRoundResult) {
      return;
    }
  }

  // Block all input if locked
  if (char.demonicClawOwnerLocked) {
    return;
  }

  if (char.isInDemonicAbyss) {
    return;
  }
  
  let move = InputBuffer.getDirectionalInput(code, char);

  if (!move) {
    if (code === char.controls.lightPunch) move = "LP";
    else if (code === char.controls.heavyPunch) move = "HP";
    else if (code === char.controls.lightKick) move = "LK";
    else if (code === char.controls.heavyKick) move = "HK";
  }

  if (move) {
    // Record input in training history
    if (currentState === GAME_STATE.TRAINING) {
      recordTrainingInput(move);
    }

    buffer.recordInput(move);
    
    // Pass character into checkCombo
    let result = checkCombo(buffer, STANDARD_COMBOS, char);

    if (result) {
      console.log(`Combo detected: ${result.name} for ${char.name}`);

      // Check cooldown BEFORE clearing buffer
      if (result.cooldown) {
        let cooldownKey = result.name;
        if (char.comboCooldowns[cooldownKey] && char.comboCooldowns[cooldownKey] > 0) {
          console.log(`${result.name} is on cooldown! Wait ${Math.ceil(char.comboCooldowns[cooldownKey] / 60)} seconds`);
          return;
        }
      }

      // Standing requirement check
      if (result.requireStanding) {
        if (char.h !== char.standH) {
          console.log(`${result.name} requires standing position!`);
          return;
        }
      }
      
      // Flying requirement check
      if (result.requireFlying) {
        if (!char.isFlying) {
          console.log(`${result.name} requires Sword Qi Fly state!`);
          return;
        }
      }
      
      // Low health requirement check 
      if (result.requireLowHealth) {
        if (currentState !== GAME_STATE.TRAINING) {
          let healthPercent = char.hp / char.maxHp;
          if (healthPercent > 0.5) {
            console.log(`${result.name} requires 50% HP or below! Current: ${Math.floor(healthPercent * 100)}%`);
            return;
          }
        } else {
          console.log("Training Mode: HP requirement bypassed!");
        }
      }
      
      // Judgment available check 
      if (result.requireJudgmentAvailable) {
        if (currentState !== GAME_STATE.TRAINING) {
          if (char.hasUsedJudgment) {
            console.log(`${result.name} can only be used once per round!`);
            return;
          }
        } else {
          console.log("Training Mode: Once-per-round restriction bypassed!");
        }
      }

      // Poison Hands requirement check
      if (result.requirePoisonHands) {
        if (!char.isPoisonHandsActive) {
          console.log(`${result.name} requires Poison Hands to be active!`);
          return;
        }
      }

      // Poison Field requirement check
      if (result.requirePoisonField) {
        if (!char.isPoisonFieldActive) {
          console.log(`${result.name} requires Poison Flower Field to be active!`);
          return;
        }
      }

      // Poison Rain available check 
      if (result.requireRainAvailable) {
        if (currentState !== GAME_STATE.TRAINING) {
          if (char.hasUsedPoisonRain) {
            console.log(`${result.name} can only be used once per round!`);
            return;
          }
        } else {
          console.log("Training Mode: Once-per-round restriction bypassed!");
        }
      }

      if (result.type === "MOVEMENT" && char.isInPoisonField) {
        console.log(`${result.name} blocked by Poison Flower Field!`);
        return;
      }

      // Azure Scales or Tortoise requirement check
      if (result.requireAzureScalesOrTortoise) {
        if (!char.isAzureScalesActive && !char.isTortoiseBodyActive) {
          console.log(`${result.name} requires Azure Dragon Scales or Undying Tortoise Body to be active!`);
          return;
        }
      }

      // Azure Dragon available check 
      if (result.requireAzureDragonAvailable) {
        if (currentState !== GAME_STATE.TRAINING) {
          if (char.hasUsedAzureDragon) {
            console.log(`${result.name} can only be used once per round!`);
            return;
          }
        } else {
          console.log("Training Mode: Once-per-round restriction bypassed!");
        }
      }

      // Annihilation available check 
      if (result.requireAnnihilationAvailable) {
        if (currentState !== GAME_STATE.TRAINING) {
          if (char.hasUsedAnnihilation) {
            console.log(`${result.name} can only be used once per round!`);
            return;
          }
        } else {
          console.log("Training Mode: Once-per-round restriction bypassed!");
        }
      }

      // HP cost check 
      if (result.hpCost) {
        if (char.hp <= result.hpCost) {
          console.log(`${result.name} requires ${result.hpCost} HP! Current: ${Math.floor(char.hp)} HP`);
          return;
        }
      }
      
      // Handle movement combos 
      if (result.type === "MOVEMENT") {
        char.executeCombo(result);
        return;
      }
      
      char.attackTimer = 0; 
      char.executeCombo(result);
      
      if (result.hits && result.hits.length > 1) {
        char.currentComboHit = result.hits.length - 1;
        char.comboHitTimer = result.hits[char.currentComboHit].duration;
        char.attackTimer = result.hits[char.currentComboHit].duration;
        char.hasHit = false;
        char.lastHitIndex = -1;
      }
      
      if (char.isDashing) {
        char.isDashing = false;
        char.dashTimer = 0;
      }
      
      return;
    }

    if (char.attackTimer > 6) return;

    if (move === "LP" || move === "HP" || move === "LK" || move === "HK") {
      char.startAttack(move);
      
      if (char.isDashing) {
        char.isDashing = false;
        char.dashTimer = 0;
      }
    }
  }
}

function mouseReleased() {
  // Back Button Click Logic for all selection screens
  if (currentState === GAME_STATE.CHARACTER_SELECT || 
      currentState === GAME_STATE.CHARACTER_SELECT_MULTI||
      currentState === GAME_STATE.CHARACTER_SELECT_TRAINING ||
      currentState === GAME_STATE.STAGE_SELECT_MULTI) {
    
    let btnW = width * 0.1;
    let btnH = height * 0.05;
    let backBtn = { 
      x: width * 0.1,
      y: height * 0.05, 
      w: btnW, 
      h: btnH 
    };
    
    // Check if clicked on back button
    let isClicked = mouseX > backBtn.x - btnW/2 && mouseX < backBtn.x + btnW/2 && mouseY > backBtn.y - btnH/2 && mouseY < backBtn.y + btnH/2;
    
    if (isClicked) {
      // Handle navigation based on current state
      if (currentState === GAME_STATE.STAGE_SELECT) {
        currentState = GAME_STATE.CHARACTER_SELECT;
      } else if (currentState === GAME_STATE.STAGE_SELECT_MULTI) {
        currentState = GAME_STATE.CHARACTER_SELECT_MULTI;
      } else {
        // From any character select screen, go back to menu
        currentState = GAME_STATE.MENU;
      }
      return;
    }
  }
}

function handleStageSelection(nextState) {
  let thumbW = width * 0.2;
  let thumbH = height * 0.15;
  let spacing = 20;
  let totalW = (STAGES.length * thumbW) + ((STAGES.length - 1) * spacing);
  let startX = (width - totalW) / 2;
  let startY = height * 0.7;

  STAGES.forEach((s, i) => {
    let x = startX + i * (thumbW + spacing);
    let y = startY;

    if (mouseX > x && mouseX < x + thumbW && mouseY > y && mouseY < y + thumbH) {
      selectedStage = i;
      currentState = nextState;
    }
  });
}

//  Setup campaign based on selected character
function setupCampaign(playerCharIndex) {
  campaignPlayerChar = playerCharIndex;
  campaignProgress = 0; 
  
  if (playerCharIndex === 0) { // Ethan Li
    campaignOpponents = [1, 2, 3]; // Lucas Tang, Aaron Shu, Damon Cheon
    campaignStages = [1, 2, 3]; // Sword God Arena, Black Forest, Ancient Immortal Battlefield
  } 
  else if (playerCharIndex === 1) { // Lucas Tang
    campaignOpponents = [2, 0, 3]; // Aaron Shu, Ethan Li, Damon Cheon
    campaignStages = [2, 1, 3]; // Black Forest, Sword God Arena, Ancient Immortal Battlefield 
  } 
  else if (playerCharIndex === 2) { // Aaron Shu
    campaignOpponents = [1, 0, 3]; // Lucas Tang, Ethan Li, Damon Cheon
    campaignStages = [2, 2, 3]; // Black Forest, Black Forest, Ancinet Immortal Battlefield
  } 
  else if (playerCharIndex === 3) { // Damon Cheon
    campaignOpponents = [2, 1, 0]; // Aaron Shu, Lucas Tang, Ethan Li
    campaignStages = [3, 3, 3]; // Ancinet Immortal Battlefield, Ancinet Immortal Battlefield, Ancinet Immortal Battlefield
  }
  
  console.log(`Campaign started: ${FIGHTERS[playerCharIndex].name}`);
  console.log(`Opponents:`, campaignOpponents.map(i => FIGHTERS[i].name));
  console.log(`Stages:`, campaignStages);
}