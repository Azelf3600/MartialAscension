function drawStageSelectMulti() {
  // 1. Draw the Background
  let currentStage = STAGES[selectedStage];
  
  push();
  if (currentStage.img) {
    // Fill the whole screen with the hovered stage image
    tint(150); // Dim it slightly so UI stands out
    image(currentStage.img, 0, 0, width, height);
  } else {
    background(30);
  }
  pop();

  // 2. Title
  drawTitle("SELECT ARENA", width / 2, height * 0.15, width * 0.05);

  // 3. Stage Selection Bar
  let barWidth = width * 0.8;
  let thumbW = width * 0.2;
  let thumbH = height * 0.15;
  let spacing = 20;
  
  let totalW = (STAGES.length * thumbW) + ((STAGES.length - 1) * spacing);
  let startX = (width - totalW) / 2;
  let startY = height * 0.7;

  STAGES.forEach((stage, index) => {
    let x = startX + index * (thumbW + spacing);
    let y = startY;

    let isHovered = (mouseX > x && mouseX < x + thumbW && mouseY > y && mouseY < y + thumbH);
    
    // Update selection on hover
    if (isHovered) {
      selectedStage = index;
    }

    push();
    // Highlight effect
    if (index === selectedStage) {
      stroke(255, 215, 0); // Gold border
      strokeWeight(5);
    } else {
      stroke(255, 50);
      strokeWeight(2);
    }

    // Draw Thumbnail
    rect(x, y, thumbW, thumbH, 5);
    if (stage.img) {
      image(stage.img, x + 5, y + 5, thumbW - 10, thumbH - 10);
    }
    
    // Stage Name Label
    if (index === selectedStage) {
      noStroke();
      fill(255);
      textAlign(CENTER);
      textFont(metalFont);
      textSize(width * 0.02);
      text(stage.name.toUpperCase(), x + thumbW / 2, y - 40);
    }
    pop();
  });

  // 4. Confirmation Prompt
  drawText("CLICK TO THE MATCH", width / 2, height * 0.92, width * 0.015);
  
  drawBackButton();
}