const GAME_STATE = {
  MENU: "menu",
  CHARACTER_SELECT: "character_select",
  CHARACTER_SELECT_MULTI: "character_select_multi",
  STAGE_SELECT: "stage_select",
  STAGE_SELECT_MULTI: "stage_select_multi",
  MATCH: "match",
  MATCH_MULTI: "match_multi",
  PAUSE_MENU: "pause_menu",
  PAUSE_MENU_MULTI: "pause_menu_multi",
  LOADING_MATCH: "loading_match",
  LOADING_MATCH_MULTI: "loading_match_multi"
};

let currentState = GAME_STATE.MENU;
let p1Buffer;
let p2Buffer;
let gameCamera; 

function preload() {
  // Preload fonts and images
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

    case GAME_STATE.LOADING_MATCH:
      drawLoadingMatch();
      break;

    case GAME_STATE.LOADING_MATCH_MULTI:
      drawLoadingMatchMulti();
      break;

    case GAME_STATE.MATCH:
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
  //MULTIPLAYER CHARACTER SELECTION CONTROLS
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
  }

  //MATCH INPUT RECORDING (COMBO SYSTEM)
  if (currentState === GAME_STATE.MATCH || currentState === GAME_STATE.MATCH_MULTI) {
    if (typeof player1 !== 'undefined') handleRecording(player1, p1Buffer, keyCode);
    if (typeof player2 !== 'undefined') handleRecording(player2, p2Buffer, keyCode);
  }
}

function handleRecording(char, buffer, code) {
  let move = InputBuffer.getDirectionalInput(code, char);

  if (!move) {
    if (code === char.controls.lightPunch) move = "LP";
    else if (code === char.controls.heavyPunch) move = "HP";
    else if (code === char.controls.lightKick) move = "LK";
    else if (code === char.controls.heavyKick) move = "HK";
  }

  if (move) {
    //Check for combo FIRST
    buffer.recordInput(move);
    let result = checkCombo(buffer, STANDARD_COMBOS);

    if (result) {
      char.attackTimer = 0; 
      char.executeCombo(result);
      
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
  if (currentState === GAME_STATE.CHARACTER_SELECT || currentState === GAME_STATE.STAGE_SELECT) {
    let backBtn = { x: width * 0.1, y: height * 0.9, w: width * 0.1, h: height * 0.05 };
    if (isHovering(backBtn)) {
      if (currentState === GAME_STATE.STAGE_SELECT) currentState = GAME_STATE.CHARACTER_SELECT;
      else currentState = GAME_STATE.MENU;
      return;
    }
  }

  // Fighter Selection (Single Player)
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
        selectedChar = index;
        currentState = GAME_STATE.STAGE_SELECT;
      }
    });
  }

  // Stage Selection (Single Player)
  if (currentState === GAME_STATE.STAGE_SELECT) {
    handleStageSelection(GAME_STATE.MATCH);
  }

  // Stage Selection (Multiplayer)
  if (currentState === GAME_STATE.STAGE_SELECT_MULTI) {
    handleStageSelection(GAME_STATE.LOADING_MATCH_MULTI);
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