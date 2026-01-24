const GAME_STATE = {
  MENU: "menu",
  CHARACTER_SELECT: "character_select",
  CHARACTER_SELECT_MULTI: "character_select_multi",
  STAGE_SELECT:"stage_select",
  STAGE_SELECT_MULTI:"stage_select_multi",
  MATCH: "match",
  MATCH_MULTI: "match_multi"
};

let currentState = GAME_STATE.MENU;

function preload() {
  preloadMainMenu();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  setupMenuLayout(); 
}

function draw() {
  background(0);

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

    case GAME_STATE.STAGE_SELECT:
      drawStageSelect();
      break;
    
    case GAME_STATE.STAGE_SELECT_MULTI:
    drawStageSelectMulti();
    break;

    case GAME_STATE.MATCH:
    drawMatch();
    break;

    case GAME_STATE.MATCH_MULTI:
    drawMatchMulti();
    break;

  }
}

function mousePressed() {
  if (currentState === GAME_STATE.MENU) {
    handleMenuClick();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setupMenuLayout(); // Re-calculate button positions for the new size
}

//Keyboard function for multiplayer character selection
function keyPressed() {
  if (currentState === GAME_STATE.CHARACTER_SELECT_MULTI) {
    
    // PLAYER 1 Controls
    if (!p1Ready) {
      if (key === 'd' || key === 'D') p1Selected = (p1Selected + 1) % FIGHTERS.length;
      if (key === 'a' || key === 'A') p1Selected = (p1Selected - 1 + FIGHTERS.length) % FIGHTERS.length;
      if (key === 'f' || key === 'F') p1Ready = true;
    }

    // PLAYER 2 Controls
    if (!p2Ready) {
      if (keyCode === RIGHT_ARROW) p2Selected = (p2Selected + 1) % FIGHTERS.length;
      if (keyCode === LEFT_ARROW) p2Selected = (p2Selected - 1 + FIGHTERS.length) % FIGHTERS.length;
      if (keyCode === ENTER) p2Ready = true;
    }

    // Move to Stage Select Multi
    if (p1Ready && p2Ready && key === ' ') {
      setTimeout(() => {
        currentState = GAME_STATE.STAGE_SELECT_MULTI; 
      }, 500);
    }
    
    // RESET Logic
    if (key === 'q' || key === 'Q') {
      p1Ready = false;
      p2Ready = false;
    }
  }
}

//Stage Selection for Single Player
function mouseReleased() {
  // 1. Back Button Check
  if (currentState === GAME_STATE.CHARACTER_SELECT || currentState === GAME_STATE.STAGE_SELECT) {
    let backBtn = { x: width * 0.1, y: height * 0.9, w: width * 0.1, h: height * 0.05 };
    if (isHovering(backBtn)) {
      if (currentState === GAME_STATE.STAGE_SELECT) currentState = GAME_STATE.CHARACTER_SELECT;
      else currentState = GAME_STATE.MENU;
      return; 
    }
  }

  // 2. Fighter Selection Check
  if (currentState === GAME_STATE.CHARACTER_SELECT) {
    let cols = 4;
    let spacing = width * 0.02;
    let boxW = width * 0.15;
    let boxH = height * 0.4;
    let totalGridW = (cols * boxW) + ((cols - 1) * spacing);
    let startX = (width - totalGridW) / 2;
    let centerY = height / 2;

    FIGHTERS.forEach((fighter, index) => {
      let x = startX + (index * (boxW + spacing));
      let y = centerY - boxH / 2;

      if (mouseX > x && mouseX < x + boxW && mouseY > y && mouseY < y + boxH) {
        selectedChar = index; // Store P1 choice
        currentState = GAME_STATE.STAGE_SELECT; // GO TO STAGE SELECT
      }
    });
  }

  // Stage Select Single Player Mode 
  if (currentState === GAME_STATE.STAGE_SELECT) {
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
            selectedStage = i; // Lock in the choice
            console.log("Stage Selected:", s.name);
            
            // Move to Match
            currentState = GAME_STATE.MATCH;
        }
    });
  }

  // Stage Select Multiplayer Mode
  if (currentState === GAME_STATE.STAGE_SELECT_MULTI) {
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
            selectedStage = i; // Lock in the choice
            console.log("Stage Selected:", s.name);
            
            // Move to Match
            currentState = GAME_STATE.MATCH_MULTI;
        }
    });
  }
}