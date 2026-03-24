let winScreenSingleSelection = 0;

function drawWinScreen() {
  push();
  rectMode(CORNER);
  fill(0);
  noStroke();
  rect(0, 0, width, height);
  pop();
  
  drawWinScreenSingleMenu();
  drawWinnerDisplaySingle();
}

function drawWinScreenSingleMenu() {
  push();
  
  let menuX = width * 0.25;
  let menuY = height * 0.35;
  let optionSpacing = height * 0.12; 
  let isVictory = (singleWinnerName === singlePlayer1.name);
  let isCampaignComplete = (campaignProgress >= 3);
  
  // Title - Show "CAMPAIGN COMPLETE!" if finished
  textAlign(CENTER, CENTER);
  
  if (isVictory && isCampaignComplete) {
    drawTitle("CAMPAIGN COMPLETE!", menuX, height * 0.20, width * 0.035);
  } else if (isVictory) {
    drawTitle("VICTORY!", menuX, height * 0.20, width * 0.04);
  } else {
    drawTitle("DEFEAT", menuX, height * 0.20, width * 0.04);
  }
  
  let availableOptions = ["RESTART", "CHARACTER SELECT", "MAIN MENU"];
  
  for (let i = 0; i < availableOptions.length; i++) {
    let y = menuY + (i * optionSpacing);
    let isSelected = (i === winScreenSingleSelection);
    
    textAlign(CENTER, CENTER);
    textFont(metalFont);
    
    if (isSelected) {
      drawTitle(availableOptions[i], menuX, y, width * 0.030);
    } else {
      fill(255);
      noStroke();
      textSize(width * 0.022);
      text(availableOptions[i], menuX, y);
    }
  }
  
  // Controls hint
  textAlign(CENTER, TOP);
  textFont(metalFont);
  fill(255);
  noStroke();
  textSize(width * 0.012);
  text("W/S OR ARROWS TO NAVIGATE", menuX, height * 0.80);
  text("SPACE OR ENTER TO CONFIRM", menuX, height * 0.85);
  
  pop();
}

function drawWinnerDisplaySingle() {
  push();
  
  let displayX = width * 0.75;
  let nameY = height * 0.75;
  let winsY = height * 0.85;
  
  let winnerIndex = (singleWinnerName === singlePlayer1.name) ? 
    campaignPlayerChar : 
    campaignOpponents[Math.min(campaignProgress, campaignOpponents.length - 1)];
  let winnerData = FIGHTERS[winnerIndex];
  let isPlayer = (singleWinnerName === singlePlayer1.name);
  
  if (winnerData.previewImg) {
    push();
    imageMode(CENTER);
    let imgH = floor(height * 1.0);
    let imgW = floor((winnerData.previewImg.width / winnerData.previewImg.height) * imgH);
    
    let imgXPos = floor(width - (imgW * 0.10) - (width * 0.2));
    
    drawingContext.shadowBlur = 40;
    drawingContext.shadowColor = isPlayer ? 
      'rgba(0, 150, 255, 0.8)' : 'rgba(255, 50, 50, 0.8)';
    
    translate(imgXPos, height / 2);
    scale(-1, 1);
    image(winnerData.previewImg, 0, 0, imgW, imgH);
    pop();
  }
  
  textAlign(CENTER, CENTER);
  drawTitle(singleWinnerName.toUpperCase(), displayX, nameY, width * 0.045);
  
  if (singleWinnerName === singlePlayer1.name) {
    drawTitle("WINS!", displayX, winsY, width * 0.035);
  } else {
    drawTitle("DEFEATS YOU!", displayX, winsY, width * 0.030);
  }
  
  pop();
}

function handleWinScreenSingleInput(key, keyCode) {
  // Always use same 3 options
  let availableOptions = ["RESTART", "CHARACTER SELECT", "MAIN MENU"];
  
  // Navigation
  if (key === 'w' || key === 'W' || keyCode === UP_ARROW) {
    winScreenSingleSelection--;
    if (winScreenSingleSelection < 0) winScreenSingleSelection = availableOptions.length - 1;
    soundSystem.playSfx("uiSelect");
  }
  
  if (key === 's' || key === 'S' || keyCode === DOWN_ARROW) {
    winScreenSingleSelection++;
    if (winScreenSingleSelection >= availableOptions.length) winScreenSingleSelection = 0;
    soundSystem.playSfx("uiSelect");
  }
  
  // Confirm selection
  if (key === ' ' || keyCode === ENTER) {
    soundSystem.playSfx("uiSelect");
    executeWinScreenSingleChoice();
  }
}

function executeWinScreenSingleChoice() {
  let availableOptions = ["RESTART", "CHARACTER SELECT", "MAIN MENU"];
  let selectedOption = availableOptions[winScreenSingleSelection];
  
  switch (selectedOption) {
    case "RESTART":
      // Restart from first opponent
      campaignProgress = 0;
      singleCurrentRound = 1;
      singlePlayer1RoundsWon = 0;
      singlePlayer2RoundsWon = 0;
      currentState = GAME_STATE.LORE_SCREEN;
      winScreenSingleSelection = 0;
      break;
      
    case "CHARACTER SELECT":
      // Go to character select
      campaignProgress = 0;
      campaignPlayerChar = 0;
      singleCurrentRound = 1;
      singlePlayer1RoundsWon = 0;
      singlePlayer2RoundsWon = 0;
      currentState = GAME_STATE.CHARACTER_SELECT;
      winScreenSingleSelection = 0;
      break;
      
    case "MAIN MENU":
      // Go to main menu
      campaignProgress = 0;
      campaignPlayerChar = 0;
      singleCurrentRound = 1;
      singlePlayer1RoundsWon = 0;
      singlePlayer2RoundsWon = 0;
      currentState = GAME_STATE.MENU;
      winScreenSingleSelection = 0;
      break;
  }
}