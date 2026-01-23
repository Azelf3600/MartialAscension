let p1Selected = 0;
let p2Selected = 1; // Default P2 to the second character
let p1Ready = false;
let p2Ready = false;

function drawCharacterSelectMulti() {
  background(10);
  
  let centerX = width / 2;
  
  // 1. Draw the "VERSUS" Background Text
  push();
  textAlign(CENTER, CENTER);
  textSize(width * 0.15);
  fill(255, 5); // Very faint
  drawTitle("VS", centerX, height * 0.4, width * 0.2);
  pop();

  // 1.5 Confirmation Prompts
  push();
  textFont(metalFont);
  textAlign(CENTER, CENTER);
  textSize(width * 0.015);
  
  // Player 1 Prompt
  if (!p1Ready) {
    fill(0, 150, 255, 200); // Blueish tint
    text("PRESS 'F' TO CONFIRM", width * 0.15, height * 0.15);
  }

  // Player 2 Prompt
  if (!p2Ready) {
    fill(255, 50, 50, 200); // Reddish tint
    text("PRESS 'ENTER' TO CONFIRM", width * 0.85, height * 0.15);
  }
  pop();

  // 2. Draw Side Previews
  // Player 1 (Left)
  drawMultiplayerPreview(0, p1Selected, p1Ready);
  // Player 2 (Right)
  drawMultiplayerPreview(width - width * 0.3, p2Selected, p2Ready);

  // 3. Center Grid (Tekken Style)

  // Dynamic columns: Square root makes it a balanced grid, or keep it 4 but dynamic rows
  let totalFighters = FIGHTERS.length;
  let cols = totalFighters > 4 ? Math.ceil(Math.sqrt(totalFighters)) : totalFighters;
  
  let iconSize = width * 0.075;
  let spacing = 10;
  let gridW = (cols * iconSize) + ((cols - 1) * spacing);
  let startX = (width - gridW) / 2;
  let startY = height * 0.7;

  FIGHTERS.forEach((fighter, index) => {
    let col = index % cols;
    let row = Math.floor(index / cols);
    let x = startX + col * (iconSize + spacing);
    let y = startY + row * (iconSize + spacing);

    push();
    // Border logic for two players
    if (index === p1Selected && index === p2Selected) {
      strokeWeight(4);
      stroke(255); // White if both hovering same icon
    } else if (index === p1Selected) {
      strokeWeight(4);
      stroke(0, 100, 255); // Blue for P1
    } else if (index === p2Selected) {
      strokeWeight(4);
      stroke(255, 0, 0); // Red for P2
    } else {
      stroke(50);
      strokeWeight(1);
    }
    
    fill(20);
    rect(x, y, iconSize, iconSize, 5);
    if (fighter.img) image(fighter.img, x + 5, y + 5, iconSize - 10, iconSize - 10);
    pop();
    
    // Player Tags (P1/P2 indicators on the icons)
    if (index === p1Selected) drawTag("P1", x, y, [0, 100, 255]);
    if (index === p2Selected) drawTag("P2", x + iconSize, y, [255, 0, 0]);
  });

  // 4. Start Match Logic
  if (p1Ready && p2Ready) {
    drawText("PRESS SPACE TO CHOOSE STAGE OR PRESS Q TO CANCEL", centerX, height * 0.9, width * 0.02);
  }

  drawBackButton();
}

function drawMultiplayerPreview(posX, index, isReady) {
  let fighter = FIGHTERS[index];
  let previewW = width * 0.3;
  
  push();
  if (isReady) {
    // Glow effect when confirmed
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = posX === 0 ? 'blue' : 'red';
  }

  if (fighter.img) {
    // Mirror Player 2's image so they face Player 1
    if (posX > 0) {
      push();
      translate(posX + previewW, height * 0.2);
      scale(-1, 1);
      image(fighter.img, 0, 0, previewW, height * 0.5);
      pop();
    } else {
      image(fighter.img, posX, height * 0.2, previewW, height * 0.5);
    }
  }

  // Name and Status
  textAlign(CENTER);
  let label = isReady ? "READY" : fighter.name.toUpperCase();
  fill(isReady ? [0, 255, 0] : 255);
  drawTitle(label, posX + previewW / 2, height * 0.75, width * 0.03);
  pop();
}

function drawTag(txt, x, y, col) {
  fill(col);
  noStroke();
  rect(x - 10, y - 10, 25, 15, 3);
  fill(255);
  textSize(10);
  text(txt, x + 2, y - 2);
}