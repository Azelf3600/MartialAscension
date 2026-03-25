class AIController {
  constructor(character) {
    this.character = character;
    
    // MOVEMENT SYSTEM
    this.movementThinkTimer = 0;
    this.movementThinkInterval = 120;
    
    this.currentMovement = "IDLE";
    this.movementTimer = 0;
    
    this.isWalking = false;
    this.walkDirection = 0;
    this.dashExecuted = false;
    
    this.speedMultiplier = 0.1;
    this.walkChance = 0.50;
    this.dashChance = 0.40;
    this.jumpChance = 0.15;
    this.crouchChance = 0.15;
    
    // ATTACK SYSTEM
    this.shouldAttack = false;
    this.attackCheckTimer = 0;
    this.attackCheckInterval = 15;
    this.lastAttackAttempt = 0;
    
    // Attack type chances
    this.comboChance = 0.60;   // 60% try combo
    this.lpChance = 0.15;       // 15%
    this.hpChance = 0.15;       // 15%
    this.lkChance = 0.15;       // 15%
    this.hkChance = 0.15;       // 15%
    
    // Available combos for this character
    this.availableCombos = [];
    this.initializeCombos();
    this.showDebug = false;
  }
  
  // Initialize character-specific combos
  initializeCombos() {
    // Get standard combos
    let standardCombos = STANDARD_COMBOS.filter(combo => 
      !combo.characterSpecific && 
      combo.type !== "MOVEMENT" && 
      combo.type !== "POWERUP"
    );
    
    // Get character-specific combos
    let specificCombos = STANDARD_COMBOS.filter(combo => 
      combo.characterSpecific === this.character.name    
    );
    
    this.availableCombos = [...standardCombos, ...specificCombos];
    
    console.log(`AI ${this.character.name} has ${this.availableCombos.length} combos available`);
  }
  
  canUseCombo(combo, opponent) {
    // Cooldown check
    if (combo.cooldown) {
      let cooldownKey = combo.name;
      if (this.character.comboCooldowns[cooldownKey] && 
          this.character.comboCooldowns[cooldownKey] > 0) {
        return false;
      }
    }
    
    // Standing requirement
    if (combo.requireStanding && this.character.h !== this.character.standH) {
      return false;
    }
    
    // Flying requirement
    if (combo.requireFlying && !this.character.isFlying) {
      return false;
    }
    
    // Low health requirement
    if (combo.requireLowHealth) {
      let healthPercent = this.character.hp / this.character.maxHp;
      if (healthPercent > 0.5) return false;
    }
    
    // Once-per-round checks
    if (combo.requireJudgmentAvailable && this.character.hasUsedJudgment) {
      return false;
    }
    
    if (combo.requireRainAvailable && this.character.hasUsedPoisonRain) {
      return false;
    }
    
    if (combo.requireAzureDragonAvailable && this.character.hasUsedAzureDragon) {
      return false;
    }
    
    if (combo.requireAnnihilationAvailable && this.character.hasUsedAnnihilation) {
      return false;
    }
    
    // Buff requirements
    if (combo.requirePoisonHands && !this.character.isPoisonHandsActive) {
      return false;
    }
    
    if (combo.requirePoisonField && !this.character.isPoisonFieldActive) {
      return false;
    }
    
    if (combo.requireAzureScalesOrTortoise && 
        !this.character.isAzureScalesActive && 
        !this.character.isTortoiseBodyActive) {
      return false;
    }
    
    // HP cost check
    if (combo.hpCost && this.character.hp <= combo.hpCost) {
      return false;
    }
    
    // Poison Field blocks movement
    if (combo.type === "MOVEMENT" && this.character.isInPoisonField) {
      return false;
    }
    
    return true;
  }
  
  // Try to execute a combo
  tryCombo(opponent) {
    // Filter usable combos
    let usableCombos = this.availableCombos.filter(combo => 
      this.canUseCombo(combo, opponent)
    );
    
    if (usableCombos.length === 0) return false;
    
    // Pick random combo
    let combo = random(usableCombos);
    
    console.log(`🎯 AI executing combo: ${combo.name}`);
    this.character.executeCombo(combo);
    
    return true;
  }
  
  update(opponent, groundY) {
    if (this.character.hitStun > 0 || 
        this.character.demonicClawOwnerLocked || 
        this.character.isInDemonicAbyss) {
      this.isWalking = false;
      return;
    }
    
    // MOVEMENT
    if (this.movementThinkTimer > 0) this.movementThinkTimer--;
    if (this.movementTimer > 0) this.movementTimer--;
    
    if (this.movementThinkTimer <= 0) {
      this.makeMovementDecision(opponent);
      this.movementThinkTimer = this.movementThinkInterval;
    }
    
    if (this.movementTimer > 0) {
      this.executeMovement();
    } else {
      this.dashExecuted = false;
      this.makeMovementDecision(opponent);
      this.movementThinkTimer = this.movementThinkInterval;
    }
    
    // ATTACKS
    if (this.attackCheckTimer > 0) this.attackCheckTimer--;
    
    let distance = Math.abs(this.character.x - opponent.x);
    
    if (this.shouldAttack) {
      if (distance > 300 || 
          !this.character.isGrounded || 
          this.character.attackTimer > 0 ||
          this.character.recoveryTimer > 0) {
        this.shouldAttack = false;
      }
    }
    
    if (this.attackCheckTimer <= 0) {
      if (distance < 300 && 
          this.character.isGrounded && 
          this.character.attackTimer <= 2 &&
          this.character.recoveryTimer <= 0 &&
          !this.character.isPerformingCombo &&
          !this.shouldAttack) {
        
        this.shouldAttack = true;
      }
      
      this.attackCheckTimer = this.attackCheckInterval;
    }
    
    if (this.shouldAttack) {
      if (this.character.attackTimer <= 2 && 
          this.character.recoveryTimer <= 0 &&
          frameCount - this.lastAttackAttempt > 10) {
        
        this.executeAttack(opponent);
        this.shouldAttack = false;
        this.lastAttackAttempt = frameCount;
      }
    }
  }
  
  makeMovementDecision(opponent) {
    let distance = Math.abs(this.character.x - opponent.x);
    
    let specialMoveChance = this.dashChance + this.jumpChance + this.crouchChance;
    let roll = random();
    
    if (roll < specialMoveChance) {
      let specialRoll = random();
      let dashThreshold = this.dashChance / specialMoveChance;
      let jumpThreshold = dashThreshold + (this.jumpChance / specialMoveChance);
      
      // DASH
      if (specialRoll < dashThreshold && this.character.isGrounded && !this.dashExecuted) {
        if (distance > 300) {
          this.currentMovement = "DASH_FORWARD";
          this.executeDashForward();
        } else {
          this.currentMovement = "DASH_BACKWARD";
          this.executeDashBackward();
        }
        this.movementTimer = 30;
        this.dashExecuted = true;
        return;
      }
      
      // JUMP
      if (specialRoll < jumpThreshold && this.character.isGrounded) {
        this.currentMovement = "JUMP";
        this.character.velY = -this.character.jumpPower;
        this.character.isGrounded = false;
        soundSystem.playRandomJumpSfx();
        this.movementTimer = 40;
        return;
      }
      
      // CROUCH
      if (this.character.isGrounded) {
        this.currentMovement = "CROUCH";
        this.movementTimer = random(40, 70);
        return;
      }
    }
    
    // WALK
    if (distance > 450) {
      this.currentMovement = "WALK_FORWARD";
      this.movementTimer = random(90, 150);
      this.isWalking = true;
      this.walkDirection = (this.character.x < opponent.x) ? 1 : -1;
    } else if (distance < 120) {
      this.currentMovement = "WALK_BACKWARD";
      this.movementTimer = random(60, 100);
      this.isWalking = true;
      this.walkDirection = (this.character.x < opponent.x) ? -1 : 1;
    } else {
      this.currentMovement = random() < 0.6 ? "WALK_FORWARD" : "WALK_BACKWARD";
      this.movementTimer = random(45, 90);
      this.isWalking = true;
      this.walkDirection = (this.currentMovement === "WALK_FORWARD") ? 
        ((this.character.x < opponent.x) ? 1 : -1) :
        ((this.character.x < opponent.x) ? -1 : 1);
    }
  }
  
  executeMovement() {
    if (this.currentMovement === "WALK_FORWARD" || this.currentMovement === "WALK_BACKWARD") {
      if (this.isWalking && !this.character.attacking) {
        let walkSpeed = this.character.speed * this.speedMultiplier;
        if (this.walkDirection === 1) {
          this.character.x += walkSpeed;
        } else if (this.walkDirection === -1) {
          this.character.x -= walkSpeed;
        }
      }
    } else if (this.currentMovement === "CROUCH") {
      if (this.character.isGrounded && this.character.h !== this.character.crouchH) {
        this.character.y += (this.character.h - this.character.crouchH);
        this.character.h = this.character.crouchH;
      }
    }
    
    // Uncrouch
    if (this.currentMovement !== "CROUCH" && this.character.h !== this.character.standH) {
      this.character.y -= (this.character.standH - this.character.h);
      this.character.h = this.character.standH;
    }
  }
  
  executeDashForward() {
    if (this.character.isDashing) return;
    soundSystem.playRandomDashSfx();
    this.character.isDashing = true;
    this.character.dashDirection = this.character.facing;
    this.character.dashTimer = 18;
    this.character.dashMaxSpeed = 60;
    this.character.velX = this.character.facing * 50;
  }
  
  executeDashBackward() {
    if (this.character.isDashing) return;
    soundSystem.playRandomDashSfx();
    this.character.isDashing = true;
    this.character.dashDirection = -this.character.facing;
    this.character.dashTimer = 16;
    this.character.dashMaxSpeed = 52;
    this.character.velX = -this.character.facing * 42;
  }
  
  // Attack execution with combo support
  executeAttack(opponent) {
    if (this.character.attackTimer > 0 || this.character.recoveryTimer > 0) {
      return;
    }
    
    let roll = random();
    
    // Try combo first (60% chance)
    if (roll < this.comboChance) {
      if (this.tryCombo(opponent)) {
        console.log("✅ AI executed combo!");
        return; 
      }
    }
    
    let totalChance = this.lpChance + this.hpChance + this.lkChance + this.hkChance;
    let normalizedRoll = (roll - this.comboChance) / (1 - this.comboChance);
    
    let lpThreshold = this.lpChance / totalChance;
    let hpThreshold = lpThreshold + (this.hpChance / totalChance);
    let lkThreshold = hpThreshold + (this.lkChance / totalChance);
    
    let attackType;
    
    if (normalizedRoll < lpThreshold) {
      attackType = "LP";
    } else if (normalizedRoll < hpThreshold) {
      attackType = "HP";
    } else if (normalizedRoll < lkThreshold) {
      attackType = "LK";
    } else {
      attackType = "HK";
    }
    
    console.log(` AI basic attack: ${attackType}`);
    this.character.startAttack(attackType);
  }
  
  drawDebug(opponent) {
    if (!this.showDebug) return;
    
    push();
    let distance = Math.abs(this.character.x - opponent.x);
    
    textAlign(CENTER, BOTTOM);
    textSize(11);
    fill(255, 255, 0);
    noStroke();
    
    text(`Movement: ${this.currentMovement}`, this.character.x + this.character.w/2, this.character.y - 135);
    text(`Timer: ${Math.ceil(this.movementTimer / 60)}s`, this.character.x + this.character.w/2, this.character.y - 120);
    
    let usableComboCount = this.availableCombos.filter(c => this.canUseCombo(c, opponent)).length;
    fill(150, 255, 150);
    text(`Combos: ${usableComboCount}/${this.availableCombos.length}`, this.character.x + this.character.w/2, this.character.y - 105);
    
    // Attack state
    fill(255, 255, 0);
    if (this.character.attackTimer > 0) {
      fill(255, 100, 100);
      text(`ATTACKING: ${this.character.attacking} (${this.character.attackTimer}f)`, this.character.x + this.character.w/2, this.character.y - 90);
    } else if (this.character.recoveryTimer > 0) {
      fill(255, 150, 0);
      text(`Recovery: ${this.character.recoveryTimer}f`, this.character.x + this.character.w/2, this.character.y - 90);
    } else if (distance > 300) {
      fill(150, 150, 150);
      text(`Too far (${Math.floor(distance)}px)`, this.character.x + this.character.w/2, this.character.y - 90);
    } else if (!this.character.isGrounded) {
      fill(150, 150, 150);
      text(`In air`, this.character.x + this.character.w/2, this.character.y - 90);
    } else {
      fill(100, 255, 100);
      text(`✓ READY`, this.character.x + this.character.w/2, this.character.y - 90);
    }
    
    fill(255, 255, 0);
    text(`Distance: ${Math.floor(distance)}px`, this.character.x + this.character.w/2, this.character.y - 75);
    text(`Combo: ${(this.comboChance*100).toFixed(0)}% | LP: ${(this.lpChance*100).toFixed(0)}% | HP: ${(this.hpChance*100).toFixed(0)}%`, 
         this.character.x + this.character.w/2, this.character.y - 60);
    text(`LK: ${(this.lkChance*100).toFixed(0)}% | HK: ${(this.hkChance*100).toFixed(0)}%`, 
         this.character.x + this.character.w/2, this.character.y - 45);
    text(`attackTimer: ${this.character.attackTimer} | recovery: ${this.character.recoveryTimer}`, 
         this.character.x + this.character.w/2, this.character.y - 30);
    
    fill(this.character.isGrounded ? color(0, 255, 0) : color(255, 0, 0));
    text(`Grounded: ${this.character.isGrounded}`, this.character.x + this.character.w/2, this.character.y - 15);
    
    stroke(255, 255, 0, 100);
    strokeWeight(2);
    line(this.character.x + this.character.w/2, this.character.y, opponent.x + opponent.w/2, opponent.y);
    
    pop();
  }
}

let aiController = null;

function initAI(character) {
  aiController = new AIController(character);
  console.log(`AI initialized for ${character.name}`);
}

function updateAI(opponent, groundY) {
  if (aiController) {
    aiController.update(opponent, groundY);
  }
}

function drawAIDebug(opponent) {
  if (aiController && aiController.showDebug) {
    aiController.drawDebug(opponent);
  }
}

function toggleDebug() {
  if (aiController) {
    aiController.showDebug = !aiController.showDebug;
    console.log(`Debug: ${aiController.showDebug ? "ON" : "OFF"}`);
  }
}