let loadingTimerTraining = 0;
const LOADING_DURATION_TRAINING = 300;
let loadingInitializedTraining = false;
let randomDummyIndex = -1; 

function drawLoadingMatchTraining() {
  background(0);
  
  // Reset timer on first frame
  if (!loadingInitializedTraining) {
    loadingTimerTraining = 0;
    loadingInitializedTraining = true;
    randomDummyIndex = floor(random(FIGHTERS.length));
  }
  
  loadingTimerTraining++;

  if (loadingTimerTraining >= LOADING_DURATION_TRAINING) {
    loadingTimerTraining = 0;
    loadingInitializedTraining = false;
    
    initTraining();
    
    currentState = GAME_STATE.TRAINING;
    return;
  }

  if (loadingTimerTraining < 40) return;

  let animProgress = constrain((loadingTimerTraining - 40) / 60, 0, 1);
  let slideOffset = lerp(width, 0, animProgress);

  // Player character (from selection)
  let playerData = FIGHTERS[selectedTrainingChar];
  
  // Random dummy character
  let dummyData = FIGHTERS[randomDummyIndex];

  // Draw Players
  drawLoadingTrainingSide(-slideOffset, playerData, 1, false); 
  drawLoadingTrainingSide(slideOffset, dummyData, 2, true);     

  // VS Title
  push();
  textAlign(CENTER, CENTER);
  drawTitle("TRAINING", width / 2, height / 2, width * 0.08);
  pop();
}

function drawLoadingTrainingSide(slideX, data, playerNum, isDummy) {
  let isP1 = (playerNum === 1);
  
  let textAnchorX = isP1 ? (width * 0.22) + slideX : (width * 0.78) + slideX;

  // Draw character preview image
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

  let displayName = isDummy ? 
    "DUMMY " + data.name.toUpperCase() : 
    data.name.toUpperCase();

  drawTitle(displayName, textAnchorX, textBaseY, width * 0.040);
  drawTitle(data.nickname.toUpperCase(), textAnchorX, textBaseY + height * 0.09, width * 0.020);
  
  let infoText = (data.sect || data.archetype || "").toUpperCase();
  drawTitle(infoText, textAnchorX, textBaseY + height * 0.15, width * 0.018);
}