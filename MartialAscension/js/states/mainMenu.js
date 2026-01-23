let metalFont;
let singleBtn, multiBtn;

// Called from sketch.js preload()
function preloadMainMenu() {
  metalFont = loadFont("Assets/fonts/MetalMania-Regular.ttf");

  FIGHTERS.forEach(fighter => {
    fighter.img = loadImage(fighter.imagePath);
  });

  // Inside your preload() function in sketch.js
  STAGES.forEach(stage => {
    stage.img = loadImage(stage.path);
  });
}

// NEW: This function handles the "Responsive" math
function setupMenuLayout() {
  let centerX = width / 2;
  let centerY = height / 2;

  singleBtn = {
    x: centerX,
    y: centerY + height * 0.05,
    w: width * 0.3,
    h: height * 0.05
  };

  multiBtn = {
    x: centerX,
    y: centerY + height * 0.15,
    w: width * 0.3,
    h: height * 0.05
  };
}

function drawMenu() {
  // We no longer define buttons here, we just draw them
  let centerX = width / 2;
  let centerY = height / 2;

  drawTitle("Martial Ascension", centerX, centerY - height * 0.25, width * 0.1);
  drawText("Click to proceed", centerX, centerY - height * 0.01, width * 0.015);

  drawButton("Single Player", singleBtn);
  drawButton("Multiplayer", multiBtn);

  drawText("Starloom 2025", centerX, height - height * 0.05, width * 0.015);
}

// Updated handleMenuClick in mainMenu.js
function handleMenuClick() {
  if (isHovering(singleBtn)) {
    // Optional: add a 'clicked' sound or visual effect here
    setTimeout(() => {
      currentState = GAME_STATE.CHARACTER_SELECT;
    }, 500); // 0.5 second delay
  }

  if (isHovering(multiBtn)) {
    setTimeout(() => {
      currentState = GAME_STATE.CHARACTER_SELECT_MULTI;
    }, 500); // 0.5 second delay
  }
}

// ===================
// UI HELPERS
// ===================

function drawTitle(content, x, y, size) {
  push();
  textFont(metalFont);
  textSize(size);
  stroke(180, 0, 0);
  strokeWeight(8);
  fill(255);
  text(content, x, y);
  pop();
}

function drawButton(label, btn) {
  push();
  textFont(metalFont);
  textSize(width * 0.035);
  fill(255);
  noStroke();
  text(label, btn.x, btn.y);

  if (isHovering(btn)) {
    let textW = textWidth(label);
    let underlineY = btn.y + height * 0.055;

    stroke(255);
    strokeWeight(3);
    line(btn.x - textW / 2, underlineY, btn.x + textW / 2, underlineY);
  }

  pop();
}

function drawText(content, x, y, size) {
  push();
  textFont(metalFont);
  textSize(size);
  fill(255);
  noStroke();
  text(content, x, y);
  pop();
}

function isHovering(btn) {
  return (
    mouseX > btn.x - btn.w / 2 &&
    mouseX < btn.x + btn.w / 2 &&
    mouseY > btn.y - btn.h / 2 &&
    mouseY < btn.y + btn.h / 2
  );
}