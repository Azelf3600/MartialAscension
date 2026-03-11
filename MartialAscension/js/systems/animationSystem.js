class AnimationSystem {
  constructor() {
    this.loadedAnimations = {};
  }

  // ✅ NEW: Convert character name to folder-safe format
  getFolderName(characterName) {
    // Remove spaces for folder names
    return characterName.replace(/\s+/g, ''); // "Ethan Li" → "EthanLi"
  }

  // Load character animations
  loadCharacterAnimations(characterName) {
    // ✅ Use folder-safe name for storage
    let folderName = this.getFolderName(characterName);
    
    if (!this.loadedAnimations[characterName]) {
      this.loadedAnimations[characterName] = {};
    }

    if (folderName === "EthanLi") {
      this.loadedAnimations[characterName].idle = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/Idle/frame${frameNum}.png`;
        this.loadedAnimations[characterName].idle.push(loadImage(path));
      }
      this.loadedAnimations[characterName].walk = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/Walk/frame${frameNum}.png`;
        this.loadedAnimations[characterName].walk.push(loadImage(path));
      }
      this.loadedAnimations[characterName].jump = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/Jump/frame${frameNum}.png`;
        this.loadedAnimations[characterName].jump.push(loadImage(path));
      }
      this.loadedAnimations[characterName].fall = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/Fall/frame${frameNum}.png`;
        this.loadedAnimations[characterName].fall.push(loadImage(path));
      }
    }

    // Add other characters here later...
  }

  // Get animation for a character
  getAnimation(characterName, animationName) {
    return this.loadedAnimations[characterName]?.[animationName] || [];
  }

  // Determine which animation should play based on character state
  getAnimationState(character) {
  if (character.attacking) return "attack";        
  if (character.h === character.crouchH) return "crouch"; 
  if (character.isDashing) return "dash";          
  if (character.isFlying) return "flight";        
  if (!character.isGrounded) {
    if (character.velY < 0) return "jump";  
    return "fall";                           
  }
  if (character.isWalking) return "walk"; 
  return "idle"; 
}

  // Update character animation
  updateAnimation(character) {
    // Determine what animation should play
    let targetAnimation = this.getAnimationState(character);
    
    // Check if animation changed
    if (character.currentAnimation !== targetAnimation) {
      character.currentAnimation = targetAnimation;
      character.currentFrame = 0;
      character.frameTimer = 0;
    }

    // Advance frame timer
    character.frameTimer++;
    if (character.frameTimer >= character.frameDelay) {
      character.frameTimer = 0;
      
      // Get the actual animation frames
      let frames = this.getAnimation(character.name, character.currentAnimation);
      
      if (frames.length > 0) {
        character.currentFrame = (character.currentFrame + 1) % frames.length;
      }
    }
  }

// Draw the current animation frame
drawAnimation(character) {
  let frames = this.getAnimation(character.name, character.currentAnimation);
  
  if (frames.length > 0 && frames[character.currentFrame]) {
    let sprite = frames[character.currentFrame];
    
    push();
    
    // ✅ Calculate sprite dimensions using character's spriteScale
    let spriteAspect = sprite.width / sprite.height;
    let targetHeight = character.h * character.spriteScale; // ✅ Uses spriteScale property
    let targetWidth = targetHeight * spriteAspect;
    
    // ✅ Calculate sprite position with offsets
    let spriteCenterX = character.x + character.w/2 + character.spriteOffsetX;
    let spriteCenterY = character.y + character.h/2 + character.spriteOffsetY;
    
    translate(spriteCenterX, spriteCenterY);
    
    // Handle flipping based on facing direction
    if (character.facing === -1) {
      scale(-1, 1); // Flip horizontally
    }
    
    imageMode(CENTER);
    image(
      sprite,
      0, 0,
      targetWidth, targetHeight
    );
    
    pop();
} else {
  // ✅ Fallback to colored rectangle if no sprite - use hurtbox dimensions
  push();
  fill(character.color);
  let hurtboxX = character.x + character.hurtboxOffsetX;
  let hurtboxY = character.y + character.hurtboxOffsetY;
  rect(hurtboxX, hurtboxY, character.hurtboxWidth, character.hurtboxHeight, 5);
  pop();
}
  }
}

// Global animation system instance
let animationSystem;