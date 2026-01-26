// ================================
// PLAYER DATA
// ================================
let p1 = {
  x: 200,
  y: 0,
  w: 180,
  standH: 350,
  crouchH: 185,
  h: 350,
  velY: 0,
  lastInput: ""
};

let p2 = {
  x: 700,
  y: 0,
  w: 180,
  standH: 350,
  crouchH: 185,
  h: 350,
  velY: 0,
  lastInput: ""
};

let speed = 8;
let gravity = 3;
let jumpPower = 30;
let groundY;

// ================================
// MAIN LOOP
// ================================
function drawMatchMulti() {
  background(25);

  // ===== GROUND =====
  groundY = height - 100;
  fill(120);
  rect(0, groundY, width, 100);

  // ===== INITIAL Y =====
  if (p1.y === 0) p1.y = groundY - p1.h;
  if (p2.y === 0) p2.y = groundY - p2.h;

  // ================================
  // PLAYER 1
  // ================================
  let p1Inputs = [];

  // Movement
  if (keyIsDown(65)) { p1.x -= speed; p1Inputs.push("A"); }
  if (keyIsDown(68)) { p1.x += speed; p1Inputs.push("D"); }

  // Jump
  if (keyIsDown(87) && p1.y + p1.h >= groundY) {
    p1.velY = -jumpPower;
    p1Inputs.push("W");
  }

  // Crouch / Stand
  if (keyIsDown(83)) {
    if (p1.h !== p1.crouchH) {
      p1.y += p1.h - p1.crouchH;
      p1.h = p1.crouchH;
    }
    p1Inputs.push("S");
  } else {
    if (p1.h !== p1.standH) {
      p1.y += p1.h - p1.standH;
      p1.h = p1.standH;
    }
  }

  // Attacks
  if (keyIsDown(89)) p1Inputs.push("LP"); // Y
  if (keyIsDown(85)) p1Inputs.push("HP"); // U
  if (keyIsDown(72)) p1Inputs.push("LK"); // H
  if (keyIsDown(74)) p1Inputs.push("HK"); // J

  // Gravity
  p1.velY += gravity;
  p1.y += p1.velY;
  if (p1.y + p1.h > groundY) {
    p1.y = groundY - p1.h;
    p1.velY = 0;
  }

  p1.lastInput = p1Inputs.join(" + ");

  // ================================
  // PLAYER 2
  // ================================
  let p2Inputs = [];

  if (keyIsDown(LEFT_ARROW)) { p2.x -= speed; p2Inputs.push("←"); }
  if (keyIsDown(RIGHT_ARROW)) { p2.x += speed; p2Inputs.push("→"); }

  if (keyIsDown(UP_ARROW) && p2.y + p2.h >= groundY) {
    p2.velY = -jumpPower;
    p2Inputs.push("↑");
  }

  if (keyIsDown(DOWN_ARROW)) {
    if (p2.h !== p2.crouchH) {
      p2.y += p2.h - p2.crouchH;
      p2.h = p2.crouchH;
    }
    p2Inputs.push("↓");
  } else {
    if (p2.h !== p2.standH) {
      p2.y += p2.h - p2.standH;
      p2.h = p2.standH;
    }
  }

  // Attacks
  if (keyIsDown(73)) p2Inputs.push("LP"); // I
  if (keyIsDown(79)) p2Inputs.push("HP"); // O
  if (keyIsDown(75)) p2Inputs.push("LK"); // K
  if (keyIsDown(76)) p2Inputs.push("HK"); // L

  // Gravity
  p2.velY += gravity;
  p2.y += p2.velY;
  if (p2.y + p2.h > groundY) {
    p2.y = groundY - p2.h;
    p2.velY = 0;
  }

  p2.lastInput = p2Inputs.join(" + ");

  // ================================
  // DRAW PLAYERS
  // ================================
  noStroke();
  fill(255, 80, 80);
  rect(p1.x, p1.y, p1.w, p1.h);

  fill(80, 120, 255);
  rect(p2.x, p2.y, p2.w, p2.h);

  // ================================
  // DRAW NAMES
  // ================================
  textAlign(CENTER, BOTTOM);
  textSize(24);
  fill(255);

  if (typeof FIGHTERS !== "undefined") {
    if (FIGHTERS[p1Selected]) {
      text(FIGHTERS[p1Selected].name, p1.x + p1.w / 2, p1.y - 10);
    }
    if (FIGHTERS[p2Selected]) {
      text(FIGHTERS[p2Selected].name, p2.x + p2.w / 2, p2.y - 10);
    }
  }

  // ================================
  // INPUT DEBUG
  // ================================
  textAlign(CENTER, TOP);
  textSize(18);
  stroke(0);
  strokeWeight(3);

  fill(255, 255, 0);
  text(p1.lastInput, p1.x + p1.w / 2, p1.y + p1.h + 10);

  fill(0, 255, 255);
  text(p2.lastInput, p2.x + p2.w / 2, p2.y + p2.h + 10);

  noStroke();
}
