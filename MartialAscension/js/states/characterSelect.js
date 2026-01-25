let selectedChar = 0; 

function drawCharacterSelect() {
  background(20);
  
  let centerX = width / 2;
  let centerY = height / 2;
  
  drawText("Select Your Fighter", centerX, height * 0.15, width * 0.05);

  // 1. Dynamic Grid Logic (Same as Multiplayer)
  let totalFighters = FIGHTERS.length;
  let cols = totalFighters > 4 ? Math.ceil(Math.sqrt(totalFighters)) : totalFighters;
  let rows = Math.ceil(totalFighters / cols);

  // 2. Adjust card sizing based on grid density
  let spacing = width * 0.02;
  let boxW = width * (cols > 4 ? 0.12 : 0.15); // Shrink cards slightly if there are many
  let boxH = height * (rows > 2 ? 0.3 : 0.4); 
  
  let totalGridW = (cols * boxW) + ((cols - 1) * spacing);
  let totalGridH = (rows * boxH) + ((rows - 1) * spacing);
  
  let startX = (width - totalGridW) / 2;
  let startY = (height - totalGridH) / 2 + (height * 0.05); // Offset down for title

  FIGHTERS.forEach((fighter, index) => {
    // 3. Calculate position based on dynamic columns
    let col = index % cols;
    let row = Math.floor(index / cols);
    
    let x = startX + col * (boxW + spacing);
    let y = startY + row * (boxH + spacing);

    let isHovered = (mouseX > x && mouseX < x + boxW && mouseY > y && mouseY < y + boxH);
    
    push();
    if (isHovered) {
      stroke(255); 
      strokeWeight(4);
      fill(60);
      cursor(HAND);
    } else {
      stroke(100);
      strokeWeight(2);
      fill(40);
    }
    
    rect(x, y, boxW, boxH, 10); 

    // Aspect Ratio Image Logic
    if (fighter.img) {
      let availW = boxW - 20;
      let availH = boxH - 60;
      let imgRatio = fighter.img.width / fighter.img.height;
      let boxRatio = availW / availH;
      let drawW, drawH;

      if (imgRatio > boxRatio) {
        drawW = availW;
        drawH = availW / imgRatio;
      } else {
        drawH = availH;
        drawW = availH * imgRatio;
      }

      let xOffset = (availW - drawW) / 2;
      let yOffset = (availH - drawH) / 2;
      image(fighter.img, x + 10 + xOffset, y + 10 + yOffset, drawW, drawH);
    }

    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(width * 0.012); // Slightly smaller text for dynamic grids
    text(fighter.name.toUpperCase(), x + boxW / 2, y + boxH - 25);
    pop();
  });

  drawBackButton();
}

function drawBackButton() {
  //button position and size
  let btnW = width * 0.1;
  let btnH = height * 0.05;
  let backBtn = { 
    x: width * 0.1, 
    y: height * 0.1, 
    w: btnW, 
    h: btnH 
  };

  push();
  textAlign(CENTER, CENTER);
  
  // Visual feedback for hover
  if (isHovering(backBtn)) {
    fill(255, 0, 0); // Turns red when you hover
    cursor(HAND);    // Changes cursor to a pointer
  } else {
    fill(200);
    cursor(ARROW);
  }

  // Draw the text
  drawText("< BACK", backBtn.x, backBtn.y, width * 0.015);
  pop();

  // Handle the click
  if (mouseIsPressed && isHovering(backBtn)) {
    currentState = GAME_STATE.MENU;
  }
}