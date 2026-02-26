let selectedChar = 0; 

function drawCharacterSelect() {
  background(20);
  
  // Title - Centered at top
  push();
  textAlign(CENTER, CENTER);
  drawTitle("SELECT YOUR FIGHTER", width / 2, height * 0.10, width * 0.05);
  pop();

  // Grid Selection
  let totalFighters = FIGHTERS.length;
  let cols = 4;
  let rows = Math.ceil(totalFighters / cols);

  let spacing = width * 0.02;
  let boxW = width * 0.15;
  let boxH = height * 0.40;
  
  let totalGridW = (cols * boxW) + ((cols - 1) * spacing);
  let totalGridH = (rows * boxH) + ((rows - 1) * spacing);
  
  let startX = (width - totalGridW) / 2;
  let startY = (height - totalGridH) / 2 + height * 0.05;

  FIGHTERS.forEach((fighter, index) => {
    let col = index % cols;
    let row = Math.floor(index / cols);
    
    let x = startX + col * (boxW + spacing);
    let y = startY + row * (boxH + spacing);

    let isSelected = (index === selectedChar);
    
    push();
    rectMode(CORNER);
    
    if (isSelected) {
      // ✅ Selected character - RED border
      stroke(255, 0, 0);
      strokeWeight(5);
      fill(60);
    } else {
      stroke(100);
      strokeWeight(2);
      fill(40);
    }
    
    rect(x, y, boxW, boxH, 10); 

    // Image rendering
    if (fighter.thumbImg) {
      let availW = boxW - 20;
      let availH = boxH - 60;
      let imgRatio = fighter.thumbImg.width / fighter.thumbImg.height;
      let boxRatio = availW / availH;
      let drawW, drawH;

      if (imgRatio > boxRatio) {
        drawW = availW;
        drawH = availW / imgRatio;
      } else {
        drawH = availH;
        drawW = drawH * imgRatio;
      }

      let xOffset = (availW - drawW) / 2;
      let yOffset = (availH - drawH) / 2;

      imageMode(CORNER);
      image(fighter.thumbImg, x + 10 + xOffset, y + 10 + yOffset, drawW, drawH); 
    }

    // Name label
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textFont(metalFont);
    textSize(width * 0.012);
    text(fighter.name.toUpperCase(), x + boxW / 2, y + boxH - 25);
    pop();
  });

  // Show keyboard controls under selected character
  let selectedCol = selectedChar % cols;
  let selectedRow = Math.floor(selectedChar / cols);
  let selectedX = startX + selectedCol * (boxW + spacing) + boxW / 2;
  let selectedY = startY + selectedRow * (boxH + spacing) + boxH;
  
  push();
  textAlign(CENTER, CENTER);
  textFont(metalFont);
  textSize(width * 0.012);
  fill(255, 0, 0); // ✅ RED to match border
  text("A D", selectedX, selectedY + 20);
  pop();

  // Bottom instructions
  push();
  textAlign(CENTER, CENTER);
  textFont(metalFont);
  fill(255);
  textSize(width * 0.015);
  text("PRESS SPACE TO CONFIRM", width / 2, height * 0.92);
  pop();

  drawBackButton();
}

function drawBackButton() {
  let btnW = width * 0.1;
  let btnH = height * 0.05;
  let backBtn = { 
    x: width * 0.1,
    y: height * 0.05, 
    w: btnW, 
    h: btnH 
  };

  // ✅ Check hover state
  let isHovering = mouseX > backBtn.x - btnW/2 && mouseX < backBtn.x + btnW/2 && mouseY > backBtn.y - btnH/2 && mouseY < backBtn.y + btnH/2;

  push();
  textAlign(LEFT, CENTER);
  textFont(metalFont);
  
  // ✅ Red stroke when hovering
  if (isHovering) {
    stroke(255, 0, 0);
    strokeWeight(3);
  } else {
    noStroke();
  }
  
  fill(255); // Always white text
  textSize(width * 0.015);
  text("< BACK", backBtn.x, backBtn.y);
  pop();
}