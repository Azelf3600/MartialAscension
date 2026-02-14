  let metalFont;
  let singleBtn, multiBtn;

  //preload font and images to avoid lag
  function preloadMainMenu() {
    metalFont = loadFont("Assets/fonts/MetalMania-Regular.ttf");

    // For fighter images
    FIGHTERS.forEach(fighter => {
      // Load the small headshot for the grid
      if (fighter.thumbPath) {
        fighter.thumbImg = loadImage(fighter.thumbPath);
      }
      // Load the half-body for the side preview
      if (fighter.previewPath) {
        fighter.previewImg = loadImage(fighter.previewPath);
      }
    });

    // for stage images 
    STAGES.forEach(stage => {
      stage.img = loadImage(stage.path);
    });
  }

  function setupMenuLayout() {
    let centerX = width / 2;
    let centerY = height / 2;

    singleBtn = {
      x: centerX,
      y: centerY + height * 0.05,
      w: width * 0.4, 
      h: height * 0.1 
    };

    multiBtn = {
      x: centerX,
      y: centerY + height * 0.15,
      w: width * 0.4,
      h: height * 0.1
    };
  }

  function drawMenu() {
    background(20); 
    push();
    textAlign(CENTER, CENTER); // Force alignment for the menu specifically
    
    let centerX = width / 2;
    let centerY = height / 2;

    drawTitle("Martial Ascension", centerX, centerY - height * 0.25, width * 0.1);
    drawText("Click to proceed", centerX, centerY - height * 0.01, width * 0.015);

    drawButton("Single Player", singleBtn);
    drawButton("Multiplayer", multiBtn);

    drawText("Starloom 2025", centerX, height - height * 0.05, width * 0.015);
    pop();
  }

  //Delay when clicked 
  function handleMenuClick() {
    if (isHovering(singleBtn)) {
      setTimeout(() => {
        currentState = GAME_STATE.CHARACTER_SELECT;
      }, 500);
    }

    if (isHovering(multiBtn)) {
      setTimeout(() => {
        currentState = GAME_STATE.CHARACTER_SELECT_MULTI;
      }, 500);
    }
  }

  //Main Title - Martial Ascension
  function drawTitle(content, x, y, size) {
    push();
    textFont(metalFont);
    textSize(size);
    stroke(255, 0, 0);
    strokeWeight(8);
    fill(255);
    text(content, floor(x), floor(y));
    pop();
  }

  function drawButton(label, btn) {
    push();
    textFont(metalFont);
    
    //Size and stroke based on hover
    if (isHovering(btn)) {
      textSize(width * 0.045); 
      stroke(180, 0, 0);       
      strokeWeight(6);        
    } else {
      textSize(width * 0.035); 
      noStroke();              
    }

    fill(255);
    textAlign(CENTER, CENTER);
    text(label, btn.x, btn.y);
    pop();
  }

  function drawText(content, x, y, size) {
    push();
    textFont(metalFont);
    textSize(size);
    fill(255);
    noStroke();
    text(content, x, y);
    pop();
  }

  function isHovering(btn) {
    return (
      mouseX > btn.x - btn.w / 2 &&
      mouseX < btn.x + btn.w / 2 &&
      mouseY > btn.y - btn.h / 2 &&
      mouseY < btn.y + btn.h / 2
    );
  }