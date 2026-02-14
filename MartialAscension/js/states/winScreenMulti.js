// Win Screen State
let winScreenSelection = 0; // 0 = Rematch, 1 = Character Select, 2 = Main Menu
const WIN_SCREEN_OPTIONS = ["REMATCH", "CHARACTER SELECT", "MAIN MENU"];

function drawWinScreenMulti() {
  // Full black background (responsive)
  push();
  rectMode(CORNER);
  fill(0);
  noStroke();
  rect(0, 0, width, height);
  pop();
  
  // Left Side - Menu Options
  drawWinScreenMenu();
  
  // Right Side - Winner Display
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
      // Unselected options - NOW WHITE (was gray)
      fill(255); // Changed from 200 to 255
      noStroke();
      textSize(width * 0.022);
      text(WIN_SCREEN_OPTIONS[i], menuX, y);
    }
  }
  
  // Controls hint at bottom - NOW WHITE (was gray)
  textAlign(CENTER, TOP);
  textFont(metalFont);
  fill(255); // Changed from 150 to 255
  noStroke();
  textSize(width * 0.012);
  text("W/S OR ARROWS TO NAVIGATE", menuX, height * 0.80);
  text("SPACE OR ENTER TO CONFIRM", menuX, height * 0.85);
  
  pop();
}

function drawWinnerDisplay() {
  push();
  
  // POSITIONING VARIABLES (customize these)
  let displayX = width * 0.75;      // Horizontal center for text
  let nameY = height * 0.75;        // Name position (top)
  let winsY = height * 0.85;        // "WINS!" position
  let imageX = width * 0.75;        // Image horizontal position
  
  // Get winner data
  let winnerIndex = (winnerName === player1.name) ? p1Selected : p2Selected;
  let winnerData = FIGHTERS[winnerIndex];
  let isP1 = (winnerName === player1.name);
  
  // Winner preview image (LARGE - same size as loading screen)
  if (winnerData.previewImg) {
    push();
    imageMode(CENTER);
    let imgH = floor(height * 1.0); // Full height
    let imgW = floor((winnerData.previewImg.width / winnerData.previewImg.height) * imgH);
    
    // Position image (customize imageX above to move left/right)
    let imgXPos = floor(width - (imgW * 0.10) - (width * 0.2));
    
    // Glow effect
    drawingContext.shadowBlur = 40;
    drawingContext.shadowColor = isP1 ? 
      'rgba(0, 150, 255, 0.8)' : 'rgba(255, 50, 50, 0.8)';
    
    translate(imgXPos, height / 2);
    scale(-1, 1); // FLIP the image (mirror)
    image(winnerData.previewImg, 0, 0, imgW, imgH);
    pop();
  }
  
  // Winner name - using drawTitle style (white with red stroke)
  textAlign(CENTER, CENTER);
  drawTitle(winnerName.toUpperCase(), displayX, nameY, width * 0.045);
  
  // "WINS!" text - using drawTitle style (same as name)
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
    case 0: // Rematch
      // Reset round system and restart match
      currentRound = 1;
      p1RoundsWon = 0;
      p2RoundsWon = 0;
      gameOver = false;
      currentState = GAME_STATE.LOADING_MATCH_MULTI;
      winScreenSelection = 0; // Reset selection
      break;
      
    case 1: // Character Select
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
      winScreenSelection = 0; // Reset selection
      break;
      
    case 2: // Main Menu
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
      winScreenSelection = 0; // Reset selection
      break;
  }
}