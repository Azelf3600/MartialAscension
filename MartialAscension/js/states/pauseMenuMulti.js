// Pause Menu State
let pauseMenuState = "MAIN"; // "MAIN", "CONFIRM", "COMBO_LIST_SELECT", "COMBO_LIST_VIEW"
let pauseMenuSelection = 0; // Current selection (0-4)
let pauseConfirmSelection = 0; // Confirm selection (0 = Yes, 1 = No)
let comboListSelection = 0; // Character selection in combo list (0 = P1, 1 = P2)
let selectedComboIndex = 0; // ✅ NEW: Track selected combo in list
let pendingAction = ""; // What action is waiting for confirmation

const PAUSE_MENU_OPTIONS = [
  "RESUME",
  "RESTART",
  "CHARACTER SELECT",
  "COMBO LIST",
  "MAIN MENU"
];

const CONFIRM_OPTIONS = ["YES", "NO"];

function drawPauseMenuMulti() {
  // Semi-transparent black overlay
  push();
  fill(0, 200);
  noStroke();
  rectMode(CORNER);
  rect(0, 0, width, height);
  pop();
  
  // Draw based on current state
  if (pauseMenuState === "MAIN") {
    drawPauseMainMenu();
  } else if (pauseMenuState === "CONFIRM") {
    drawPauseMainMenu(); // Still show main menu dimmed
    drawPauseConfirmPrompt();
  } else if (pauseMenuState === "COMBO_LIST_SELECT") {
    drawPauseMainMenu(); // Still show main menu dimmed
    drawComboListCharacterSelect();
  } else if (pauseMenuState === "COMBO_LIST_VIEW") {
    drawPauseMainMenu(); // Still show main menu dimmed
    drawComboListView();
  }
}

