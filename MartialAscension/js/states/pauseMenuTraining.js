let pauseMenuTrainingState = "MAIN"; 
let pauseMenuTrainingSelection = 0; 
let pauseTrainingConfirmSelection = 0; 
let selectedTrainingComboIndex = 0;
let pendingTrainingAction = ""; 

const PAUSE_MENU_TRAINING_OPTIONS = [
  "RESUME",
  "RESTART",
  "CHARACTER SELECT",
  "COMBO LIST", 
  "MAIN MENU"
];

const CONFIRM_TRAINING_OPTIONS = ["YES", "NO"];

function drawPauseMenuTraining() {
  // Semi-transparent black overlay
  push();
  fill(0, 200);
  noStroke();
  rectMode(CORNER);
  rect(0, 0, width, height);
  pop();
  
  // Draw based on current state
  if (pauseMenuTrainingState === "MAIN") {
    drawPauseTrainingMainMenu();
  } else if (pauseMenuTrainingState === "CONFIRM") {
    drawPauseTrainingMainMenu(); 
    drawPauseTrainingConfirmPrompt();
  } else if (pauseMenuTrainingState === "COMBO_LIST_VIEW") {
    drawPauseTrainingMainMenu();
    drawTrainingComboListView();
  }
}

function drawPauseTrainingMainMenu() {
  push();
  
  let menuX = width * 0.25;
  let menuY = height * 0.30;
  let optionSpacing = height * 0.10;
  
  // Dim if in confirm state
  let dimAlpha = (pauseMenuTrainingState !== "MAIN") ? 100 : 255;
  
  // Title
  textAlign(CENTER, CENTER);
  push();
  fill(255, dimAlpha);
  stroke(255, 0, 0, dimAlpha);
  strokeWeight(6);
  textFont(metalFont);
  textSize(width * 0.05);
  text("PAUSED", menuX, height * 0.15);
  pop();
  
  // Draw menu options
  for (let i = 0; i < PAUSE_MENU_TRAINING_OPTIONS.length; i++) {
    let y = menuY + (i * optionSpacing);
    let isSelected = (i === pauseMenuTrainingSelection && pauseMenuTrainingState === "MAIN");
    
    textAlign(CENTER, CENTER);
    textFont(metalFont);
    
    if (isSelected) {
      // Selected option - white with red stroke
      fill(255, dimAlpha);
      stroke(255, 0, 0, dimAlpha);
      strokeWeight(4);
      textSize(width * 0.028);
      text(PAUSE_MENU_TRAINING_OPTIONS[i], menuX, y);
    } else {
      // Unselected options - white
      fill(255, dimAlpha);
      noStroke();
      textSize(width * 0.022);
      text(PAUSE_MENU_TRAINING_OPTIONS[i], menuX, y);
    }
  }
  
  // Controls hint at bottom
  textAlign(CENTER, TOP);
  textFont(metalFont);
  fill(255, dimAlpha);
  noStroke();
  textSize(width * 0.012);
  text("W/S OR ARROWS TO NAVIGATE", menuX, height * 0.82);
  text("SPACE OR ENTER TO CONFIRM", menuX, height * 0.87);
  text("ESC TO RESUME", menuX, height * 0.92);
  
  pop();
}

function drawPauseTrainingConfirmPrompt() {
  push();
  
  let promptX = width * 0.65;
  let promptY = height * 0.40;
  let optionSpacing = height * 0.12;
  
  // Background box
  fill(20, 240);
  stroke(255, 0, 0);
  strokeWeight(4);
  rectMode(CENTER);
  rect(promptX, height * 0.50, width * 0.35, height * 0.35, 10);
  
  // Confirmation text
  textAlign(CENTER, CENTER);
  textFont(metalFont);
  fill(255);
  noStroke();
  textSize(width * 0.025);
  text("ARE YOU SURE?", promptX, promptY);
  
  // Draw Yes/No options
  for (let i = 0; i < CONFIRM_TRAINING_OPTIONS.length; i++) {
    let y = promptY + optionSpacing + (i * optionSpacing * 0.8);
    let isSelected = (i === pauseTrainingConfirmSelection);
    
    textAlign(CENTER, CENTER);
    textFont(metalFont);
    
    if (isSelected) {
      // Selected
      fill(255);
      stroke(255, 0, 0);
      strokeWeight(4);
      textSize(width * 0.030);
      text(CONFIRM_TRAINING_OPTIONS[i], promptX, y);
    } else {
      // Unselected
      fill(255);
      noStroke();
      textSize(width * 0.022);
      text(CONFIRM_TRAINING_OPTIONS[i], promptX, y);
    }
  }
  
  pop();
}

