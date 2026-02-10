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
  drawTitle("SELECT ARENA", width / 2, height * 0.1, width * 0.05);
  pop();

  // 3. Stage Thumbnails
  let thumbW = width * 0.22;
  let thumbH = height * 0.16;
  let spacing = 30;
  let totalW = (STAGES.length * thumbW) + ((STAGES.length - 1) * spacing);
  let startX = (width - totalW) / 2;

  // 1. Draw all thumbnails first
STAGES.forEach((stage, index) => {
    let x = startX + index * (thumbW + spacing) + thumbW / 2;
    let y = height * 0.78;

    // Hover logic
    if (mouseX > x - thumbW/2 && mouseX < x + thumbW/2 && 
        mouseY > y - thumbH/2 && mouseY < y + thumbH/2) {
      selectedStage = index;
    }

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
});

// 2. DRAW ARENA NAME HERE (Outside the loop for perfect centering)
if (STAGES[selectedStage]) {
  push();
  textAlign(CENTER, CENTER);
  // ADJUST THESE TWO NUMBERS TO MOVE THE NAME:
  //             X-Pos      Y-Pos         Size
  drawTitle(STAGES[selectedStage].name.toUpperCase(), width/2, height * 0.63, width * 0.025);
  pop();
}

  // 4. Start Prompt (Matched Font)
  push();
  textAlign(CENTER, CENTER);
  textFont(metalFont); // Using your metal font for consistency
  fill(255);
  textSize(width * 0.015);
  text("CLICK ANYWHERE TO START MATCH", width / 2, height * 0.93);
  pop();

  // 5. Shared Back Button
  if (typeof drawBackButton === "function") {
    drawBackButton();
  } else {
    // Fallback if drawBackButton isn't global
    push();
    textAlign(LEFT, TOP);
    textFont(metalFont);
    fill(255);
    textSize(width * 0.015);
    text("< BACK", width * 0.05, height * 0.05);
    pop();
  }
}