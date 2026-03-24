let loadingTimerSingle = 0;
const LOADING_DURATION_SINGLE = 300;
let loadingInitializedSingle = false;
let loadingGongPlayedSingle = false;

function drawLoadingMatch() {
  background(0);
  
  if (!loadingInitializedSingle) {
    loadingTimerSingle = 0;
    loadingInitializedSingle = true;
    // Gong plays once when the single-player character showcase appears.
    if (!loadingGongPlayedSingle) {
      soundSystem.playSfx("startMatchGong");
      loadingGongPlayedSingle = true;
    }
  }
  
  loadingTimerSingle++;

  if (loadingTimerSingle >= LOADING_DURATION_SINGLE) {
    loadingTimerSingle = 0;
    loadingInitializedSingle = false;
    loadingGongPlayedSingle = false;
    
    console.log("⏰ Loading complete! Calling initMatchSingle()...");
    
    // Call initMatchSingle 
    if (typeof initMatchSingle === 'function') {
      initMatchSingle();
      console.log("✅ initMatchSingle() called successfully");
    } else {
      console.error("❌ initMatchSingle() function not found!");
    }

    currentState = GAME_STATE.MATCH;
    return;
  }

  if (loadingTimerSingle < 40) return;

  let animProgress = constrain((loadingTimerSingle - 40) / 60, 0, 1);
  let slideOffset = lerp(width, 0, animProgress);

  let playerData = FIGHTERS[campaignPlayerChar];
  let opponentIndex = campaignOpponents[campaignProgress];
  let opponentData = FIGHTERS[opponentIndex];

  drawLoadingSingleSide(-slideOffset, playerData, 1);
  drawLoadingSingleSide(slideOffset, opponentData, 2);

  push();
  textAlign(CENTER, CENTER);
  drawTitle("VS", width / 2, height / 2, width * 0.08);
  pop();
}

function drawLoadingSingleSide(slideX, data, playerNum) {
  let isP1 = (playerNum === 1);
  let textAnchorX = isP1 ? (width * 0.22) + slideX : (width * 0.78) + slideX;

  if (data.previewImg) {
    push();
    imageMode(CENTER);
    let imgH = floor(height * 1.0); 
    let imgW = floor((data.previewImg.width / data.previewImg.height) * imgH);

    let imgX = isP1 ? 
        floor((imgW * 0.10) + (width * 0.1) + slideX) : 
        floor(width - (imgW * 0.10) - (width * 0.1) + slideX);

    translate(imgX, height / 2);
    if (!isP1) scale(-1, 1);
    image(data.previewImg, 0, 0, imgW, imgH);
    pop();
  }

  let textBaseY = height * 0.75; 
  textAlign(CENTER, CENTER);

  drawTitle(data.name.toUpperCase(), textAnchorX, textBaseY, width * 0.040);
  drawTitle(data.nickname.toUpperCase(), textAnchorX, textBaseY + height * 0.09, width * 0.020);
  
  let infoText = (data.sect || data.archetype || "").toUpperCase();
  drawTitle(infoText, textAnchorX, textBaseY + height * 0.15, width * 0.018);
}