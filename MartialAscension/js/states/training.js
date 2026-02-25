// --- Training Mode Character Select State ---
let trainPlayerSelected = 0;
let trainDummySelected = 1;
let trainPlayerReady = false;
let trainDummyReady = false;
let trainSelectingDummy = false; // false = selecting player, true = selecting dummy

function drawCharacterSelectTraining() {
  background(20);
  let centerX = width / 2;

  // TRAINING MODE Banner
  push();
  textAlign(CENTER, CENTER);
  // Green/gold tint to differentiate from VS mode
  drawTitle("TRAINING MODE", centerX, height * 0.06, width * 0.022);
  pop();

  // VS divider
  push();
  textAlign(CENTER, CENTER);
  drawTitle("VS", centerX, height * 0.4, width * 0.12);
  pop();

  // Top Prompts
  push();
  textFont(metalFont);
  textAlign(CENTER, CENTER);
  textSize(width * 0.012);
  if (!trainPlayerReady) {
    fill(0, 150, 255);
    text("PRESS 'F' TO CONFIRM", width * 0.15, height * 0.08);
  }
  if (!trainDummyReady) {
    fill(180, 180, 180);
    text("PRESS 'ENTER' TO CONFIRM DUMMY", width * 0.85, height * 0.08);
  }
  pop();

  // Draw Large Previews
  drawTrainingPreview(0, trainPlayerSelected, trainPlayerReady, "PLAYER", [0, 150, 255]);
  drawTrainingPreview(width, trainDummySelected, trainDummyReady, "DUMMY", [160, 160, 160]);

  // Character Grid
  let cols = 4;
  let iconSize = width * 0.075;
  let spacing = 15;
  let gridW = (cols * iconSize) + ((cols - 1) * spacing);
  let startX = (width - gridW) / 2;
  let startY = height * 0.60;

  FIGHTERS.forEach((fighter, index) => {
    let col = index % cols;
    let row = Math.floor(index / cols);
    let x = startX + col * (iconSize + spacing) + iconSize / 2;
    let y = startY + row * (iconSize + spacing) + iconSize / 2;

    push();
    rectMode(CENTER);
    if (index === trainPlayerSelected && index === trainDummySelected) {
      strokeWeight(4); stroke(255);
    } else if (index === trainPlayerSelected) {
      strokeWeight(4); stroke(0, 100, 255);
    } else if (index === trainDummySelected) {
      strokeWeight(4); stroke(160, 160, 160);
    } else {
      stroke(255, 20); strokeWeight(1);
    }
    fill(30);
    rect(x, y, iconSize, iconSize, 5);

    if (fighter.thumbImg) {
      imageMode(CENTER);
      image(fighter.thumbImg, x, y, iconSize - 10, iconSize - 10);
    }
    pop();

    if (index === trainPlayerSelected) drawTag("YOU", x - iconSize / 2, y - iconSize / 2, [0, 100, 255]);
    if (index === trainDummySelected) drawTag("CPU", x + iconSize / 2, y - iconSize / 2, [120, 120, 120]);
  });

  // Active selector hint arrows under current icon
  push();
  textAlign(CENTER, CENTER);
  textFont(metalFont);
  textSize(width * 0.012);
  noStroke();

  if (!trainPlayerReady) {
    let col = trainPlayerSelected % cols;
    let row = Math.floor(trainPlayerSelected / cols);
    let px = startX + col * (iconSize + spacing) + iconSize / 2;
    let py = startY + row * (iconSize + spacing) + iconSize / 2;
    fill(0, 150, 255);
    text("A  D", px, py + iconSize / 2 + 20);
  }

  if (!trainDummyReady) {
    let col = trainDummySelected % cols;
    let row = Math.floor(trainDummySelected / cols);
    let px = startX + col * (iconSize + spacing) + iconSize / 2;
    let py = startY + row * (iconSize + spacing) + iconSize / 2;
    fill(160, 160, 160);
    text("<-- -->", px, py + iconSize / 2 + 20);
  }
  pop();

  // Final Prompts once both confirmed
  if (trainPlayerReady && trainDummyReady) {
    push();
    textAlign(CENTER, CENTER);
    drawTitle("PRESS SPACE TO START TRAINING", centerX, height * 0.85, width * 0.02);
    drawTitle("OR PRESS 'Q' TO CANCEL", centerX, height * 0.92, width * 0.015);
    pop();
  }

  if (typeof drawBackButton === "function") drawBackButton();
}

