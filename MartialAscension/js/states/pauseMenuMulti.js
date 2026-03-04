let pauseMenuStateMulti = "MAIN"; 
let pauseMenuSelectionMulti = 0; 
let pauseConfirmSelectionMulti = 0; 
let comboListSelectionMulti = 0;  
let selectedComboIndexMulti = 0; 
let pendingActionMulti = ""; 

const PAUSE_MENU_OPTIONS_MULTI = [
  "RESUME",
  "RESTART",
  "CHARACTER SELECT",
  "COMBO LIST",
  "MAIN MENU"
];

const CONFIRM_OPTIONS_MULTI = ["YES", "NO"];

function drawPauseMenuMulti() {
  // Semi-transparent black overlay
  push();
  fill(0, 200);
  noStroke();
  rectMode(CORNER);
  rect(0, 0, width, height);
  pop();
  
  // Draw based on current state
  if (pauseMenuStateMulti === "MAIN") {
    drawPauseMainMenuMulti();
  } else if (pauseMenuStateMulti === "CONFIRM") {
    drawPauseMainMenuMulti(); 
    drawPauseConfirmPromptMulti();
  } else if (pauseMenuStateMulti === "COMBO_LIST_SELECT") {
    drawPauseMainMenuMulti(); 
    drawComboListCharacterSelectMulti();
  } else if (pauseMenuStateMulti === "COMBO_LIST_VIEW") {
    drawPauseMainMenuMulti();
    drawComboListViewMulti();
  }
}

