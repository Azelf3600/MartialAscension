let loadingTimer = 0;
const LOADING_DURATION = 300; 

function drawLoadingMatchMulti() {
  background(0); 
  loadingTimer++;

  if (loadingTimer >= LOADING_DURATION) {
    loadingTimer = 0; 
    currentState = GAME_STATE.MATCH_MULTI;
    return;
  }

  if (loadingTimer < 40) return;

  let animProgress = constrain((loadingTimer - 40) / 60, 0, 1);
  let slideOffset = lerp(width, 0, animProgress);

  let p1Data = FIGHTERS[p1Selected];
  let p2Data = FIGHTERS[p2Selected];

  // Draw Players
  drawLoadingSide(-slideOffset, p1Data, 1);
  drawLoadingSide(slideOffset, p2Data, 2);

  // VS Title - Drawn last to stay on top
  push();
  textAlign(CENTER, CENTER);
  drawTitle("VS", width / 2, height / 2, width * 0.1);
  pop();
}

function drawLoadingSide(slideX, data, playerNum) {
  let isP1 = (playerNum === 1);
  
  // 1. PUSH TEXT BACK: Change 0.32 back toward 0.20
  // Try 0.22 for P1 and 0.78 for P2
  let textAnchorX = isP1 ? (width * 0.22) + slideX : (width * 0.78) + slideX;

  if (data.previewImg) {
    push();
    imageMode(CENTER);
    let imgH = floor(height * 1.0); 
    let imgW = floor((data.previewImg.width / data.previewImg.height) * imgH);

    // 2. PUSH IMAGE BACK: Change (width * 0.15) to (width * 0.05)
    // This moves them closer to the screen edges.
    let imgX = isP1 ? 
        floor((imgW * 0.10) + (width * 0.1) + slideX) : 
        floor(width - (imgW * 0.10) - (width * 0.1) + slideX);

    translate(imgX, height / 2);
    if (!isP1) scale(-1, 1);
    image(data.previewImg, 0, 0, imgW, imgH);
    pop();
  }

  // 2. Text Stack - MATCHED SPACING from characterSelectMulti
  let textBaseY = height * 0.75; 
  textAlign(CENTER, CENTER);

  // Name
  drawTitle(data.name.toUpperCase(), textAnchorX, textBaseY, width * 0.040);
  
  // Nickname (Match: + height * 0.09)
  drawTitle(data.nickname.toUpperCase(), textAnchorX, textBaseY + height * 0.09, width * 0.020);
  
  // Sect/Archetype (Match: + height * 0.15)
  let infoText = (data.sect || data.archetype || "").toUpperCase();
  drawTitle(infoText, textAnchorX, textBaseY + height * 0.15, width * 0.018);
}