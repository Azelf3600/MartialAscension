let metalFont;
let singleBtn, multiBtn;

function preload() {
  metalFont = loadFont("Assets/fonts/MetalMania-Regular.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(0);
  drawMenu();
}

function drawMenu() {
  let centerX = width / 2;
  let centerY = height / 2;

  // 🔥 TITLE WITH RED BORDER
  drawTitle("Martial Ascension", centerX, centerY - height * 0.25, width * 0.1);

  drawText("Click to proceed", centerX, centerY - height * 0.01, width * 0.015);

  // Buttons positions
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

// 🔥 Title with red stroke
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

// 🔥 Button with hover underline
function drawButton(label, btn) {
  push();
  textFont(metalFont);
  textSize(width * 0.035);
  fill(255);
  noStroke();
  text(label, btn.x, btn.y);

  // Hover detection using rectangle area
  if (isHovering(btn)) {
    let textW = textWidth(label);
    let underlineY = btn.y + height * 0.055;

    stroke(255);
    strokeWeight(3);
    line(btn.x - textW / 2, underlineY, btn.x + textW / 2, underlineY);
  }

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

function drawText(content, x, y, size) {
  push();
  textFont(metalFont);
  textSize(size);
  fill(255);
  noStroke();
  text(content, x, y);
  pop();
}

function mousePressed() {
  if (isHovering(singleBtn)) {
    console.log("Single Player Selected");
  }
  if (isHovering(multiBtn)) {
    console.log("Multiplayer Selected");
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
