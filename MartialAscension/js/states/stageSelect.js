function drawStageSelect() {
//Responsive Background so the img is not stretched
  let currentStage = STAGES[selectedStage];
  
  if (currentStage && currentStage.img) {
    push();
    tint(150); //To dim it slightly
    
    //BG cover - to avoid img to stretch
    let scale = Math.max(width / currentStage.img.width, height / currentStage.img.height);
    
    let newW = currentStage.img.width * scale;
    let newH = currentStage.img.height * scale;
    
    let offX = (width - newW) / 2;
    let offY = (height - newH) / 2;
    
    image(currentStage.img, offX, offY, newW, newH);
    pop();
  } else {
    background(30);
  }

  drawTitle("SELECT ARENA", width / 2, height * 0.15, width * 0.05);

  //Selection Grid
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
    
    //Update to Hover
    if (isHovered) {
      selectedStage = index;
    }

    push();
    //Highlight effect when hovering to gold
    if (index === selectedStage) {
      stroke(255, 215, 0);
      strokeWeight(5);
    } else {
      stroke(255, 50);
      strokeWeight(2);
    }

    //Display Thumbnail Image - needs to fix still stretched
    rect(x, y, thumbW, thumbH, 5);
    if (stage.img) {
      image(stage.img, x + 5, y + 5, thumbW - 10, thumbH - 10);
    }
    
    //Stage Name Label
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

  //Confirmation Prompt
  drawText("CLICK TO START THE MATCH", width / 2, height * 0.92, width * 0.015);
  
  drawBackButton();
}