let p1Selected = 0;
let p2Selected = 1;
let p1Ready = false;
let p2Ready = false;

function drawCharacterSelectMulti() { 
  background(20);
  let centerX = width / 2;
  
  // VS Title
  push();
  textAlign(CENTER, CENTER);
  drawTitle("VS", centerX, height * 0.4, width * 0.12);
  pop();

  // Top Prompts
  push();
  textFont(metalFont);
  textAlign(CENTER, CENTER);
  textSize(width * 0.012);
  if (!p1Ready) { fill(0, 150, 255); text("PRESS 'F' TO CONFIRM", width * 0.15, height * 0.08); }
  if (!p2Ready) { fill(255, 50, 50); text("PRESS 'ENTER' TO CONFIRM", width * 0.85, height * 0.08); }
  pop();

  // Draw Large Previews
  drawMultiplayerPreview(0, p1Selected, p1Ready, 1);
  drawMultiplayerPreview(width, p2Selected, p2Ready, 2);

  // Character Grid - Restored Icon Size
  let totalFighters = FIGHTERS.length;
  let cols = 4; 
  let iconSize = width * 0.075; // Increased back to original size
  let spacing = 15;
  let gridW = (cols * iconSize) + ((cols - 1) * spacing);
  let startX = (width - gridW) / 2;
  let startY = height * 0.60; // Positioned relative to the VS title

  FIGHTERS.forEach((fighter, index) => {
    let col = index % cols;
    let row = Math.floor(index / cols);
    let x = startX + col * (iconSize + spacing) + iconSize / 2;
    let y = startY + row * (iconSize + spacing) + iconSize / 2;

    push();
    rectMode(CENTER);
    if (index === p1Selected && index === p2Selected) { strokeWeight(4); stroke(255); }
    else if (index === p1Selected) { strokeWeight(4); stroke(0, 100, 255); }
    else if (index === p2Selected) { strokeWeight(4); stroke(255, 0, 0); }
    else { stroke(255, 20); strokeWeight(1); }
    fill(30);
    rect(x, y, iconSize, iconSize, 5);

    if (fighter.thumbImg) {
      imageMode(CENTER);
      image(fighter.thumbImg, x, y, iconSize - 10, iconSize - 10);
    }
    pop();
    
    // Tag drawing logic
    if (index === p1Selected) drawTag("P1", x - iconSize/2, y - iconSize/2, [0, 100, 255]);
    if (index === p2Selected) drawTag("P2", x + iconSize/2, y - iconSize/2, [255, 0, 0]);
  });

    push();
  textAlign(CENTER, CENTER);
  textFont(metalFont);
  textSize(width * 0.012);
  noStroke();
  
  if (!p1Ready) {
    let p1Col = p1Selected % cols;
    let p1Row = Math.floor(p1Selected / cols);
    let p1X = startX + p1Col * (iconSize + spacing) + iconSize / 2;
    let p1Y = startY + p1Row * (iconSize + spacing) + iconSize / 2;
    fill(0, 150, 255);
    text("A D", p1X, p1Y + iconSize/2 + 20);
  }
  
  if (!p2Ready) {
    let p2Col = p2Selected % cols;
    let p2Row = Math.floor(p2Selected / cols);
    let p2X = startX + p2Col * (iconSize + spacing) + iconSize / 2;
    let p2Y = startY + p2Row * (iconSize + spacing) + iconSize / 2;
    fill(255, 50, 50);
    text("<-- -->", p2X, p2Y + iconSize/2 + 20);
  }
  pop();

  // Final Prompts
  if (p1Ready && p2Ready) {
    push();
    textAlign(CENTER, CENTER);
    drawTitle("PRESS SPACE TO CHOOSE STAGE", centerX, height * 0.85, width * 0.02);
    // Fixed 'Q' prompt color and font to match Space prompt
    drawTitle("OR PRESS 'Q' TO CANCEL", centerX, height * 0.92, width * 0.015);
    pop();
  }

  if (typeof drawBackButton === "function") drawBackButton();
}

function drawMultiplayerPreview(edgeX, index, isReady, playerNum) {
  let fighter = FIGHTERS[index];
  let isP1 = (playerNum === 1);
  
  // ADJUSTED: Moved P1 further right and P2 further left to center the text block 
  // under the characters properly.
  let drawCenterX = isP1 ? width * 0.17 : width * 0.83; 
  
  push();
  if (isReady) {
    drawingContext.shadowBlur = 40;
    drawingContext.shadowColor = isP1 ? 'rgba(67, 84, 243, 0.8)' : 'rgba(255, 28, 59, 0.8)';
  }

  // Preview Image
  if (fighter.previewImg) {
    push();
    imageMode(CENTER);
    let h = height * 0.9; 
    let w = (fighter.previewImg.width / fighter.previewImg.height) * h;
    translate(isP1 ? w/2 - (width*0.01) : width - w/2 + (width*0.01), height - (h/2)); 
    if (!isP1) scale(-1, 1);
    image(fighter.previewImg, 0, 0, w, h);
    pop();
  }

  // Text Stack - Anchored for centering
  let textBaseY = height * 0.75; 
  textAlign(CENTER, CENTER); // Force centering for the stack

  if (isReady) {
    drawTitle("READY", drawCenterX, textBaseY, width * 0.03);
  } else {
    // 1. Name
    drawTitle(fighter.name.toUpperCase(), drawCenterX, textBaseY, width * 0.040);
    
    // 2. Nickname (Centered under Name)
    drawTitle(fighter.nickname.toUpperCase(), drawCenterX, textBaseY + height * 0.09, width * 0.020);
    
    // 3. Archetype (Centered under Nickname)
    drawTitle(fighter.archetype.toUpperCase(), drawCenterX, textBaseY + height * 0.15, width * 0.018);
  }
  pop();
}

// Fixed drawTag function
function drawTag(txt, x, y, col) {
  push();
  rectMode(CENTER);
  fill(col);
  noStroke();
  rect(x, y, 30, 18, 4);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(11);
  text(txt, x, y);
  pop();
}