let winScreenSelection = 0; 
const WIN_SCREEN_OPTIONS = ["REMATCH", "CHARACTER SELECT", "MAIN MENU"];

function drawWinScreenMulti() {
  push();
  rectMode(CORNER);
  fill(0);
  noStroke();
  rect(0, 0, width, height);
  pop();
  
  drawWinScreenMenu();
  drawWinnerDisplay();
}

function drawWinScreenMenu() {
  push();
  
  let menuX = width * 0.25;
  let menuY = height * 0.35;
  let optionSpacing = height * 0.12;
  
  // Title - Using drawTitle (white with red stroke)
  textAlign(CENTER, CENTER);
  drawTitle("GAME OVER", menuX, height * 0.20, width * 0.04);
  
  // Draw menu options
  for (let i = 0; i < WIN_SCREEN_OPTIONS.length; i++) {
    let y = menuY + (i * optionSpacing);
    let isSelected = (i === winScreenSelection);
    
    textAlign(CENTER, CENTER);
    textFont(metalFont);
    
    // Selected option uses drawTitle style (white with red stroke)
    if (isSelected) {
      drawTitle(WIN_SCREEN_OPTIONS[i], menuX, y, width * 0.030);
      
      // Selection arrows
      fill(255);
      stroke(255, 0, 0);
      strokeWeight(4);
      textSize(width * 0.025);
    } else {
      // Unselected options 
      fill(255); 
      noStroke();
      textSize(width * 0.022);
      text(WIN_SCREEN_OPTIONS[i], menuX, y);
    }
  }
  
  // Controls hint at bottom
  textAlign(CENTER, TOP);
  textFont(metalFont);
  fill(255); 
  noStroke();
  textSize(width * 0.012);
  text("W/S OR ARROWS TO NAVIGATE", menuX, height * 0.80);
  text("SPACE OR ENTER TO CONFIRM", menuX, height * 0.85);
  
  pop();
}

function drawWinnerDisplay() {
  push();
  
  let displayX = width * 0.75;  
  let nameY = height * 0.75;      
  let winsY = height * 0.85;      
  let imageX = width * 0.75;   
  let winnerIndex = (winnerName === player1.name) ? p1Selected : p2Selected;
  let winnerData = FIGHTERS[winnerIndex];
  let isP1 = (winnerName === player1.name);
  
  // Winner preview image 
  if (winnerData.previewImg) {
    push();
    imageMode(CENTER);
    let imgH = floor(height * 1.0); 
    let imgW = floor((winnerData.previewImg.width / winnerData.previewImg.height) * imgH);
    
    // Position image 
    let imgXPos = floor(width - (imgW * 0.10) - (width * 0.2));
    
    // Glow effect
    drawingContext.shadowBlur = 40;
    drawingContext.shadowColor = isP1 ? 
      'rgba(0, 150, 255, 0.8)' : 'rgba(255, 50, 50, 0.8)';
    
    translate(imgXPos, height / 2);
    scale(-1, 1); 
    image(winnerData.previewImg, 0, 0, imgW, imgH);
    pop();
  }
  
  textAlign(CENTER, CENTER);
  drawTitle(winnerName.toUpperCase(), displayX, nameY, width * 0.045);
  drawTitle("WINS!", displayX, winsY, width * 0.035);
  
  pop();
}

function handleWinScreenInput(key, keyCode) {
  // Navigation
  if (key === 'w' || key === 'W' || keyCode === UP_ARROW) {
    winScreenSelection--;
    if (winScreenSelection < 0) winScreenSelection = WIN_SCREEN_OPTIONS.length - 1;
  }
  
  if (key === 's' || key === 'S' || keyCode === DOWN_ARROW) {
    winScreenSelection++;
    if (winScreenSelection >= WIN_SCREEN_OPTIONS.length) winScreenSelection = 0;
  }
  
  // Confirm selection
  if (key === ' ' || keyCode === ENTER) {
    executeWinScreenChoice();
  }
}

function executeWinScreenChoice() {
  switch (winScreenSelection) {
    case 0:
      // Reset round system and restart match
      currentRound = 1;
      p1RoundsWon = 0;
      p2RoundsWon = 0;
      gameOver = false;
      currentState = GAME_STATE.LOADING_MATCH_MULTI;
      winScreenSelection = 0; 
      break;
      
    case 1: 
      // Reset character selections and go to character select
      p1Selected = 0;
      p2Selected = 1;
      p1Ready = false;
      p2Ready = false;
      currentRound = 1;
      p1RoundsWon = 0;
      p2RoundsWon = 0;
      gameOver = false;
      currentState = GAME_STATE.CHARACTER_SELECT_MULTI;
      winScreenSelection = 0; 
      break;
      
    case 2: 
      // Reset everything and go to main menu
      p1Selected = 0;
      p2Selected = 1;
      p1Ready = false;
      p2Ready = false;
      currentRound = 1;
      p1RoundsWon = 0;
      p2RoundsWon = 0;
      gameOver = false;
      currentState = GAME_STATE.MENU;
      winScreenSelection = 0; 
      break;
  }
}