let loadingTimer = 0;
// 1 second black + 4 seconds animation/display = 5 seconds total (300 frames)
const LOADING_DURATION = 300; 

function drawLoadingMatchMulti() {
  background(0); 
  loadingTimer++;

  if (loadingTimer >= LOADING_DURATION) {
  loadingTimer = 0; 
  currentState = GAME_STATE.MATCH_MULTI;
  }

  // 1. One second of pure blackness
  if (loadingTimer < 60) return;

  // 2. Calculate animation progress for the slide (over 1 second)
  let animProgress = constrain((loadingTimer - 60) / 60, 0, 1);
  let offset = floor(lerp(width, 0, animProgress));

  // Get selected fighter data
  let p1Data = FIGHTERS[p1Selected];
  let p2Data = FIGHTERS[p2Selected];

  // --- DRAW FIGHTERS ---
  push();
  // Slides P1 from left to center-left, P2 from right to center-right
  drawLoadingSide(0 - offset, p1Data, 1);
  drawLoadingSide(0 + offset, p2Data, 2);
  pop();

  // --- DRAW VS TEXT ---
  // Appears instantly after the black screen ends
  drawTitle("VS", width / 2, height / 2, width * 0.1);

  // 3. Transition to the match after 5 seconds (300 frames)
  if (loadingTimer >= LOADING_DURATION) {
    loadingTimer = 0; 
    currentState = GAME_STATE.MATCH_MULTI;
  }
}

function drawLoadingSide(slideX, data, playerNum) {
  let isP1 = (playerNum === 1);
  
  // Keep the text anchors where they are, or adjust if they feel too close to the edge
  let textAnchorX = floor(isP1 ? (width * 0.25) + slideX : (width * 0.75) + slideX);

  if (data.previewImg) {
    // 1. MAX SCALE: Set height to 100% of the window
    let imgH = height; 
    let imgW = (data.previewImg.width / data.previewImg.height) * imgH;
    
    let roundedX = floor(slideX);

    push();
    if (!isP1) {
      // 2. SNAP TO RIGHT EDGE: 
      // Translate to exactly width + slideX (no 0.05 padding)
      translate(floor(width + roundedX), 0); 
      scale(-1, 1);
      // Align image so the far edge is at 0
      image(data.previewImg, 0, 0, floor(imgW), floor(imgH));
    } else {
      // 3. SNAP TO LEFT EDGE:
      // Start at exactly slideX
      image(data.previewImg, roundedX, 0, floor(imgW), floor(imgH));
    }
    pop();
  }

  // 4. TEXT POSITIONS
  let nameY = floor(height * 0.77); 
  let nickY = floor(height * 0.85); 
  let sectY = floor(height * 0.90); 

  drawTitle(data.name.toUpperCase(), textAnchorX, nameY, width * 0.045);
  
  push();
  textAlign(CENTER, CENTER);
  textFont(metalFont);
  fill(255);
  stroke(255, 0, 0);
  strokeWeight(1);
  
  textSize(width * 0.022); 
  text(data.nickname.toUpperCase(), textAnchorX, nickY);
  
  textSize(width * 0.016);
  text(data.sect.toUpperCase(), textAnchorX, sectY);
  pop();
}