function drawPauseMainMenuMulti() {
  push();
  
  let menuX = width * 0.25;
  let menuY = height * 0.30;
  let optionSpacing = height * 0.10;
  let dimAlpha = (pauseMenuStateMulti !== "MAIN") ? 100 : 255;
  
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
  for (let i = 0; i < PAUSE_MENU_OPTIONS_MULTI.length; i++) {
    let y = menuY + (i * optionSpacing);
    let isSelected = (i === pauseMenuSelectionMulti && pauseMenuStateMulti === "MAIN");
    
    textAlign(CENTER, CENTER);
    textFont(metalFont);
    
    if (isSelected) {
      // Selected option - white with red stroke
      fill(255, dimAlpha);
      stroke(255, 0, 0, dimAlpha);
      strokeWeight(4);
      textSize(width * 0.028);
      text(PAUSE_MENU_OPTIONS_MULTI[i], menuX, y);
    } else {
      // Unselected options - white
      fill(255, dimAlpha);
      noStroke();
      textSize(width * 0.022);
      text(PAUSE_MENU_OPTIONS_MULTI[i], menuX, y);
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

function drawPauseConfirmPromptMulti() {
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
  for (let i = 0; i < CONFIRM_OPTIONS_MULTI.length; i++) {
    let y = promptY + optionSpacing + (i * optionSpacing * 0.8);
    let isSelected = (i === pauseConfirmSelectionMulti);
    
    textAlign(CENTER, CENTER);
    textFont(metalFont);
    
    if (isSelected) {
      // Selected
      fill(255);
      stroke(255, 0, 0);
      strokeWeight(4);
      textSize(width * 0.030);
      text(CONFIRM_OPTIONS_MULTI[i], promptX, y);
    } else {
      // Unselected
      fill(255);
      noStroke();
      textSize(width * 0.022);
      text(CONFIRM_OPTIONS_MULTI[i], promptX, y);
    }
  }
  
  pop();
}

function drawComboListCharacterSelectMulti() {
  push();
  
  let listX = width * 0.48;
  let listY = height * 0.25;
  let listW = width * 0.38;
  let listH = height * 0.50;
  let titleSize = width * 0.025;
  let optionSize = width * 0.030;
  let unselectedSize = width * 0.022;
  let titleY = height * 0.03;
  let optionStartY = height * 0.15;
  let optionSpacing = height * 0.12;
  let hintSpacing = height * 0.04;
  
  // Background box
  fill(20, 240);
  stroke(255, 0, 0);
  strokeWeight(4);
  rectMode(CORNER);
  rect(listX, listY, listW, listH, 10);
  
  // Title
  textAlign(CENTER, TOP);
  textFont(metalFont);
  fill(255);
  noStroke();
  textSize(titleSize);
  text("SELECT CHARACTER", listX + listW/2, listY + titleY);
  
  // Get character names
  let p1Name = FIGHTERS[p1Selected].name.toUpperCase();
  let p2Name = FIGHTERS[p2Selected].name.toUpperCase();
  let characterOptions = [p1Name, p2Name];
  
  // Draw character options
  let optionY = listY + optionStartY;
  
  for (let i = 0; i < characterOptions.length; i++) {
    let y = optionY + (i * optionSpacing);
    let isSelected = (i === comboListSelectionMulti);
    
    textAlign(CENTER, CENTER);
    textFont(metalFont);
    
    if (isSelected) {
      // Selected
      fill(255);
      stroke(i === 0 ? color(0, 150, 255) : color(255, 50, 50));
      strokeWeight(4);
      textSize(optionSize);
      text(characterOptions[i], listX + listW/2, y);
    } else {
      // Unselected
      fill(i === 0 ? color(0, 150, 255) : color(255, 50, 50));
      noStroke();
      textSize(unselectedSize);
      text(characterOptions[i], listX + listW/2, y);
    }
  }
  
  // Controls hint
  fill(255);
  noStroke();
  textAlign(CENTER, BOTTOM);
  textSize(width * 0.012);
  text("W/S OR ARROWS TO SELECT", listX + listW/2, listY + listH - (hintSpacing * 2));
  text("SPACE OR ENTER TO CONFIRM", listX + listW/2, listY + listH - hintSpacing);
  text("ESC TO GO BACK", listX + listW/2, listY + listH - height * 0.01);
  
  pop();
}

function drawComboListViewMulti() {
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
  let selectedCharIndex = (comboListSelectionMulti === 0) ? p1Selected : p2Selected;
  let selectedCharName = FIGHTERS[selectedCharIndex].name;
  let playerNum = (comboListSelectionMulti === 0) ? 1 : 2;
  
  // Build combo list
  let comboList = buildComboList(selectedCharName);
  
  // Calculate content area
  let contentX = listX + contentPaddingX;
  let contentY = listY + contentPaddingY;
  let contentW = listW - (contentPaddingX * 2);
  
  textAlign(LEFT, TOP);
  
  // CONTROL LEGEND
  fill(255);
  noStroke();
  textFont(metalFont);
  textSize(controlTextSize);
  
  if (playerNum === 1) {
    text("UP=Jump  DW=Crouch  FW=Forward  BW=Backward", contentX, contentY);
    contentY += controlLineSpacing;
    text("LP(Y)=Light Punch  HP(U)=Heavy Punch  LK(H)=Light Kick  HK(J)=Heavy Kick", contentX, contentY);
  } else {
    text("UP=Jump  DW=Crouch  FW=Forward  BW=Backward", contentX, contentY);
    contentY += controlLineSpacing;
    text("LP(numpad4)=Light Punch  HP(numpad5)=Heavy Punch  LK(numpad1)=Light Kick  HK(numpad2)=Heavy Kick", contentX, contentY);
  }
  
  contentY += controlAfterSpacing;
  
  // COMBO LIST
  let comboStartY = contentY;
  let lastComboY = comboStartY;
  
  for (let i = 0; i < comboList.length; i++) {
    let combo = comboList[i];
    let y = comboStartY + (i * comboLineHeight);
    let isSelected = (i === selectedComboIndexMulti);
    
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
  
  // SEPARATOR
  let separatorY = lastComboY + comboLineHeight + separatorPadding;
  
  stroke(255, 0, 0);
  strokeWeight(2);
  line(listX + contentPaddingX, separatorY, listX + listW - contentPaddingX, separatorY);
  
  // COMBO DETAILS
  let detailsY = separatorY + separatorPadding;
  let selectedCombo = comboList[selectedComboIndexMulti] || comboList[0];
  
  fill(255);
  noStroke();
  textFont(metalFont);
  textSize(detailsNameSize);
  text(selectedCombo.name, contentX, detailsY);
  detailsY += detailsSectionGap;
  
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
  
  fill(255, 200, 0);
  noStroke();
  textSize(detailsSectionSize);
  text("Description:", contentX, detailsY);
  detailsY += (controlLineSpacing + height * 0.002);
  
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
  
  // CONTROLS HINT
  fill(255);
  noStroke();
  textAlign(CENTER, BOTTOM);
  textSize(hintTextSize);
  text("W/S OR ARROWS TO SCROLL • ESC TO GO BACK", listX + listW / 2, listY + listH - hintBottomPadding);
  
  pop();
}

function buildComboList(characterName) {
  let combos = [];
  
  if (characterName === "Ethan Li") {
    combos = [
      { name: "Punch Chain", sequence: "LP, LP, HP", description: "A barrage of punches" },
      { name: "Kick Chain", sequence: "LK, LK, HK", description: "A barrage of Sword Slash" },
      { name: "Punch Kick Chain 1", sequence: "LP, HP, HK", description: "A barrage of Punches and Sword Slash" },
      { name: "Punch Kick Chain 2", sequence: "LP, LK, HK", description: "A barrage of Punches and Sword Slash" },
      { name: "Launcher", sequence: "DW, FW, HP", description: "A Sword Slash that would render the enemy Airborne" },
      { name: "Diving Kick", sequence: "UP, FW, HK", description: "A Jumping Downward Sword Slash" },
      { name: "White Wind Sword Qi", sequence: "BW, DW, FW, LP", description: "A crescent torrent of condensed white sword intent is released forth, cleaving through the air like a winter gale that splits mountains." },
      { name: "Unstoppable Sword", sequence: "BW, FW, LP, HP", description: "Ethan compresses his sword will into a single killing step, becoming a streak of white light that pierces all defenses before the enemy can breathe." },
      { name: "Sword Flight", sequence: "BW, FW, UP, UP", description: "Riding upon his own sword intent, Ethan ascends skyward as though stepping onto invisible blades forged from pure qi." },
      { name: "Sky Severing Step", sequence: "During Sword Flight, FW, FW", description: "During Sword Flight, he folds space with a silent wind-step, reappearing behind his foe like a phantom of the northern gust." },
      { name: "Heavenfall Sword God Slash", sequence: "During Sword Flight, BW, BW, HP, HK", description: "From the heavens he descends in front of his enemy, delivering a divine execution strike that splits earth and spirit alike." },
      { name: "White Gods True Judgement", sequence: "If HP <= 50% and during Sword Flight, BW, FW, LK, HP, HK", description: "When his blood stains the battlefield, a colossal sword of heavenly light manifests above his enemy and descends in absolute verdict." }
    ];
  }
  
  else if (characterName === "Lucas Tang") {
    combos = [
      { name: "Punch Chain", sequence: "LP, LP, HP", description: "A barrage of punches" },
      { name: "Kick Chain", sequence: "LK, LK, HK", description: "A barrage of Kicks" },
      { name: "Punch Kick Chain 1", sequence: "LP, HP, HK", description: "A barrage of Punches and Kicks" },
      { name: "Punch Kick Chain 2", sequence: "LP, LK, HK", description: "A barrage of Punches and Kicks" },
      { name: "Launcher", sequence: "DW, FW, HP", description: "A Punch that would render the enemy Airborne" },
      { name: "Diving Kick", sequence: "UP, FW, HK", description: "A Jumping Downward Kick" },
      { name: "Myriad Venom Body", sequence: "DW, FW, BW, HP", description: "Lucas awakens the ancient poison physique, his palms dripping with corrosive qi that erodes flesh and meridians alike." },
      { name: "Paralyzing Soul Venom", sequence: "During Myriad Venom Body LP, HP, LP", description: "A streak of toxic qi pierces forward, freezing the enemy's meridians and locking their body in helpless stagnation." },
      { name: "Crimson Withering Needle", sequence: "DW, FW, LP", description: "A blazing scarlet needle of venom embeds itself within the foe, rotting their vitality with relentless decay." },
      { name: "Nether Blossom Domain", sequence: "During Myriad Venom Body, HP, HK, DW, DW", description: "A field of poisonous flowers blooms beneath the battlefield, devouring movement, corroding life, and feeding their stolen essence back to Lucas." },
      { name: "Venom Shadow Step", sequence: "During Nether Blossom Domain, FW, FW", description: "Within his blooming poison field, Lucas melts into toxic mist and reforms behind his prey like death itself." },
      { name: "Ten Thousand Venoms Flower Rain", sequence: "If HP <= 50% and during Nether Blossom Domain, BW, FW, LP, HP, HK", description: "When pushed to the brink, he sacrifices the entire blossom domain, turning it into a torrential rain of annihilating toxins that erase all beneath it." }
    ];
  }
  
  else if (characterName === "Aaron Shu") {
    combos = [
      { name: "Punch Chain", sequence: "LP, LP, HP", description: "A barrage of punches" },
      { name: "Kick Chain", sequence: "LK, LK, HK", description: "A barrage of Kicks" },
      { name: "Punch Kick Chain 1", sequence: "LP, HP, HK", description: "A barrage of Punches and Kicks" },
      { name: "Punch Kick Chain 2", sequence: "LP, LK, HK", description: "A barrage of Punches and Kicks" },
      { name: "Launcher", sequence: "DW, FW, HP", description: "A Punch that would render the enemy Airborne" },
      { name: "Diving Kick", sequence: "UP, FW, HK", description: "A Jumping Downward Kick" },
      { name: "Azure Dragon Scale", sequence: "HP, DW, DW", description: "Spectral dragon scales cloak his body, reflecting incoming force as if the sea itself rejected the strike." },
      { name: "Immortal Tortoise Body", sequence: "HK, DW, DW", description: "Channeling the primordial guardian, his physique hardens like ancient stone, amplifying both his destructive might and defensive fortitude." },
      { name: "Ocean Rebirth Scripture", sequence: "During any form, HP, BW, DW, FW", description: "A surge of tranquil azure water flows through his meridians, washing away impurities and restoring his wounded form." },
      { name: "Unstoppable Sea Dragon", sequence: "During any form, DW, FW, LK, HK", description: "Aaron charges forth like a tidal dragon unleashed, dragging all in his path as though caught in a raging current." },
      { name: "Azure Dragon Ascension", sequence: "If HP <= 50% and during any form, DW, BW, FW, LK, HK", description: "He sinks into the earth like water into sand, erupting beneath his enemy in a spiraling dragon strike that sends them skyward." }
    ];
  }
  
  else if (characterName === "Damon Cheon") {
    combos = [
      { name: "Punch Chain", sequence: "LP, LP, HP", description: "A barrage of punches" },
      { name: "Kick Chain", sequence: "LK, LK, HK", description: "A barrage of Kicks" },
      { name: "Punch Kick Chain 1", sequence: "LP, HP, HK", description: "A barrage of Punches and Kicks" },
      { name: "Punch Kick Chain 2", sequence: "LP, LK, HK", description: "A barrage of Punches and Kicks" },
      { name: "Launcher", sequence: "DW, FW, HP", description: "A Punch that would render the enemy Airborne" },
      { name: "Diving Kick", sequence: "UP, FW, HK", description: "A Jumping Downward Kick" },
      { name: "Crimson Heaven Awakening", sequence: "DW, FW, LK, HP", description: "He burns his own lifespan to ignite demonic power, trading blood for overwhelming destruction and vampiric dominance." },
      { name: "Heaven Splitting Demon Step", sequence: "DW, DW, FW, FW", description: "A violent forward dash that shatters distance itself, under Awakening, the next strike carries amplified demonic wrath." },
      { name: "Heaven Shadow Reversal Step", sequence: "DW, DW, BW, BW", description: "He retreats like a vanishing devil, gathering killing intent so his following attack strikes with doubled cruelty." },
      { name: "Abyssal Demon Claw", sequence: "DW, DW, LP, HP", description: "A crimson demonic talon erupts from beneath the enemy, launching them into the air like prey seized by hell." },
      { name: "Heaven Devouring Abyss", sequence: "DW, DW, LK, HK", description: "He manifests a demonic vortex that drags all into its grasp, under Awakening, those trapped suffer a crushing soul-stunning collapse." },
      { name: "Crimson Heaven Annihilation", sequence: "FW, LK, HP, LP, HK", description: "He brands the enemy with a demonic sigil that records all suffering dealt, only to detonate moments later and return their accumulated pain as absolute destruction." }
    ];
  }
  
  return combos;
}

function handlePauseMenuInput(key, keyCode) {
  if (pauseMenuStateMulti === "MAIN") {
    handleMainMenuInputMulti(key, keyCode);
  } else if (pauseMenuStateMulti === "CONFIRM") {
    handleConfirmInputMulti(key, keyCode);
  } else if (pauseMenuStateMulti === "COMBO_LIST_SELECT") {
    handleComboListSelectInputMulti(key, keyCode);
  } else if (pauseMenuStateMulti === "COMBO_LIST_VIEW") {
    handleComboListViewInputMulti(key, keyCode);
  }
}

function handleMainMenuInputMulti(key, keyCode) {
  if (key === 'w' || key === 'W' || keyCode === UP_ARROW) {
    pauseMenuSelectionMulti--;
    if (pauseMenuSelectionMulti < 0) pauseMenuSelectionMulti = PAUSE_MENU_OPTIONS_MULTI.length - 1;
  }
  
  if (key === 's' || key === 'S' || keyCode === DOWN_ARROW) {
    pauseMenuSelectionMulti++;
    if (pauseMenuSelectionMulti >= PAUSE_MENU_OPTIONS_MULTI.length) pauseMenuSelectionMulti = 0;
  }
  
  if (key === ' ' || keyCode === ENTER) {
    let selectedOption = PAUSE_MENU_OPTIONS_MULTI[pauseMenuSelectionMulti];
    
    if (selectedOption === "RESUME") {
      currentState = GAME_STATE.MATCH_MULTI;
      pauseMenuStateMulti = "MAIN";
      pauseMenuSelectionMulti = 0;
    } else if (selectedOption === "COMBO LIST") {
      pauseMenuStateMulti = "COMBO_LIST_SELECT";
      comboListSelectionMulti = 0;
    } else {
      pendingActionMulti = selectedOption;
      pauseMenuStateMulti = "CONFIRM";
      pauseConfirmSelectionMulti = 0;
    }
  }
  
  if (keyCode === ESCAPE) {
    currentState = GAME_STATE.MATCH_MULTI;
    pauseMenuStateMulti = "MAIN";
    pauseMenuSelectionMulti = 0;
  }
}

function handleConfirmInputMulti(key, keyCode) {
  if (key === 'w' || key === 'W' || keyCode === UP_ARROW) {
    pauseConfirmSelectionMulti--;
    if (pauseConfirmSelectionMulti < 0) pauseConfirmSelectionMulti = CONFIRM_OPTIONS_MULTI.length - 1;
  }
  
  if (key === 's' || key === 'S' || keyCode === DOWN_ARROW) {
    pauseConfirmSelectionMulti++;
    if (pauseConfirmSelectionMulti >= CONFIRM_OPTIONS_MULTI.length) pauseConfirmSelectionMulti = 0;
  }
  
  if (key === ' ' || keyCode === ENTER) {
    if (pauseConfirmSelectionMulti === 0) {
      executePauseActionMulti(pendingActionMulti);
    } else {
      pauseMenuStateMulti = "MAIN";
      pauseConfirmSelectionMulti = 0;
    }
  }
  
  if (keyCode === ESCAPE) {
    pauseMenuStateMulti = "MAIN";
    pauseConfirmSelectionMulti = 0;
  }
}

function handleComboListSelectInputMulti(key, keyCode) {
  if (key === 'w' || key === 'W' || keyCode === UP_ARROW) {
    comboListSelectionMulti--;
    if (comboListSelectionMulti < 0) comboListSelectionMulti = 1;
  }
  
  if (key === 's' || key === 'S' || keyCode === DOWN_ARROW) {
    comboListSelectionMulti++;
    if (comboListSelectionMulti > 1) comboListSelectionMulti = 0;
  }
  
  if (key === ' ' || keyCode === ENTER) {
    pauseMenuStateMulti = "COMBO_LIST_VIEW";
  }
  
  if (keyCode === ESCAPE) {
    pauseMenuStateMulti = "MAIN";
  }
}

function handleComboListViewInputMulti(key, keyCode) {
  let selectedCharIndex = (comboListSelectionMulti === 0) ? p1Selected : p2Selected;
  let selectedCharName = FIGHTERS[selectedCharIndex].name;
  let comboList = buildComboList(selectedCharName);
  
  if (key === 'w' || key === 'W' || keyCode === UP_ARROW) {
    selectedComboIndexMulti--;
    if (selectedComboIndexMulti < 0) selectedComboIndexMulti = comboList.length - 1;
  }
  
  if (key === 's' || key === 'S' || keyCode === DOWN_ARROW) {
    selectedComboIndexMulti++;
    if (selectedComboIndexMulti >= comboList.length) selectedComboIndexMulti = 0;
  }
  
  if (keyCode === ESCAPE || keyCode === BACKSPACE) {
    pauseMenuStateMulti = "COMBO_LIST_SELECT";
    selectedComboIndexMulti = 0;
  }
}

function executePauseActionMulti(action) {
  switch (action) {
    case "RESTART":
      currentRound = 1;
      p1RoundsWon = 0;
      p2RoundsWon = 0;
      gameOver = false;
      currentState = GAME_STATE.LOADING_MATCH_MULTI;
      resetPauseMenuMulti();
      break;
      
    case "CHARACTER SELECT":
      p1Selected = 0;
      p2Selected = 1;
      p1Ready = false;
      p2Ready = false;
      currentRound = 1;
      p1RoundsWon = 0;
      p2RoundsWon = 0;
      gameOver = false;
      currentState = GAME_STATE.CHARACTER_SELECT_MULTI;
      resetPauseMenuMulti();
      break;
      
    case "MAIN MENU":
      p1Selected = 0;
      p2Selected = 1;
      p1Ready = false;
      p2Ready = false;
      currentRound = 1;
      p1RoundsWon = 0;
      p2RoundsWon = 0;
      gameOver = false;
      currentState = GAME_STATE.MENU;
      resetPauseMenuMulti();
      break;
  }
}

function resetPauseMenuMulti() {
  pauseMenuStateMulti = "MAIN";
  pauseMenuSelectionMulti = 0;
  pauseConfirmSelectionMulti = 0;
  comboListSelectionMulti = 0;
  selectedComboIndexMulti = 0;
  pendingActionMulti = "";
}