let p1Selected = 0;
let p2Selected = 1; // Default P2 to the second character
let p1Ready = false;
let p2Ready = false;

function drawCharacterSelectMulti() { 
  background(20);
  
  let centerX = width / 2;
  
  //VS text in the middle
  push();
  textAlign(CENTER, CENTER);
  textSize(width * 0.15);
  fill(255, 5);
  drawTitle("VS", centerX, height * 0.4, width * 0.15);
  pop();

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

  // Draw Side Previews
  // Player 1 (Left)
  drawMultiplayerPreview(0, p1Selected, p1Ready);
  // Player 2 (Right)
  drawMultiplayerPreview(width - width * 0.3, p2Selected, p2Ready);

  //For columns, this is relative to the array in data/characters.js
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
    // Border logic when selecting for two players
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
    if (fighter.img) {
    let imgRatio = fighter.img.width / fighter.img.height;
    let iW, iH;
    if (imgRatio > 1) { // Wider than tall
        iW = iconSize - 10;
        iH = iW / imgRatio;
    } else { // Taller than wide
        iH = iconSize - 10;
        iW = iH * imgRatio;
    }
    let ox = (iconSize - iW) / 2;
    let oy = (iconSize - iH) / 2;
    image(fighter.img, x + ox, y + oy, iW, iH); 
    }
    pop();
    
    // Player Tags (P1/P2 indicators on the icons)
    if (index === p1Selected) drawTag("P1", x, y, [0, 100, 255]);
    if (index === p2Selected) drawTag("P2", x + iconSize, y, [255, 0, 0]);
  });

  // Move to stage select multiplayer mode 
  if (p1Ready && p2Ready) {
    drawText("PRESS SPACE TO CHOOSE STAGE OR PRESS Q TO CANCEL", centerX, height * 0.9, width * 0.02);
  }

  drawBackButton();
}

function drawMultiplayerPreview(posX, index, isReady) {
  let fighter = FIGHTERS[index];
  let previewW = width * 0.3;
  let previewH = height * 0.5; // The intended area height
  
  push();
  if (isReady) {
    // Glow effect when confirmed
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = posX === 0 ? 'blue' : 'red';
  }

  if (fighter.img) {
    // 1. Calculate Aspect Ratio
    let imgRatio = fighter.img.width / fighter.img.height;
    let areaRatio = previewW / previewH;

    let drawW, drawH;

    // 2. Determine scaling to prevent stretching
    if (imgRatio > areaRatio) {
      drawW = previewW;
      drawH = previewW / imgRatio;
    } else {
      drawH = previewH;
      drawW = drawH * imgRatio;
    }

    // 3. Center and Draw
    let yOffset = (previewH - drawH) / 2;
    let xOffset = (previewW - drawW) / 2;

    if (posX > 0) {
      // Mirror Player 2 (Right side)
      push();
      translate(posX + xOffset + drawW, height * 0.2 + yOffset);
      scale(-1, 1);
      image(fighter.img, 0, 0, drawW, drawH);
      pop();
    } else {
      // Player 1 (Left side)
      image(fighter.img, posX + xOffset, height * 0.2 + yOffset, drawW, drawH);
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