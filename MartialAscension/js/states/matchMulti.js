// ================================
// TEMP PLAYER DATA
// ================================
let p1 = {
  x: 200,
  y: 0,
  w: 200,
  h: 220,
  standH: 500,
  crouchH: 270,
  velY: 0,
  lastInput: "",
  facing: 1 // 1 = right, -1 = left
};

let p2 = {
  x: 700,
  y: 0,
  w: 200,
  h: 220,
  standH: 500,
  crouchH: 270,
  velY: 0,
  lastInput: "",
  facing: -1
};

let speed = 8;
let gravity = 3;
let jumpPower = 30;
let groundY;

// ================================
// MAIN LOOP FOR MULTIPLAYER MATCH
// ================================
function drawMatchMulti() {
  background(25);

  // ----- GROUND -----
  groundY = height - 100;
  fill(120);
  rect(0, groundY, width, 100);

  // ----- INITIAL Y POSITION -----
  if (p1.y === 0) p1.y = groundY - p1.h;
  if (p2.y === 0) p2.y = groundY - p2.h;

  // ================================
  // HANDLE PLAYER 1 INPUTS
  // ================================
  let p1Inputs = [];

  // Movement
  if (keyIsDown(65)) { p1.x -= speed; p1Inputs.push("A"); } // A
  if (keyIsDown(68)) { p1.x += speed; p1Inputs.push("D"); } // D

  // Jump
  if (keyIsDown(87) && p1.y + p1.h >= groundY) {
    p1.velY = -jumpPower;
    p1Inputs.push("W");
  }

  // Crouch
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

  // Apply gravity
  p1.velY += gravity;
  p1.y += p1.velY;
  if (p1.y + p1.h > groundY) {
    p1.y = groundY - p1.h;
    p1.velY = 0;
  }

  // ================================
  // HANDLE PLAYER 2 INPUTS
  // ================================
  let p2Inputs = [];

  // Movement
  if (keyIsDown(LEFT_ARROW)) { p2.x -= speed; p2Inputs.push("←"); }
  if (keyIsDown(RIGHT_ARROW)) { p2.x += speed; p2Inputs.push("→"); }

  // Jump
  if (keyIsDown(UP_ARROW) && p2.y + p2.h >= groundY) {
    p2.velY = -jumpPower;
    p2Inputs.push("↑");
  }

  // Crouch
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

  // Apply gravity
  p2.velY += gravity;
  p2.y += p2.velY;
  if (p2.y + p2.h > groundY) {
    p2.y = groundY - p2.h;
    p2.velY = 0;
  }

  // ================================
  // UPDATE FACING (always face each other)
  // ================================
  p1.facing = p1.x < p2.x ? 1 : -1;
  p2.facing = p2.x < p1.x ? 1 : -1;

  // Save last input strings
  p1.lastInput = p1Inputs.join(" + ");
  p2.lastInput = p2Inputs.join(" + ");

  // ================================
  // DRAW HITBOXES (OUTLINE ONLY)
  // ================================
  strokeWeight(3);

  // Player 1 outline (blue)
  noFill();
  stroke(80, 120, 255);
  rect(p1.x, p1.y, p1.w, p1.h);

  // Front indicator for P1
  fill(80, 120, 255);
  let frontH = p1.h * 0.2;
  let frontY = p1.y + p1.h / 2;
  if (p1.facing === 1) {
    triangle(p1.x + p1.w, frontY - frontH / 2, p1.x + p1.w, frontY + frontH / 2, p1.x + p1.w + frontH, frontY);
  } else {
    triangle(p1.x, frontY - frontH / 2, p1.x, frontY + frontH / 2, p1.x - frontH, frontY);
  }

  // Player 2 outline (red)
  noFill();
  stroke(255, 80, 80);
  rect(p2.x, p2.y, p2.w, p2.h);

  // Front indicator for P2
  fill(255, 80, 80);
  let frontH2 = p2.h * 0.2;
  let frontY2 = p2.y + p2.h / 2;
  if (p2.facing === 1) {
    triangle(p2.x + p2.w, frontY2 - frontH2 / 2, p2.x + p2.w, frontY2 + frontH2 / 2, p2.x + p2.w + frontH2, frontY2);
  } else {
    triangle(p2.x, frontY2 - frontH2 / 2, p2.x, frontY2 + frontH2 / 2, p2.x - frontH2, frontY2);
  }

  noFill();
  noStroke();

  // ================================
  // DRAW NAMES ABOVE PLAYERS
  // ================================
  textAlign(CENTER, BOTTOM);
  textSize(24);
  fill(255);
  if (FIGHTERS[p1Selected]) text(FIGHTERS[p1Selected].name, p1.x + p1.w / 2, p1.y - 10);
  if (FIGHTERS[p2Selected]) text(FIGHTERS[p2Selected].name, p2.x + p2.w / 2, p2.y - 10);

  // ================================
  // DRAW LAST INPUTS BELOW PLAYERS
  // ================================
  textSize(18);
  textAlign(CENTER, TOP);
  stroke(0);
  strokeWeight(3);

  fill(255, 255, 0); // P1 input
  text(p1.lastInput, p1.x + p1.w / 2, p1.y + p1.h + 10);

  fill(0, 255, 255); // P2 input
  text(p2.lastInput, p2.x + p2.w / 2, p2.y + p2.h + 10);

  noStroke();
}
