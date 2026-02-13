function drawStageSelectMulti() {
  let currentStage = STAGES[selectedStage];
  
  // 1. Dynamic Background
  if (currentStage && currentStage.img) {
    push();
    imageMode(CENTER);
    tint(120); // Darken for UI legibility
    let scale = Math.max(width / currentStage.img.width, height / currentStage.img.height);
    image(currentStage.img, width/2, height/2, currentStage.img.width * scale, currentStage.img.height * scale);
    pop();
  } else {
    background(30);
  }

  // 2. Header (Centered)
  push();
  textAlign(CENTER, CENTER);
  drawTitle("SELECT YOUR STAGE", width / 2, height * 0.1, width * 0.05);
  pop();

  // 3. Stage Thumbnails
  let thumbW = width * 0.22;
  let thumbH = height * 0.16;
  let spacing = 30;
  let totalW = (STAGES.length * thumbW) + ((STAGES.length - 1) * spacing);
  let startX = (width - totalW) / 2;

  // Draw all thumbnails
  STAGES.forEach((stage, index) => {
    let x = startX + index * (thumbW + spacing) + thumbW / 2;
    let y = height * 0.78;

    // Draw Thumbnail Box
    push();
    rectMode(CENTER);
    stroke(index === selectedStage ? [255, 215, 0] : [255, 50]);
    strokeWeight(index === selectedStage ? 5 : 2);
    fill(20, 200);
    rect(x, y, thumbW, thumbH, 8);
    
    if (stage.img) {
      imageMode(CENTER);
      image(stage.img, x, y, thumbW - 12, thumbH - 12);
    }
    pop();
    
    // Show navigation hints on selected stage
    if (index === selectedStage) {
      push();
      textAlign(CENTER, CENTER);
      textFont(metalFont);
      textSize(width * 0.012);
      fill(255, 215, 0);
      text("A D", x, y + thumbH/2 + 25);
      pop();
    }
  });

  // Draw arena name
  if (STAGES[selectedStage]) {
    push();
    textAlign(CENTER, CENTER);
    drawTitle(STAGES[selectedStage].name.toUpperCase(), width/2, height * 0.63, width * 0.025);
    pop();
  }

  // Instructions
  push();
  textAlign(CENTER, CENTER);
  textFont(metalFont); // Using your metal font for consistency
  fill(255);
  textSize(width * 0.015);
  text("PRESS SPACE TO START MATCH", width / 2, height * 0.94);
  pop();

  // Back button
  if (typeof drawBackButton === "function") {
    drawBackButton();
  } else {
    // Fallback if drawBackButton isn't global
    push();
    textAlign(LEFT, TOP);
    textFont(metalFont);
    fill(255);
    textSize(width * 0.015);
    text("< BACK (Q)", width * 0.05, height * 0.05);
    pop();
  }
}