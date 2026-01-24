let selectedChar = 0; 

function drawCharacterSelect() {
  background(20);
  
  let centerX = width / 2;
  let centerY = height / 2;
  
  drawText("Select Your Fighter", centerX, height * 0.15, width * 0.05);

  let cols = 4;
  let spacing = width * 0.02;
  let boxW = width * 0.15;
  let boxH = height * 0.4;
  
  let totalGridW = (cols * boxW) + ((cols - 1) * spacing);
  let startX = (width - totalGridW) / 2;

  FIGHTERS.forEach((fighter, index) => {
    let x = startX + (index * (boxW + spacing));
    let y = centerY - boxH / 2;

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

    if (fighter.img) {
      image(fighter.img, x + 10, y + 10, boxW - 20, boxH - 60);
    } else {
      fill(fighter.color || 100);
      rect(x + 10, y + 10, boxW - 20, boxH - 60, 5);
    }

    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(width * 0.015);
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
    y: height * 0.9, 
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