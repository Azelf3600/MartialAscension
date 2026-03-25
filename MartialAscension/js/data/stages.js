const STAGES = [
  { name: "Black Forest", path: "Assets/stages/BlackForest.png", ingamePath: "Assets/stages/ingame/BlackForestIG.jpg", groundColor: [10, 25, 10] }, // Dark grassy
  { 
    name: "Immortal Ancient Battlefield", path: "Assets/stages/ImmortalAncientBattlefield.png", ingamePath: "Assets/stages/ingame/ImmortalAncientBattlefiedIG.jpg", groundColor: [45, 30, 20] // Brown rocky
  },
  { name: "Sword God Arena", path: "Assets/stages/SwordGodArena.png", ingamePath: "Assets/stages/ingame/SwordGodArenaIG.jpg", groundColor: [40, 50, 80] // Bluish stone
  }
];

let selectedStage = 0;

// Helper to draw background without stretching
function drawStageBackground(bgImg) {
  if (!bgImg) return;
  push();
  imageMode(CENTER);
  
  // Calculate proportional scale to cover screen without stretching (object-fit: cover)
  let scaleX = width / bgImg.width;
  let scaleY = height / bgImg.height;
  let scaleRatio = Math.max(scaleX, scaleY);
  
  // Apply a slight zoom out if the image got too pixelated (cap the scale slightly if needed)
  // We use the proportional scale to ensure it never stretches again.
  image(bgImg, width/2, height/2, bgImg.width * scaleRatio, bgImg.height * scaleRatio);
  pop();
}

// Centralized stage ground rendering function
function drawStageGround(stageMap, gY) {
  push();
  rectMode(CORNER);
  
  if (stageMap && stageMap.groundColor) {
    fill(stageMap.groundColor[0], stageMap.groundColor[1], stageMap.groundColor[2]);
  } else {
    fill(60);
  }
  noStroke();
  // Base ground
  rect(-10000, gY, 20000, 2000);

  // Add details based on the stage name
  if (!stageMap) {
    pop();
    return;
  }

  if (stageMap.name === "Black Forest") {
    // Draw dark grass blades and uneven dirt patches spread out
    for (let x = -9800; x < 9800; x += 550) {
      for (let y = gY + 30; y < gY + 2000; y += 220) {
        let offsetX = (Math.abs(x) * 17 + y * 23) % 400 - 200;
        let offsetY = (Math.abs(x) * 31 + y * 11) % 150;
        let pX = x + offsetX;
        let pY = y + offsetY;
        
        // Less detail on top
        if (pY < gY + 80 && (Math.abs(x) % 3 === 0)) continue; 

        // Dirt patches
        fill(15, 20, 10, 120);
        noStroke();
        ellipse(pX, pY, 150, 60);
        
        // Grass clumps
        stroke(10, 35, 10);
        strokeWeight(4);
        line(pX - 20, pY + 10, pX - 35, pY - 5);
        line(pX - 10, pY + 10, pX - 5, pY - 15);
        line(pX, pY + 10, pX + 15, pY);
      }
    }
  } 
  else if (stageMap.name === "Immortal Ancient Battlefield") {
    // Draw craters, blood stains, and rocky spikes spread out
    for (let x = -9800; x < 9800; x += 650) {
      for (let y = gY + 30; y < gY + 2000; y += 280) {
        let offsetX = (Math.abs(x) * 7 + y * 13) % 400 - 200;
        let offsetY = (Math.abs(x) * 19 + y * 29) % 200;
        let pX = x + offsetX;
        let pY = y + offsetY;
        
        // Less detail on top
        if (pY < gY + 100 && (Math.abs(x) % 2 === 0)) continue;

        // Craters / ancient burn marks
        fill(30, 15, 10, 140);
        noStroke();
        ellipse(pX, pY, 180, 50);
        
        // Sharp rocks / spikes piercing the ground
        fill(25, 20, 15);
        triangle(pX - 20, pY + 20, pX - 40, pY - 20, pX + 10, pY + 5);
      }
    }
  }
  else if (stageMap.name === "Sword God Arena") {
    // Elegant, simple bluish stone textures correctly spread across the ground
    for (let x = -9800; x < 9800; x += 500) {
      for (let y = gY + 30; y < gY + 2000; y += 220) {
        let offsetX = (Math.abs(x) * 11 + y * 17) % 350 - 175;
        let offsetY = (Math.abs(x) * 23 + y * 7) % 150;
        let pX = x + offsetX;
        let pY = y + offsetY;

        // Less detail on top
        if (pY < gY + 100 && (Math.abs(x) % 3 === 0)) continue;

        // Simple bluish flat stone shape 
        stroke(30, 40, 70, 150);
        strokeWeight(3);
        fill(45, 55, 85); // slightly lighter bluish stone piece
        beginShape();
        vertex(pX - 40, pY - 10);
        vertex(pX - 10, pY - 25);
        vertex(pX + 35, pY - 5);
        vertex(pX + 25, pY + 15);
        vertex(pX - 20, pY + 10);
        endShape(CLOSE);
        
        // Inner stone crack line
        stroke(25, 35, 60, 180);
        strokeWeight(2);
        line(pX - 20, pY, pX + 10, pY - 5);
      }
    }
  }

  pop();
}