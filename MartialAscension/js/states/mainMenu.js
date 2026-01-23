let metalFont;
let singleBtn, multiBtn;

// Called from sketch.js preload()
function preloadMainMenu() {
  metalFont = loadFont("Assets/fonts/MetalMania-Regular.ttf");
}

// Called from sketch.js draw()
function drawMenu() {
  let centerX = width / 2;
  let centerY = height / 2;

  drawTitle("Martial Ascension", centerX, centerY - height * 0.25, width * 0.1);
  drawText("Click to proceed", centerX, centerY - height * 0.01, width * 0.015);

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

  drawButton("Single Player", singleBtn);
  drawButton("Multiplayer", multiBtn);

  drawText("Starloom 2025", centerX, height - height * 0.05, width * 0.015);
}

// Called from sketch.js mousePressed()
function handleMenuClick() {
  if (isHovering(singleBtn)) {
    currentState = GAME_STATE.CHARACTER_SELECT;
  }

  if (isHovering(multiBtn)) {
    console.log("Multiplayer Selected");
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