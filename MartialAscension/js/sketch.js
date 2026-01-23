const GAME_STATE = {
  MENU: "menu",
  CHARACTER_SELECT: "character_select",
  MATCH: "match"
};

let currentState = GAME_STATE.MENU;

function preload() {
  preloadMainMenu();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
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
  }
}

function mousePressed() {
  if (currentState === GAME_STATE.MENU) {
    handleMenuClick();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}