function drawPauseMainMenu() {
  push();
  
  let menuX = width * 0.25;
  let menuY = height * 0.30;
  let optionSpacing = height * 0.10;
  
  // Dim if in confirm state
  let dimAlpha = (pauseMenuState !== "MAIN") ? 100 : 255;
  
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
  for (let i = 0; i < PAUSE_MENU_OPTIONS.length; i++) {
    let y = menuY + (i * optionSpacing);
    let isSelected = (i === pauseMenuSelection && pauseMenuState === "MAIN");
    
    textAlign(CENTER, CENTER);
    textFont(metalFont);
    
    if (isSelected) {
      // Selected option - white with red stroke
      fill(255, dimAlpha);
      stroke(255, 0, 0, dimAlpha);
      strokeWeight(4);
      textSize(width * 0.028);
      text(PAUSE_MENU_OPTIONS[i], menuX, y);
    } else {
      // Unselected options - white
      fill(255, dimAlpha);
      noStroke();
      textSize(width * 0.022);
      text(PAUSE_MENU_OPTIONS[i], menuX, y);
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

function drawPauseConfirmPrompt() {
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
  for (let i = 0; i < CONFIRM_OPTIONS.length; i++) {
    let y = promptY + optionSpacing + (i * optionSpacing * 0.8);
    let isSelected = (i === pauseConfirmSelection);
    
    textAlign(CENTER, CENTER);
    textFont(metalFont);
    
    if (isSelected) {
      // Selected
      fill(255);
      stroke(255, 0, 0);
      strokeWeight(4);
      textSize(width * 0.030);
      text(CONFIRM_OPTIONS[i], promptX, y);
    } else {
      // Unselected
      fill(255);
      noStroke();
      textSize(width * 0.022);
      text(CONFIRM_OPTIONS[i], promptX, y);
    }
  }
  
  pop();
}

function drawComboListCharacterSelect() {
  push();
  
  // ✅ SPACING VARIABLES - Adjust these to change box size and position
  let listX = width * 0.48;        // Horizontal position (0.48 = right side)
  let listY = height * 0.25;       // Vertical position (0.25 = upper)
  let listW = width * 0.38;        // Box width (0.38 = 38% of screen)
  let listH = height * 0.50;       // Box height (0.50 = 50% of screen)
  let titleSize = width * 0.025;   // Title text size
  let optionSize = width * 0.030;  // Selected option text size
  let unselectedSize = width * 0.022; // Unselected option text size
  let titleY = height * 0.03;      // Title Y offset from box top
  let optionStartY = height * 0.15; // First option Y offset
  let optionSpacing = height * 0.12; // Space between options
  let hintSpacing = height * 0.04; // Space between hint lines
  
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
    let isSelected = (i === comboListSelection);
    
    textAlign(CENTER, CENTER);
    textFont(metalFont);
    
    if (isSelected) {
      // Selected
      fill(255);
      stroke(i === 0 ? color(0, 150, 255) : color(255, 50, 50)); // P1 blue, P2 red
      strokeWeight(4);
      textSize(optionSize);
      text(characterOptions[i], listX + listW/2, y);
    } else {
      // Unselected
      fill(i === 0 ? color(0, 150, 255) : color(255, 50, 50)); // P1 blue, P2 red
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

function drawComboListView() {
  push();
  
  // ════════════════════════════════════════════════════════════════
  // ✅ MASTER SPACING VARIABLES - ADJUST THESE FOR LAYOUT CONTROL
  // ════════════════════════════════════════════════════════════════
  
  // Box dimensions and position
  let listX = width * 0.38;           // Horizontal position
  let listY = height * 0.05;          // Vertical position
  let listW = width * 0.60;           // Box width
  let listH = height * 0.90;          // Box height
  
  // Content padding
  let contentPaddingX = width * 0.02; // Left/right padding
  let contentPaddingY = height * 0.03; // Top padding
  
  // Control legend section
  let controlTextSize = width * 0.014;      // Control text size
  let controlLineSpacing = height * 0.035;  // Space between control lines
  let controlAfterSpacing = height * 0.05;  // Space after controls section
  
  // Combo list section
  let comboLineHeight = height * 0.038;     // Space between combo names
  let comboSelectedSize = width * 0.015;    // Selected combo size
  let comboUnselectedSize = width * 0.013;  // Unselected combo size
  let comboStrokeWeight = 2;                // Stroke weight for selected
  
  // Details section
  let detailsNameSize = width * 0.016;      // Selected combo name size
  let detailsSectionSize = width * 0.013;   // "Sequence:", "Description:" size
  let detailsTextSize = width * 0.015;      // Sequence text size
  let detailsDescSize = width * 0.015;      // Description text size
  let detailsLineSpacing = height * 0.03;  // Space between desc lines
  let detailsSectionGap = height * 0.03;   // Gap between sections
  let detailsIndent = width * 0.015;        // Indent for sequence/desc text
  let separatorPadding = height * 0.02;     // Space between last combo and separator
  
  // Controls hint
  let hintTextSize = width * 0.012;         // Bottom hint text size
  let hintBottomPadding = height * 0.01;    // Padding from bottom
  
  // ════════════════════════════════════════════════════════════════
  
  // Background box
  fill(20, 240);
  stroke(255, 0, 0);
  strokeWeight(4);
  rectMode(CORNER);
  rect(listX, listY, listW, listH, 10);
  
  // Get selected character data
  let selectedCharIndex = (comboListSelection === 0) ? p1Selected : p2Selected;
  let selectedCharName = FIGHTERS[selectedCharIndex].name;
  let playerNum = (comboListSelection === 0) ? 1 : 2;
  
  // Build combo list
  let comboList = buildComboList(selectedCharName);
  
  // Calculate content area
  let contentX = listX + contentPaddingX;
  let contentY = listY + contentPaddingY;
  let contentW = listW - (contentPaddingX * 2);
  
  textAlign(LEFT, TOP);
  
  // ════════════════════════════════════════════════════════════════
  // SECTION 1: CONTROL LEGEND
  // ════════════════════════════════════════════════════════════════
  
  fill(255); // White text
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
  
  // ════════════════════════════════════════════════════════════════
  // SECTION 2: SCROLLABLE COMBO LIST
  // ════════════════════════════════════════════════════════════════
  
  let comboStartY = contentY;
  let lastComboY = comboStartY; // Track the Y position of the last combo
  
  for (let i = 0; i < comboList.length; i++) {
    let combo = comboList[i];
    let y = comboStartY + (i * comboLineHeight);
    let isSelected = (i === selectedComboIndex);
    
    textFont(metalFont);
    
    if (isSelected) {
      // Selected combo - white with red stroke
      fill(255);
      stroke(255, 0, 0);
      strokeWeight(comboStrokeWeight);
      textSize(comboSelectedSize);
    } else {
      // Unselected combo - white, no stroke
      fill(255);
      noStroke();
      textSize(comboUnselectedSize);
    }
    
    text(combo.name, contentX, y);
    
    // Update last combo Y position
    lastComboY = y;
  }
  
  // ════════════════════════════════════════════════════════════════
  // SECTION 3: SEPARATOR LINE (BELOW LAST COMBO)
  // ════════════════════════════════════════════════════════════════
  
  let separatorY = lastComboY + comboLineHeight + separatorPadding;
  
  stroke(255, 0, 0);
  strokeWeight(2);
  line(listX + contentPaddingX, separatorY, 
       listX + listW - contentPaddingX, separatorY);
  
  // ════════════════════════════════════════════════════════════════
  // SECTION 4: SELECTED COMBO DETAILS (STARTS AFTER SEPARATOR)
  // ════════════════════════════════════════════════════════════════
  
  let detailsY = separatorY + separatorPadding;
  let selectedCombo = comboList[selectedComboIndex] || comboList[0];
  
  // Combo name (large, white, no stroke)
  fill(255);
  noStroke();
  textFont(metalFont);
  textSize(detailsNameSize);
  text(selectedCombo.name, contentX, detailsY);
  detailsY += detailsSectionGap;
  
  // Sequence section
  fill(255, 200, 0); // Yellow header
  noStroke();
  textSize(detailsSectionSize);
  text("Sequence:", contentX, detailsY);
  detailsY += (controlLineSpacing + height * 0.002);
  
  fill(255); // ✅ WHITE text (changed from gray)
  noStroke();
  textSize(detailsTextSize);
  text(selectedCombo.sequence, contentX + detailsIndent, detailsY);
  detailsY += detailsSectionGap;
  
  // Description section
  fill(255, 200, 0); // Yellow header
  noStroke();
  textSize(detailsSectionSize);
  text("Description:", contentX, detailsY);
  detailsY += (controlLineSpacing + height * 0.002);
  
  // Description text (word-wrapped)
  fill(255); // ✅ WHITE text (changed from gray)
  noStroke();
  textSize(detailsDescSize);
  textFont(metalFont);
  
  // Simple word wrapping using character estimation
  let descText = selectedCombo.description;
  let maxWidth = contentW - detailsIndent - (contentPaddingX * 2);
  let currentLine = '';
  let words = descText.split(' ');
  
  for (let i = 0; i < words.length; i++) {
    let testLine = currentLine + words[i] + ' ';
    
    // Estimate width based on character count (more reliable than textWidth)
    let estimatedWidth = testLine.length * (width * 0.0055);
    
    if (estimatedWidth > maxWidth && currentLine.length > 0) {
      // Draw current line
      text(currentLine.trim(), contentX + detailsIndent, detailsY);
      detailsY += detailsLineSpacing;
      currentLine = words[i] + ' ';
    } else {
      currentLine = testLine;
    }
  }
  
  // Draw remaining text
  if (currentLine.trim().length > 0) {
    text(currentLine.trim(), contentX + detailsIndent, detailsY);
  }
  
  // ════════════════════════════════════════════════════════════════
  // SECTION 5: CONTROLS HINT (BOTTOM)
  // ════════════════════════════════════════════════════════════════
  
  fill(255);
  noStroke();
  textAlign(CENTER, BOTTOM);
  textSize(hintTextSize);
  text("W/S OR ARROWS TO SCROLL • ESC TO GO BACK", 
       listX + listW / 2, 
       listY + listH - hintBottomPadding);
  
  pop();
}


// ✅ NEW: Build combo list for character
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
  // Handle based on current state
  if (pauseMenuState === "MAIN") {
    handleMainMenuInput(key, keyCode);
  } else if (pauseMenuState === "CONFIRM") {
    handleConfirmInput(key, keyCode);
  } else if (pauseMenuState === "COMBO_LIST_SELECT") {
    handleComboListSelectInput(key, keyCode);
  } else if (pauseMenuState === "COMBO_LIST_VIEW") {
    handleComboListViewInput(key, keyCode);
  }
}

function handleMainMenuInput(key, keyCode) {
  // Navigation
  if (key === 'w' || key === 'W' || keyCode === UP_ARROW) {
    pauseMenuSelection--;
    if (pauseMenuSelection < 0) pauseMenuSelection = PAUSE_MENU_OPTIONS.length - 1;
  }
  
  if (key === 's' || key === 'S' || keyCode === DOWN_ARROW) {
    pauseMenuSelection++;
    if (pauseMenuSelection >= PAUSE_MENU_OPTIONS.length) pauseMenuSelection = 0;
  }
  
  // Confirm selection
  if (key === ' ' || keyCode === ENTER) {
    let selectedOption = PAUSE_MENU_OPTIONS[pauseMenuSelection];
    
    if (selectedOption === "RESUME") {
      // Resume immediately - no confirmation
      currentState = GAME_STATE.MATCH_MULTI;
      pauseMenuState = "MAIN";
      pauseMenuSelection = 0;
    } else if (selectedOption === "COMBO LIST") {
      // Show character select for combo list
      pauseMenuState = "COMBO_LIST_SELECT";
      comboListSelection = 0; // Default to P1
    } else {
      // Other options need confirmation
      pendingAction = selectedOption;
      pauseMenuState = "CONFIRM";
      pauseConfirmSelection = 0; // Default to "YES"
    }
  }
  
  // ESC to resume
  if (keyCode === ESCAPE) {
    currentState = GAME_STATE.MATCH_MULTI;
    pauseMenuState = "MAIN";
    pauseMenuSelection = 0;
  }
}

function handleConfirmInput(key, keyCode) {
  // Navigation
  if (key === 'w' || key === 'W' || keyCode === UP_ARROW) {
    pauseConfirmSelection--;
    if (pauseConfirmSelection < 0) pauseConfirmSelection = CONFIRM_OPTIONS.length - 1;
  }
  
  if (key === 's' || key === 'S' || keyCode === DOWN_ARROW) {
    pauseConfirmSelection++;
    if (pauseConfirmSelection >= CONFIRM_OPTIONS.length) pauseConfirmSelection = 0;
  }
  
  // Confirm selection
  if (key === ' ' || keyCode === ENTER) {
    if (pauseConfirmSelection === 0) { // YES
      executePauseAction(pendingAction);
    } else { // NO
      // Go back to main menu
      pauseMenuState = "MAIN";
      pauseConfirmSelection = 0;
    }
  }
  
  // ESC to cancel
  if (keyCode === ESCAPE) {
    pauseMenuState = "MAIN";
    pauseConfirmSelection = 0;
  }
}

function handleComboListSelectInput(key, keyCode) {
  // Navigation
  if (key === 'w' || key === 'W' || keyCode === UP_ARROW) {
    comboListSelection--;
    if (comboListSelection < 0) comboListSelection = 1; // Only 2 options (P1, P2)
  }
  
  if (key === 's' || key === 'S' || keyCode === DOWN_ARROW) {
    comboListSelection++;
    if (comboListSelection > 1) comboListSelection = 0; // Only 2 options (P1, P2)
  }
  
  // Confirm selection
  if (key === ' ' || keyCode === ENTER) {
    pauseMenuState = "COMBO_LIST_VIEW";
  }
  
  // ESC to go back
  if (keyCode === ESCAPE) {
    pauseMenuState = "MAIN";
  }
}

function handleComboListViewInput(key, keyCode) {
  // Get selected character's combo list
  let selectedCharIndex = (comboListSelection === 0) ? p1Selected : p2Selected;
  let selectedCharName = FIGHTERS[selectedCharIndex].name;
  let comboList = buildComboList(selectedCharName);
  
  // ✅ Navigate combo list
  if (key === 'w' || key === 'W' || keyCode === UP_ARROW) {
    selectedComboIndex--;
    if (selectedComboIndex < 0) selectedComboIndex = comboList.length - 1;
  }
  
  if (key === 's' || key === 'S' || keyCode === DOWN_ARROW) {
    selectedComboIndex++;
    if (selectedComboIndex >= comboList.length) selectedComboIndex = 0;
  }
  
  // ESC or Backspace to go back to character select
  if (keyCode === ESCAPE || keyCode === BACKSPACE) {
    pauseMenuState = "COMBO_LIST_SELECT";
    selectedComboIndex = 0; // Reset selection
  }
}

function executePauseAction(action) {
  switch (action) {
    case "RESTART":
      // Restart with same characters
      currentRound = 1;
      p1RoundsWon = 0;
      p2RoundsWon = 0;
      gameOver = false;
      currentState = GAME_STATE.LOADING_MATCH_MULTI;
      resetPauseMenu();
      break;
      
    case "CHARACTER SELECT":
      // Go to character select and reset selections
      p1Selected = 0;
      p2Selected = 1;
      p1Ready = false;
      p2Ready = false;
      currentRound = 1;
      p1RoundsWon = 0;
      p2RoundsWon = 0;
      gameOver = false;
      currentState = GAME_STATE.CHARACTER_SELECT_MULTI;
      resetPauseMenu();
      break;
      
    case "MAIN MENU":
      // Go to main menu and reset everything
      p1Selected = 0;
      p2Selected = 1;
      p1Ready = false;
      p2Ready = false;
      currentRound = 1;
      p1RoundsWon = 0;
      p2RoundsWon = 0;
      gameOver = false;
      currentState = GAME_STATE.MENU;
      resetPauseMenu();
      break;
  }
}

function resetPauseMenu() {
  pauseMenuState = "MAIN";
  pauseMenuSelection = 0;
  pauseConfirmSelection = 0;
  comboListSelection = 0;
  selectedComboIndex = 0; // ✅ NEW: Reset combo selection
  pendingAction = "";
}