function drawTrainingComboListView() {
  push();
  
  let listX = width * 0.38;
  let listY = height * 0.05;
  let listW = width * 0.60;
  let listH = height * 0.90;
  
  let contentPaddingX = width * 0.02;
  let contentPaddingY = height * 0.03;
  
  let controlTextSize = width * 0.014;
  let controlLineSpacing = height * 0.035;
  let controlAfterSpacing = height * 0.05;
  
  let comboLineHeight = height * 0.038;
  let comboSelectedSize = width * 0.015;
  let comboUnselectedSize = width * 0.013;
  let comboStrokeWeight = 2;
  
  let detailsNameSize = width * 0.016;
  let detailsSectionSize = width * 0.013;
  let detailsTextSize = width * 0.015;
  let detailsDescSize = width * 0.015;
  let detailsLineSpacing = height * 0.03;
  let detailsSectionGap = height * 0.03;
  let detailsIndent = width * 0.015;
  let separatorPadding = height * 0.02;
  
  let hintTextSize = width * 0.012;
  let hintBottomPadding = height * 0.01;
    
  // Background box
  fill(20, 240);
  stroke(255, 0, 0);
  strokeWeight(4);
  rectMode(CORNER);
  rect(listX, listY, listW, listH, 10);
  
  // Get selected character data 
  let selectedCharName = FIGHTERS[selectedTrainingChar].name;
  
  // Build combo list
  let comboList = buildComboList(selectedCharName);
  
  // Calculate content area
  let contentX = listX + contentPaddingX;
  let contentY = listY + contentPaddingY;
  let contentW = listW - (contentPaddingX * 2);
  
  textAlign(LEFT, TOP);
  
  fill(255);
  noStroke();
  textFont(metalFont);
  textSize(controlTextSize);
  
  // Always show P1 controls in training
  text("UP=Jump  DW=Crouch  FW=Forward  BW=Backward", contentX, contentY);
  contentY += controlLineSpacing;
  text("LP(Y)=Light Punch  HP(U)=Heavy Punch  LK(H)=Light Kick  HK(J)=Heavy Kick", contentX, contentY);
  
  contentY += controlAfterSpacing;
  let comboStartY = contentY;
  let lastComboY = comboStartY;
  
  for (let i = 0; i < comboList.length; i++) {
    let combo = comboList[i];
    let y = comboStartY + (i * comboLineHeight);
    let isSelected = (i === selectedTrainingComboIndex);
    
    textFont(metalFont);
    
    if (isSelected) {
      fill(255);
      stroke(255, 0, 0);
      strokeWeight(comboStrokeWeight);
      textSize(comboSelectedSize);
    } else {
      fill(255);
      noStroke();
      textSize(comboUnselectedSize);
    }
    
    text(combo.name, contentX, y);
    lastComboY = y;
  }
  
  let separatorY = lastComboY + comboLineHeight + separatorPadding;
  
  stroke(255, 0, 0);
  strokeWeight(2);
  line(listX + contentPaddingX, separatorY, 
       listX + listW - contentPaddingX, separatorY);
  
  let detailsY = separatorY + separatorPadding;
  let selectedCombo = comboList[selectedTrainingComboIndex] || comboList[0];
  
  // Combo name
  fill(255);
  noStroke();
  textFont(metalFont);
  textSize(detailsNameSize);
  text(selectedCombo.name, contentX, detailsY);
  detailsY += detailsSectionGap;
  
  // Sequence section
  fill(255, 200, 0);
  noStroke();
  textSize(detailsSectionSize);
  text("Sequence:", contentX, detailsY);
  detailsY += (controlLineSpacing + height * 0.002);
  
  fill(255);
  noStroke();
  textSize(detailsTextSize);
  text(selectedCombo.sequence, contentX + detailsIndent, detailsY);
  detailsY += detailsSectionGap;
  
  // Description section
  fill(255, 200, 0);
  noStroke();
  textSize(detailsSectionSize);
  text("Description:", contentX, detailsY);
  detailsY += (controlLineSpacing + height * 0.002);
  
  // Description text (word-wrapped)
  fill(255);
  noStroke();
  textSize(detailsDescSize);
  textFont(metalFont);
  
  let descText = selectedCombo.description;
  let maxWidth = contentW - detailsIndent - (contentPaddingX * 2);
  let currentLine = '';
  let words = descText.split(' ');
  
  for (let i = 0; i < words.length; i++) {
    let testLine = currentLine + words[i] + ' ';
    let estimatedWidth = testLine.length * (width * 0.0055);
    
    if (estimatedWidth > maxWidth && currentLine.length > 0) {
      text(currentLine.trim(), contentX + detailsIndent, detailsY);
      detailsY += detailsLineSpacing;
      currentLine = words[i] + ' ';
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine.trim().length > 0) {
    text(currentLine.trim(), contentX + detailsIndent, detailsY);
  }
  
  fill(255);
  noStroke();
  textAlign(CENTER, BOTTOM);
  textSize(hintTextSize);
  text("W/S OR ARROWS TO SCROLL • ESC TO GO BACK", 
       listX + listW / 2, 
       listY + listH - hintBottomPadding);
  
  pop();
}

function handlePauseMenuTrainingInput(key, keyCode) {
  if (pauseMenuTrainingState === "MAIN") {
    handleTrainingMainMenuInput(key, keyCode);
  } else if (pauseMenuTrainingState === "CONFIRM") {
    handleTrainingConfirmInput(key, keyCode);
  } else if (pauseMenuTrainingState === "COMBO_LIST_VIEW") {
    handleTrainingComboListViewInput(key, keyCode);
  }
}

function handleTrainingMainMenuInput(key, keyCode) {
  // Navigation
  if (key === 'w' || key === 'W' || keyCode === UP_ARROW) {
    pauseMenuTrainingSelection--;
    if (pauseMenuTrainingSelection < 0) pauseMenuTrainingSelection = PAUSE_MENU_TRAINING_OPTIONS.length - 1;
    // Navigation feedback while moving through pause options.
    soundSystem.playSfx("uiSelect");
  }
  
  if (key === 's' || key === 'S' || keyCode === DOWN_ARROW) {
    pauseMenuTrainingSelection++;
    if (pauseMenuTrainingSelection >= PAUSE_MENU_TRAINING_OPTIONS.length) pauseMenuTrainingSelection = 0;
    // Navigation feedback while moving through pause options.
    soundSystem.playSfx("uiSelect");
  }
  
  // Confirm selection
  if (key === ' ' || keyCode === ENTER) {
    // Confirm feedback for pause menu actions.
    soundSystem.playSfx("uiSelect");
    let selectedOption = PAUSE_MENU_TRAINING_OPTIONS[pauseMenuTrainingSelection];
    
    if (selectedOption === "RESUME") {
      // Resume immediately - no confirmation
      currentState = GAME_STATE.TRAINING;
      pauseMenuTrainingState = "MAIN";
      pauseMenuTrainingSelection = 0;
    } else if (selectedOption === "COMBO LIST") {
      // Show combo list
      pauseMenuTrainingState = "COMBO_LIST_VIEW";
      selectedTrainingComboIndex = 0;
    } else {
      // Other options need confirmation
      pendingTrainingAction = selectedOption;
      pauseMenuTrainingState = "CONFIRM";
      pauseTrainingConfirmSelection = 0;
    }
  }
  
  // ESC to resume
  if (keyCode === ESCAPE) {
    // Resume feedback when closing pause menu.
    soundSystem.playSfx("uiSelect");
    currentState = GAME_STATE.TRAINING;
    pauseMenuTrainingState = "MAIN";
    pauseMenuTrainingSelection = 0;
  }
}

function handleTrainingConfirmInput(key, keyCode) {
  // Navigation
  if (key === 'w' || key === 'W' || keyCode === UP_ARROW) {
    pauseTrainingConfirmSelection--;
    if (pauseTrainingConfirmSelection < 0) pauseTrainingConfirmSelection = CONFIRM_TRAINING_OPTIONS.length - 1;
    // Navigation feedback inside confirmation prompt.
    soundSystem.playSfx("uiSelect");
  }
  
  if (key === 's' || key === 'S' || keyCode === DOWN_ARROW) {
    pauseTrainingConfirmSelection++;
    if (pauseTrainingConfirmSelection >= CONFIRM_TRAINING_OPTIONS.length) pauseTrainingConfirmSelection = 0;
    // Navigation feedback inside confirmation prompt.
    soundSystem.playSfx("uiSelect");
  }
  
  // Confirm selection
  if (key === ' ' || keyCode === ENTER) {
    // Confirm feedback for YES/NO choice.
    soundSystem.playSfx("uiSelect");
    if (pauseTrainingConfirmSelection === 0) { // YES
      executePauseTrainingAction(pendingTrainingAction);
    } else { // NO
      pauseMenuTrainingState = "MAIN";
      pauseTrainingConfirmSelection = 0;
    }
  }
  
  // ESC to cancel
  if (keyCode === ESCAPE) {
    // Cancel feedback when leaving confirmation prompt.
    soundSystem.playSfx("uiSelect");
    pauseMenuTrainingState = "MAIN";
    pauseTrainingConfirmSelection = 0;
  }
}

function handleTrainingComboListViewInput(key, keyCode) {
  // Get combo list
  let selectedCharName = FIGHTERS[selectedTrainingChar].name;
  let comboList = buildComboList(selectedCharName);
  
  // Navigate combo list
  if (key === 'w' || key === 'W' || keyCode === UP_ARROW) {
    selectedTrainingComboIndex--;
    if (selectedTrainingComboIndex < 0) selectedTrainingComboIndex = comboList.length - 1;
    // Navigation feedback while scrolling combo entries.
    soundSystem.playSfx("uiSelect");
  }
  
  if (key === 's' || key === 'S' || keyCode === DOWN_ARROW) {
    selectedTrainingComboIndex++;
    if (selectedTrainingComboIndex >= comboList.length) selectedTrainingComboIndex = 0;
    // Navigation feedback while scrolling combo entries.
    soundSystem.playSfx("uiSelect");
  }
  
  // ESC or Backspace to go back
  if (keyCode === ESCAPE || keyCode === BACKSPACE) {
    // Back feedback when leaving combo list.
    soundSystem.playSfx("uiSelect");
    pauseMenuTrainingState = "MAIN";
    selectedTrainingComboIndex = 0;
  }
}

function executePauseTrainingAction(action) {
  switch (action) {
    case "RESTART":
      currentState = GAME_STATE.LOADING_MATCH_TRAINING;
      resetPauseMenuTraining();
      break;
      
    case "CHARACTER SELECT":
      selectedTrainingChar = 0;
      currentState = GAME_STATE.CHARACTER_SELECT_TRAINING;
      resetPauseMenuTraining();
      break;
      
    case "MAIN MENU":
      selectedTrainingChar = 0;
      currentState = GAME_STATE.MENU;
      resetPauseMenuTraining();
      break;
  }
}

function resetPauseMenuTraining() {
  pauseMenuTrainingState = "MAIN";
  pauseMenuTrainingSelection = 0;
  pauseTrainingConfirmSelection = 0;
  selectedTrainingComboIndex = 0;
  pendingTrainingAction = "";
}