// Preview panel — reused pattern from drawMultiplayerPreview but with label param
function drawTrainingPreview(edgeX, index, isReady, label, col) {
  let fighter = FIGHTERS[index];
  let isLeft = (edgeX === 0);
  let drawCenterX = isLeft ? width * 0.17 : width * 0.83;

  push();
  if (isReady) {
    drawingContext.shadowBlur = 40;
    drawingContext.shadowColor = isLeft
      ? 'rgba(67, 84, 243, 0.8)'
      : 'rgba(160, 160, 160, 0.6)';
  }

  if (fighter.previewImg) {
    push();
    imageMode(CENTER);
    let h = height * 0.9;
    let w = (fighter.previewImg.width / fighter.previewImg.height) * h;
    translate(isLeft ? w / 2 - (width * 0.01) : width - w / 2 + (width * 0.01), height - (h / 2));
    if (!isLeft) scale(-1, 1);
    // Desaturate the dummy slightly to visually distinguish it
    if (!isLeft) {
      drawingContext.filter = 'grayscale(60%)';
    }
    image(fighter.previewImg, 0, 0, w, h);
    if (!isLeft) drawingContext.filter = 'none';
    pop();
  }

  let textBaseY = height * 0.75;
  textAlign(CENTER, CENTER);

  if (isReady) {
    drawTitle("READY!", drawCenterX, textBaseY, width * 0.03);
  } else {
    // Role label ("PLAYER" / "DUMMY") above name
    push();
    textFont(metalFont);
    textSize(width * 0.013);
    fill(col[0], col[1], col[2]);
    noStroke();
    text(label, drawCenterX, textBaseY - height * 0.06);
    pop();

    drawTitle(fighter.name.toUpperCase(), drawCenterX, textBaseY, width * 0.040);
    drawTitle(fighter.nickname.toUpperCase(), drawCenterX, textBaseY + height * 0.09, width * 0.020);
    drawTitle(fighter.archetype.toUpperCase(), drawCenterX, textBaseY + height * 0.15, width * 0.018);
  }
  pop();
}

// --- Input Handler for Training Select ---
function handleTrainingSelectInput(key) {
  let cols = 4;
  let total = FIGHTERS.length;

  // Player controls: A/D or Left/Right arrows
  if (!trainPlayerReady) {
    if (key === 'a' || key === 'ArrowLeft') {
      trainPlayerSelected = (trainPlayerSelected - 1 + total) % total;
    } else if (key === 'd' || key === 'ArrowRight') {
      trainPlayerSelected = (trainPlayerSelected + 1) % total;
    } else if (key === 'f') {
      trainPlayerReady = true;
    }
  }

  // Dummy controls: Arrow keys (Left/Right) or J/L
  if (!trainDummyReady) {
    if (key === 'ArrowLeft' || key === 'j') {
      trainDummySelected = (trainDummySelected - 1 + total) % total;
    } else if (key === 'ArrowRight' || key === 'l') {
      trainDummySelected = (trainDummySelected + 1) % total;
    } else if (key === 'Enter') {
      trainDummyReady = true;
    }
  }

  // Start training
  if (trainPlayerReady && trainDummyReady && key === ' ') {
    startTrainingMode(trainPlayerSelected, trainDummySelected);
  }

  // Cancel / back
  if (key === 'q' || key === 'Q') {
    resetTrainingSelect();
    gameState = "menu"; // or wherever your menu state is
  }
}

function resetTrainingSelect() {
  trainPlayerSelected = 0;
  trainDummySelected = 1;
  trainPlayerReady = false;
  trainDummyReady = false;
}

// Hook this into your existing keyPressed:
// function keyPressed() {
//   if (gameState === "trainingSelect") handleTrainingSelectInput(key);
// }