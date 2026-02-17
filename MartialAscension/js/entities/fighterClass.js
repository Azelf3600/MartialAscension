class Character {
  constructor(x, y, w, h, color, controls, name = "Fighter", side = 1, archetype = "Controller") {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.standH = h;
    this.crouchH = h * 0.6;
    this.color = color;
    this.name = name;
    this.controls = controls;
    this.archetype = archetype;
    this.consecutiveAirHits = 0;

    // Archetype Stat Calculator
    if (this.archetype === "Offensive") {
      this.maxHp = 1000;
      this.dmgMod = 1.2;
      this.blockMod = 0.4;
      this.blockStun = 12;
    } else if (this.archetype === "Defensive") {
      this.maxHp = 1200;
      this.dmgMod = 0.8;
      this.blockMod = 0.7;
      this.blockStun = 10;
    } else {
      this.maxHp = 800;
      this.dmgMod = 1.0;
      this.blockMod = 0.5;
      this.blockStun = 6;
    }

    this.isBlocking = false;
    this.attackReleased = true;
    this.hp = this.maxHp;

    this.velX = 0;
    this.velY = 0;
    this.speed = width * 0.01;
    this.gravity = height * 0.003;
    this.jumpPower = height * 0.05;
    this.facing = side;
    this.isGrounded = false;

    this.isDashing = false;
    this.dashDirection = 0;
    this.dashTimer = 0;
    this.dashMaxSpeed = 0;
    this.dashTrail = [];
    this.isLauncherSliding = false;
    this.launcherSlideTimer = 0;
    this.launcherSlideSpeed = 0;

    this.isDiving = false;
    this.diveTimer = 0;
    this.diveVelX = 0;
    this.diveVelY = 0;

    this.attacking = null;
    this.hasHit = false;
    this.attackTimer = 0;
    
    this.recoveryTimer = 0;
    this.isPerformingCombo = false;
    this.comboDamageMod = 1.0;

    this.comboHits = [];
    this.currentComboHit = 0;
    this.comboHitTimer = 0;
    this.lastHitIndex = -1;

    this.isHit = false;
    this.hitStun = 0;
    
    this.comboCooldowns = {};
    
    this.isLunging = false;
    this.lungeTimer = 0;
    this.lungeTotalFrames = 0;
    this.lungePhase = "none";
    this.lungePullbackDistance = 0;
    this.lungeBurstDistance = 0;
    this.lungeDirection = 0;
    this.lungeSpeed = 0;
    
    this.isFlying = false;           
    this.canAirDash = false;       
    this.isAirDashing = false;       
    this.airDashTimer = 0;           
    this.airDashSpeed = 0;           
    this.slowFallActive = false;     
    this.flightLaunchTimer = 0; 

    this.isGodSlashing = false;
    this.godSlashTimer = 0;
    this.godSlashPhase = "none"; 

    this.hasUsedJudgment = false;

    this.isPoisonHandsActive = false;
    this.poisonHandsTimer = 0;
    this.poisonHandsDuration = 300; 
    this.poisonHandsCooldownPending = false; 

    this.isPoisoned = false;
    this.poisonDamage = 0;
    this.poisonTimer = 0;
    this.poisonTickInterval = 60;
    this.poisonTickTimer = 0;
    this.poisonAttacker = null;

    // NEW: Poison Flower Field (Lucas Tang)
    this.isPoisonFieldActive = false;   
    this.poisonFieldTimer = 0;          
    this.poisonFieldCooldownPending = false;
    this.isInPoisonField = false;     
    this.poisonFieldDmgTickTimer = 0;   
    this.poisonFieldHealTickTimer = 0;  

    // NEW: Ten Thousand Poison Flower Rain (Lucas Tang signature)
    this.hasUsedPoisonRain = false;     // Once per round
    this.isPoisonRainActive = false;    // Is rain currently raining
    this.poisonRainTimer = 0;           // 5 second duration
    this.poisonRainSpawnTimer = 0;      // Timer between raindrop spawns
  }

  update(opponent, groundY) {
  if (this.hitStun > 0) {
    this.hitStun--;
    this.isHit = true;
    this.attacking = null;
  } else {
    this.isHit = false;
  }

  if (this.recoveryTimer > 0) {
    this.recoveryTimer--;
    this.applyPhysics(groundY);
    return; 
  }

  // Update cooldowns
  for (let comboName in this.comboCooldowns) {
    if (this.comboCooldowns[comboName] > 0) {
      this.comboCooldowns[comboName]--;
    }
  }
  
  // NEW: Update Poison Hands duration and cooldown
  if (this.isPoisonHandsActive && this.poisonHandsTimer > 0) {
    this.poisonHandsTimer--;
    
    // Duration ended
    if (this.poisonHandsTimer <= 0) {
      this.isPoisonHandsActive = false;
      
      // NOW start cooldown if pending
      if (this.poisonHandsCooldownPending) {
        this.comboCooldowns["Poison Hands"] = 120; // 2 seconds
        this.poisonHandsCooldownPending = false;
        console.log("Poison Hands ended. Cooldown started.");
      }
    }
  }

    // NEW: Poison DOT tick (Flame Poison Needle)
if (this.isPoisoned && this.poisonTimer > 0) {
  this.poisonTimer--;
  this.poisonTickTimer--;
  
  // Deal poison damage every second
  if (this.poisonTickTimer <= 0) {
    this.poisonTickTimer = this.poisonTickInterval; // Reset tick timer
    
    // Apply poison damage directly (bypasses block)
    this.hp -= this.poisonDamage;
    if (this.hp < 0) this.hp = 0;
    
    // Show damage indicator
    if (typeof spawnDamageIndicator === 'function') {
      spawnDamageIndicator(
        this.x + this.w / 2, 
        this.y - 20, 
        this.poisonDamage, 
        false
      );
    }
    
    console.log(`Poison tick! ${this.poisonDamage} damage. ${Math.ceil(this.poisonTimer / 60)}s remaining`);
  }
  
  // Poison expired
  if (this.poisonTimer <= 0) {
    this.isPoisoned = false;
    this.poisonDamage = 0;
    this.poisonAttacker = null;
    console.log("Poison expired!");
  }
}

  // NEW: Poison Flower Field - caster update
if (this.isPoisonFieldActive && this.poisonFieldTimer > 0) {
  this.poisonFieldTimer--;
  
  // Get opponent
  let fieldOpponent = (this === player1) ? player2 : player1;
  
  // Apply debuffs to opponent every frame
  fieldOpponent.isInPoisonField = true;
  
  // Heal tick (caster heals 10 per second)
  this.poisonFieldHealTickTimer--;
  if (this.poisonFieldHealTickTimer <= 0) {
    this.poisonFieldHealTickTimer = 60; // Reset every second
    
    // Heal caster (cap at maxHp)
    let healAmount = 10;
    this.hp = min(this.hp + healAmount, this.maxHp);
    
    // Show heal indicator
    if (typeof spawnDamageIndicator === 'function') {
      spawnDamageIndicator(
        this.x + this.w / 2,
        this.y - 20,
        healAmount,
        false
      );
    }
    console.log(`Poison Field heal: +${healAmount} HP`);
  }
  
  // Damage tick (enemy takes 5 per second)
  this.poisonFieldDmgTickTimer--;
  if (this.poisonFieldDmgTickTimer <= 0) {
    this.poisonFieldDmgTickTimer = 60; // Reset every second
    
    let fieldDmg = 5;
    fieldOpponent.hp -= fieldDmg;
    if (fieldOpponent.hp < 0) fieldOpponent.hp = 0;
    
    // Show damage indicator on opponent
    if (typeof spawnDamageIndicator === 'function') {
      spawnDamageIndicator(
        fieldOpponent.x + fieldOpponent.w / 2,
        fieldOpponent.y - 20,
        fieldDmg,
        false
      );
    }
    console.log(`Poison Field damage: -${fieldDmg} HP to opponent`);
  }
  
  // Field expired
  if (this.poisonFieldTimer <= 0) {
    this.isPoisonFieldActive = false;
    fieldOpponent.isInPoisonField = false; // Remove debuff
    
    // Start cooldown
    if (this.poisonFieldCooldownPending) {
      this.comboCooldowns["Poison Flower Field"] = 300; // 5 seconds
      this.poisonFieldCooldownPending = false;
      console.log("Poison Flower Field ended. Cooldown started.");
    }
  }
}

// Clear field debuff if caster's field is no longer active
// (handles edge cases like caster KO)
if (this.isInPoisonField) {
  let fieldCaster = (this === player1) ? player2 : player1;
  if (!fieldCaster.isPoisonFieldActive) {
    this.isInPoisonField = false;
  }
}

// NEW: Ten Thousand Poison Flower Rain - spawn raindrops
if (this.isPoisonRainActive && this.poisonRainTimer > 0) {
  this.poisonRainTimer--;
  this.poisonRainSpawnTimer--;
  
  // Spawn one raindrop per second (every 60 frames)
  if (this.poisonRainSpawnTimer <= 0) {
    this.poisonRainSpawnTimer = 30; // Reset to spawn next drop in 1 second
    
    // Get current enemy position (follows enemy movement)
    let rainTarget = (this === player1) ? player2 : player1;
    
    // Spawn above enemy
    let spawnX = rainTarget.x + rainTarget.w / 2;
    let spawnY = rainTarget.y - 300; // 300px above enemy
    
    spawnProjectile(spawnX, spawnY, 1, this, "poison_rain");
    
    console.log(`Poison Rain drop spawned above enemy! ${Math.ceil(this.poisonRainTimer / 60)}s remaining`);
  }
  
  // Rain ended
  if (this.poisonRainTimer <= 0) {
    this.isPoisonRainActive = false;
    console.log("Ten Thousand Poison Flower Rain ended!");
  }
}

  this.facing = (this.x < opponent.x) ? 1 : -1;
  
  if (this.hitStun <= 0) {
    this.handleMovement(groundY);
    this.handleAttack();
  }
  
  this.applyPhysics(groundY);
}

  handleMovement(groundY) {
  if (this.hitStun > 0) return;

  this.speed = width * 0.002; 
  this.isBlocking = keyIsDown(this.controls.block) && this.isGrounded;
  if (this.isBlocking) this.speed *= 0.3;

  // NEW: Apply Poison Field debuffs to affected character
  if (this.isInPoisonField) {
    this.speed *= 0.5; // Halve walking speed
  }

  // Flight controls
  if (this.isFlying && !this.isGrounded) {
    if (keyIsDown(this.controls.jump) && this.flightLaunchTimer <= 0) {
      this.slowFallActive = true;
      this.velY = 2;
    } else {
      this.slowFallActive = false;
    }
    
    let buffer = (this === player1) ? p1Buffer : p2Buffer;
    if (buffer.checkDoubleTap("FW") && this.canAirDash && !this.isAirDashing) {
      this.isAirDashing = true;
      this.canAirDash = false;
      this.airDashTimer = 15;
      let opponent = (this === player1) ? player2 : player1;
      let targetX = opponent.x + (opponent.facing === 1 ? -150 : opponent.w + 150);
      this.airDashSpeed = (targetX - this.x) / this.airDashTimer;
    }
  }

  // Normal dash (only on ground)
  if (!this.attacking && this.isGrounded) {
    let buffer = (this === player1) ? p1Buffer : p2Buffer;
    
    if (buffer.checkDoubleTap("FW")) {
      this.isDashing = true;
      this.dashDirection = this.facing; 
      this.dashTimer = 18;
      this.dashMaxSpeed = 60;
      
      // NEW: Halve dash speed if in poison field
      let dashSpeed = this.isInPoisonField ? 25 : 50;
      this.velX = this.facing * dashSpeed;
      
    } else if (buffer.checkDoubleTap("BW")) {
      this.isDashing = true;
      this.dashDirection = -this.facing; 
      this.dashTimer = 16;
      this.dashMaxSpeed = 52;
      
      // NEW: Halve dash speed if in poison field
      let dashSpeed = this.isInPoisonField ? 21 : 42;
      this.velX = -this.facing * dashSpeed;
    }
  }

  // Active Dash Momentum
  if (this.isDashing && this.dashTimer > 0) {
    this.dashTimer--;
    
    if (this.dashTimer > this.dashTimer * 0.75) {
      let accel = (this.dashDirection === this.facing) ? 6.0 : 5.5;
      
      // NEW: Halve acceleration if in poison field
      if (this.isInPoisonField) accel *= 0.5;
      
      this.velX += this.dashDirection * accel; 
      
      let currentSpeed = abs(this.velX);
      let maxSpeed = (this.dashDirection === this.facing) ? this.dashMaxSpeed : this.dashMaxSpeed * 0.85;
      
      // NEW: Halve max dash speed if in poison field
      if (this.isInPoisonField) maxSpeed *= 0.5;
      
      if (currentSpeed > maxSpeed) {
        this.velX = this.dashDirection * maxSpeed;
      }
    }
    
    if (this.dashTimer <= 0) {
      this.isDashing = false;
      this.dashDirection = 0;
    }
  }

  // Normal Walking
  if (!this.attacking) {
    if (keyIsDown(this.controls.left)) this.x -= this.speed;
    if (keyIsDown(this.controls.right)) this.x += this.speed;
  }

  this.x += this.velX;
  
  if (this.isDashing) {
    this.velX *= 0.70;
  } else {
    this.velX *= 0.82;
  }
  
  // Crouch
  if (keyIsDown(this.controls.crouch) && this.isGrounded && !this.isLunging) {
    if (this.h !== this.crouchH) {
      this.y += (this.h - this.crouchH);
      this.h = this.crouchH;
    }
  } else {
    if (this.h !== this.standH) {
      this.y -= (this.standH - this.h);
      this.h = this.standH;
    }
  }

  // Normal Jump - BLOCKED by poison field (unless flying)
  if (keyIsDown(this.controls.jump) && this.isGrounded && !this.attacking && !this.isFlying) {
    // NEW: Block jump if in poison field
    if (this.isInPoisonField) {
      console.log("Jump nullified by Poison Flower Field!");
      // Don't jump - do nothing
    } else {
      this.velY = -this.jumpPower;
      this.isGrounded = false;
      this.isDashing = false;
      this.dashTimer = 0;
    }
  }
}

  applyPhysics(groundY) {
    // Handle diving kick movement
    if (this.isDiving && this.diveTimer > 0) {
      this.diveTimer--;
      
      if (this.diveTimer > 35) {
        this.velY += this.gravity;
      }
      else if (this.diveTimer > 25) {
        this.diveVelY += this.gravity * 1.5;
        this.velY = this.diveVelY;
        this.x += this.diveVelX;
      }
      else {
        this.diveVelY += this.gravity * 2.0;
        this.velY = this.diveVelY;
        this.x += this.diveVelX * 1.2;
      }
      
      if (this.y + this.h >= groundY || this.diveTimer <= 0) {
        this.isDiving = false;
        this.diveTimer = 0;
        this.diveVelX = 0;
        this.diveVelY = 0;
      }
    } 
    // Handle air dash teleport
    else if (this.isAirDashing && this.airDashTimer > 0) {
      this.airDashTimer--;
      
      // Move towards target position
      this.x += this.airDashSpeed;
      
      // Maintain height during teleport
      this.velY = 0;
      
      // End air dash
      if (this.airDashTimer <= 0) {
        this.isAirDashing = false;
        this.airDashSpeed = 0;
      }
    }

    // Handle God Slash (no gravity during slash)
    else if (this.isGodSlashing && this.godSlashTimer > 0) {
      this.godSlashTimer--;
  
    // Phase 1: Teleport (first 10 frames)
    if (this.godSlashTimer > 30) {
      this.godSlashPhase = "teleport";
      this.velY = 0; // Freeze in air
    } 
    // Phase 2: Slash (last 30 frames)
    else {
      this.godSlashPhase = "slash";
      this.velY = 15; // Fast downward slash
    }
  
    // End God Slash
    if (this.godSlashTimer <= 0) {
      this.isGodSlashing = false;
      this.godSlashPhase = "none";
    }
  }


    // Normal gravity
    else {
      // NEW: Check flight launch timer
      if (this.flightLaunchTimer > 0) {
        this.flightLaunchTimer--;
        // Don't apply gravity during launch frames
      } else if (!this.slowFallActive) {
        // Only apply gravity after launch period
        this.velY += this.gravity;
      }
    }
    
    this.y += this.velY;

    // Handle lunge movement
    if (this.isLunging && this.lungeTimer > 0) {
      this.lungeTimer--;
      
      let pullbackFrames = 10;
      let burstFrames = 25;
      
      if (this.lungeTimer > burstFrames) {
        // Phase 1: Pullback
        this.lungePhase = "pullback";
        let pullbackPerFrame = this.lungePullbackDistance / pullbackFrames;
        this.x -= this.lungeDirection * pullbackPerFrame;
      } else {
        // Phase 2: Burst forward
        this.lungePhase = "burst";
        let burstPerFrame = this.lungeBurstDistance / burstFrames;
        this.x += this.lungeDirection * burstPerFrame;
      }
      
      if (this.lungeTimer <= 0) {
        this.isLunging = false;
        this.lungePhase = "none";
        this.lungeDirection = 0;
      }
    }

    // Handle launcher slide movement
    if (this.isLauncherSliding && this.launcherSlideTimer > 0) {
      this.launcherSlideTimer--;
      this.x += this.launcherSlideSpeed;
      this.launcherSlideSpeed *= 0.85;
      
      if (this.launcherSlideTimer <= 0) {
        this.isLauncherSliding = false;
        this.launcherSlideSpeed = 0;
      }
    }

    if (this.y + this.h >= groundY) {
      this.y = groundY - this.h;
      this.velY = 0;
      this.isGrounded = true;
      
      // Reset flight state when landing
      if (this.isFlying) {
        this.isFlying = false;
        this.canAirDash = false;
        this.slowFallActive = false;
        this.isAirDashing = false;
      }
      
      this.gravity = height * 0.003;
      this.consecutiveAirHits = 0;
      this.velX = 0;
    }
  }

  handleAttack() {
    if (this.attackTimer > 0) {
      this.attackTimer--;
      
      if (this.isPerformingCombo && this.comboHits.length > 0) {
        this.comboHitTimer--;
        
        if (this.comboHitTimer <= 0) {
          if (this.currentComboHit < this.comboHits.length - 1) {
            this.currentComboHit++;
            this.comboHitTimer = this.comboHits[this.currentComboHit].duration;
            this.hasHit = false;
            this.lastHitIndex = -1;
          } else {
            if (this.hasHit) {
              this.lastHitIndex = this.currentComboHit;
            }
          }
        }
      }
      
      if (this.attackTimer <= 0) {
        this.recoveryTimer = !this.isPerformingCombo ? 12 : 4;
        this.attacking = null;
        this.isPerformingCombo = false;
        this.comboDamageMod = 1.0;
        
        this.comboHits = [];
        this.currentComboHit = 0;
        this.comboHitTimer = 0;
        this.lastHitIndex = -1;
      }
    }
  }

  startAttack(type) {
  if (this.attackTimer <= 2 && !this.isBlocking) { 
    this.attacking = type;
    this.hasHit = false;
    this.recoveryTimer = 0;
    this.attackTimer = (type === "LP" || type === "LK") ? 12 : 22;
    
    // NEW: Apply Poison Hands damage bonus to basic attacks
    if (this.isPoisonHandsActive) {
        // Increase damage multiplier by 50%
          this.comboDamageMod = 1.5; // This will be applied in damage calculation
        } else {
          this.comboDamageMod = 1.0; // Normal
        }
      }
    }

  executeCombo(comboData) {
  // Check cooldown
  if (comboData.cooldown) {
    let cooldownKey = comboData.name;
    if (this.comboCooldowns[cooldownKey] && this.comboCooldowns[cooldownKey] > 0) {
      console.log(`${comboData.name} is on cooldown! Wait ${Math.ceil(this.comboCooldowns[cooldownKey] / 60)} seconds`);
      return;
    }
  }
  
  // Check if this is a movement combo FIRST
  if (comboData.type === "MOVEMENT") {
    this.attacking = null;
    this.attackTimer = 0;
    this.isPerformingCombo = false;
    
    if (comboData.name === "Sword Qi Fly") {
      this.isFlying = true;
      this.canAirDash = true;
      this.isGrounded = false;
      this.velY = -this.jumpPower * 0.8;
      this.flightLaunchTimer = 10;
    }
    
    if (comboData.cooldown) {
      let cooldownKey = comboData.name;
      this.comboCooldowns[cooldownKey] = comboData.cooldown;
    }
    
    this.hasHit = false;
    this.recoveryTimer = 0;
    return;
  }

  // Check if this is a power-up combo
  if (comboData.type === "POWERUP") {
    this.attacking = null;
    this.attackTimer = 0;
    this.isPerformingCombo = false;
  
  if (comboData.name === "Poison Hands") {
    // NEW: Prevent resetting timer if already active
    if (this.isPoisonHandsActive) {
      console.log("Poison Hands is already active!");
      return; // Don't reset the timer
    }
    
    this.isPoisonHandsActive = true;
    this.poisonHandsTimer = comboData.duration; // 300 frames (5 seconds)
    this.poisonHandsCooldownPending = true;
    
    console.log("Poison Hands activated! Damage +50% for 5 seconds");
  }
  
  this.hasHit = false;
  this.recoveryTimer = 0;
  return;
}

  // AOE combos
if (comboData.type === "AOE") {
  this.attacking = null;
  this.attackTimer = 0;
  this.isPerformingCombo = false;
  
  if (comboData.name === "Poison Flower Field") {
    // Consume Poison Hands
    this.isPoisonHandsActive = false;
    this.poisonHandsTimer = 0;
    if (this.poisonHandsCooldownPending) {
      this.comboCooldowns["Poison Hands"] = 120;
      this.poisonHandsCooldownPending = false;
    }
    
    // Activate field
    this.isPoisonFieldActive = true;
    this.poisonFieldTimer = comboData.duration; // 300 frames
    this.poisonFieldCooldownPending = true;
    
    // Set up tick timers
    this.poisonFieldDmgTickTimer = 60;  // First damage tick in 1 second
    this.poisonFieldHealTickTimer = 60; // First heal tick in 1 second
    
    console.log("Poison Flower Field activated!");
  }
  
  this.hasHit = false;
  this.recoveryTimer = 0;
  return;
}
  
  this.attacking = comboData.name;
  this.isPerformingCombo = true;
  this.comboDamageMod = comboData.damageMult;

  if (typeof damageIndicators !== 'undefined') {
    damageIndicators = damageIndicators.filter(ind => ind.life < 100);
  }

  this.comboHits = comboData.hits || [];
  this.currentComboHit = 0;

  if (this.comboHits.length > 0) {
    let totalDuration = this.comboHits.reduce((sum, hit) => sum + hit.duration, 0);
    this.attackTimer = totalDuration;
    this.comboHitTimer = this.comboHits[0].duration;
  } else {
    this.attackTimer = 25;
    this.comboHitTimer = 25;
  }

  // Launcher slide
  if (comboData.name === "Launcher") {
    this.isLauncherSliding = true;
    this.launcherSlideTimer = 15;
    this.launcherSlideSpeed = this.facing * 10;
  }

  // Diving Kick
  if (comboData.name === "Diving Kick") {
    this.isDiving = true;
    this.diveTimer = 43;
    this.isGrounded = false;
    this.velY = -this.jumpPower * 1.2;
    this.diveVelX = this.facing * 12;
    this.diveVelY = 0;
  }

  //Execute Ethan Li Combo

  // Sword Qi Strike (Projectile)
  if (comboData.name === "Sword Qi Strike") {
    let spawnX = this.facing === 1 ? 
      this.x + this.w : 
      this.x;
    let spawnY = this.y + 50;
    
    spawnProjectile(spawnX, spawnY, this.facing, this, "sword_qi");
  }

  // Sword Qi Lunge
  if (comboData.name === "Sword Qi Lunge") {
    if (this.h !== this.standH) {
      this.y -= (this.standH - this.h);
      this.h = this.standH;
    }
    
    this.isLunging = true;
    this.lungeTimer = 35;
    this.lungeTotalFrames = 35;
    this.lungePullbackDistance = 200;
    this.lungeBurstDistance = 400;
    this.lungeDirection = this.facing;
  }

  // Sword God Slash
  if (comboData.name === "Sword God Slash") {
    this.isGodSlashing = true;
    this.godSlashTimer = 40; // Total duration
    this.godSlashPhase = "teleport"; // Start with teleport
  
    // Calculate teleport position (in front of enemy)
    let opponent = (this === player1) ? player2 : player1;
    let teleportX = opponent.x + (opponent.facing === 1 ? opponent.w + 100 : -100);
    let teleportY = opponent.y - 150; // Above the enemy
  
    // Instant teleport
    this.x = teleportX;
    this.y = teleportY;
  
    // Stop all movement
    this.velX = 0;
    this.velY = 0;
  
    // Phase transition happens in applyPhysics based on timer
  }

  // Sword God Judgment (Signature)
  if (comboData.name === "Sword God Judgment") {
    // Mark as used for this round
    this.hasUsedJudgment = true;
  
    // Calculate spawn position (top of screen, above enemy)
    let opponent = (this === player1) ? player2 : player1;
    let spawnX = opponent.x + opponent.w / 2; // Centered on enemy
    let spawnY = -200; // Above screen
  
    // Spawn judgment beam
    spawnProjectile(spawnX, spawnY, 1, this, "judgment");
  }

  // Set cooldown
  if (comboData.cooldown) {
    let cooldownKey = comboData.name;
    this.comboCooldowns[cooldownKey] = comboData.cooldown;
  }

  this.hasHit = false;
  this.recoveryTimer = 0;

  //Execute Lucas Tang Combo

  //Poison Qi Palm
  if (comboData.name === "Poison Qi Palm") {
  // End Poison Hands early
  this.isPoisonHandsActive = false;
  this.poisonHandsTimer = 0;
  
  // Start cooldown for Poison Hands if it was pending
  if (this.poisonHandsCooldownPending) {
    this.comboCooldowns["Poison Hands"] = 120; // 2 seconds
    this.poisonHandsCooldownPending = false;
  }
  
  // Spawn projectile
  let spawnX = this.facing === 1 ? 
    this.x + this.w : 
    this.x;
  let spawnY = this.y + 50; // Same height as Sword Qi Strike
  
  spawnProjectile(spawnX, spawnY, this.facing, this, "poison_qi");
  
  console.log("Poison Qi Palm fired! Poison Hands ended.");
  }

  if (comboData.name === "Flame Poison Needle") {
    let spawnX = this.facing === 1 ? 
      this.x + this.w : 
      this.x;
    let spawnY = this.y + 50;
  
    spawnProjectile(spawnX, spawnY, this.facing, this, "flame_needle");
  }

  // Ten Thousand Poison Flower Rain (Lucas Tang Signature)
  if (comboData.name === "Ten Thousand Poison Flower Rain") {
    // Mark as used
      this.hasUsedPoisonRain = true;
  
    // End Poison Flower Field early
      this.isPoisonFieldActive = false;
      this.poisonFieldTimer = 0;
  
  // Remove field debuff from opponent
    let rainOpponent = (this === player1) ? player2 : player1;
    rainOpponent.isInPoisonField = false;
  
  // Start cooldown for field if pending
  if (this.poisonFieldCooldownPending) {
    this.comboCooldowns["Poison Flower Field"] = 300;
    this.poisonFieldCooldownPending = false;
  }
  
    // Activate rain
    this.isPoisonRainActive = true;
    this.poisonRainTimer = 300;     // 5 seconds
    this.poisonRainSpawnTimer = 0;  // Spawn first drop immediately
  
    console.log("Ten Thousand Poison Flower Rain activated!");
  }
} 

draw() {
  push();
  
  // Dash trail
  if (this.isDashing && this.dashTimer > 0) {
    for (let i = 1; i <= 3; i++) {
      let trailX = this.x - (this.velX * i * 0.3);
      let alpha = 100 - (i * 25);
      
      push();
      fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], alpha);
      noStroke();
      rect(trailX, this.y, this.w, this.h, 5);
      pop();
    }
    
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = 'rgba(255, 255, 255, 0.8)';
  }
  
  // Launcher slide trail
  if (this.isLauncherSliding && this.launcherSlideTimer > 0) {
    for (let i = 1; i <= 4; i++) {
      let trailX = this.x - (this.launcherSlideSpeed * i * 0.25); 
      let alpha = 120 - (i * 30);
      
      push();
      fill(255, 165, 0, alpha);
      noStroke();
      rect(trailX, this.y, this.w, this.h, 5);
      pop();
    }
    
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = 'rgba(255, 165, 0, 0.9)';
  }
  
  // Lunge trail
  if (this.isLunging && this.lungeTimer > 0) {
    let trailCount = this.lungePhase === "burst" ? 5 : 2;
    
    for (let i = 1; i <= trailCount; i++) {
      let trailX = this.lungePhase === "burst" ? 
        this.x - (this.lungeDirection * i * 30) : 
        this.x + (this.lungeDirection * i * 15);
      
      let alpha = this.lungePhase === "burst" ? 
        150 - (i * 30) : 
        100 - (i * 40);
      
      push();
      fill(255, 200, 200, alpha);
      noStroke();
      rect(trailX, this.y, this.w, this.h, 5);
      pop();
    }
    
    if (this.lungePhase === "burst") {
      drawingContext.shadowBlur = 25;
      drawingContext.shadowColor = 'rgba(255, 100, 100, 0.9)';
    }
  }
  
  // Flight effects (Ethan Li only via combo check)
  if (this.isFlying && !this.isGrounded) {
    // Slow fall effect
    if (this.slowFallActive) {
      push();
      noFill();
      stroke(100, 150, 255, 150);
      strokeWeight(3);
      
      let pulseSize = sin(frameCount * 0.2) * 10;
      rect(this.x, this.y, this.w + pulseSize, this.h + pulseSize, 5);
      
      for (let i = 0; i < 3; i++) {
        let particleX = this.x + this.w/2 + random(-20, 20);
        let particleY = this.y + this.h + random(0, 20);
        fill(150, 200, 255, 100);
        noStroke();
        ellipse(particleX, particleY, 5, 5);
      }
      pop();
    }
    
    // Air dash teleport effect
    if (this.isAirDashing) {
      push();
      for (let i = 1; i <= 3; i++) {
        let trailX = this.x - (this.airDashSpeed * i * 2);
        let alpha = 150 - (i * 50);
        
        fill(255, 255, 255, alpha);
        noStroke();
        rect(trailX, this.y, this.w, this.h, 5);
      }
      
      drawingContext.shadowBlur = 30;
      drawingContext.shadowColor = 'rgba(255, 255, 255, 1.0)';
      pop();
    }
    
    // General flight glow
    if (!this.isAirDashing) {
      drawingContext.shadowBlur = 15;
      drawingContext.shadowColor = 'rgba(200, 220, 255, 0.6)';
    }
  }
  
// God Slash effect
if (this.isGodSlashing && this.godSlashTimer > 0) {
  if (this.godSlashPhase === "teleport") {
    // Teleport flash (white pulsing rings)
    push();
    drawingContext.shadowBlur = 50;
    drawingContext.shadowColor = 'rgba(255, 255, 255, 1.0)';
    
    for (let i = 0; i < 3; i++) {
      let ringSize = 50 + (i * 30);
      noFill();
      stroke(255, 255, 255, 200 - (i * 60));
      strokeWeight(5);
      ellipse(this.x + this.w/2, this.y + this.h/2, ringSize, ringSize);
    }
    pop();
  } else if (this.godSlashPhase === "slash") {
    // Slash trail (diagonal red line)
    push();
    
    // Calculate slash progress
    let slashProgress = map(this.godSlashTimer, 30, 0, 0, 1);
    
    // NEW: Flip angles based on facing direction
    let angle;
    if (this.facing === 1) {
      // Facing right: 1 o'clock to 5 o'clock
      angle = map(slashProgress, 0, 1, -20, 60);
    } else {
      // Facing left: 11 o'clock to 7 o'clock
      angle = map(slashProgress, 0, 1, 210, 120);
    }
    
    let angleRad = radians(angle);
    
    // Anchor at character center
    let anchorX = this.x + this.w/2;
    let anchorY = this.y + this.h/2;
    
    // Draw glowing slash line
    drawingContext.shadowBlur = 30;
    drawingContext.shadowColor = 'rgba(255, 0, 0, 1.0)';
    
    stroke(255, 50, 50, 250);
    strokeWeight(40);
    strokeCap(ROUND);
    
    let endX = anchorX + cos(angleRad) * 200;
    let endY = anchorY + sin(angleRad) * 200;
    
    line(anchorX, anchorY, endX, endY);
    
    // Add energy particles along slash
    for (let i = 0; i < 5; i++) {
      let t = random(1);
      let particleX = lerp(anchorX, endX, t);
      let particleY = lerp(anchorY, endY, t);
      
      fill(255, 100, 100, 200);
      noStroke();
      ellipse(particleX, particleY, 10, 10);
    }
    
    pop();
  }
}

  // Character outline stroke
  strokeWeight(2);
  if (this.isHit) stroke(255, 0, 0);
  else if (this.recoveryTimer > 0) stroke(100);
  else if (this.attackTimer > 0) stroke(255, 255, 0);
  else if (this.isDashing || this.isLauncherSliding || this.isLunging) stroke(255, 255, 255, 200);
  else if (this.isFlying) stroke(150, 200, 255, 200);
  else if (this.isGodSlashing) stroke(255, 0, 0, 255);
  else if (this.isPoisonFieldActive) stroke(0, 255, 80, 255); // NEW: Deep green outline
  else if (this.isPoisonHandsActive) stroke(0, 255, 0, 200);  // Keep existing
  else stroke(0);

  // Character body
  fill(this.color);
  if (this.hp <= 0) {
    rect(this.x, this.y + this.h - 5, this.w, 5, 2);
  } else {
    rect(this.x, this.y, this.w, this.h, 5);
    fill(0);
    let eyeX = (this.facing === 1) ? (this.x + this.w - 15) : (this.x + 5);
    rect(eyeX, this.y + 10, 10, 10);
  }

  // Draw hitbox and block indicator
  if (this.hp > 0) {
    if (this.attackTimer > 0 && this.attacking !== "Sword Qi Fly") {
      this.drawHitbox();
    }
    
    if (this.isBlocking) {
      noFill();
      stroke(0, 200, 255, 200);
      strokeWeight(6);
      let shieldX = (this.facing === 1) ? this.x + this.w : this.x;
      line(shieldX, this.y, shieldX, this.y + this.h);
    }
  }
  
  pop();

  // Poison Hands effect (Lucas Tang)
if (this.isPoisonHandsActive && this.poisonHandsTimer > 0) {
  push();
  
  // Green glowing aura
  drawingContext.shadowBlur = 25;
  drawingContext.shadowColor = 'rgba(0, 255, 0, 0.8)';
  
  // Pulsing green outline
  let pulseAlpha = 150 + sin(frameCount * 0.2) * 100;
  noFill();
  stroke(0, 255, 0, pulseAlpha);
  strokeWeight(4);
  rect(this.x, this.y, this.w, this.h, 5);
  
  // Green particles around hands
  for (let i = 0; i < 3; i++) {
    let handX = (this.facing === 1) ? 
      this.x + this.w + random(-10, 10) : 
      this.x + random(-10, 10);
    let handY = this.y + this.h * 0.4 + random(-20, 20);
    
    fill(0, 255, 0, random(100, 200));
    noStroke();
    ellipse(handX, handY, random(5, 12), random(5, 12));
  }
  
  // Timer indicator (optional - shows remaining time)
  let timeLeft = Math.ceil(this.poisonHandsTimer / 60);
  fill(0, 255, 0, 200);
  noStroke();
  textAlign(CENTER, BOTTOM);
  textSize(14);
  text(`POISON: ${timeLeft}s`, this.x + this.w/2, this.y - 10);
  
  pop();
  }

  // Poison DOT effect (Flame Poison Needle)
  if (this.isPoisoned && this.poisonTimer > 0) {
  push();
  
  // Red/orange poison aura
  drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = 'rgba(255, 80, 0, 0.8)';
  
  // Pulsing red-orange outline
  let pulseAlpha = 120 + sin(frameCount * 0.3) * 100;
  noFill();
  stroke(255, 80, 0, pulseAlpha);
  strokeWeight(3);
  rect(this.x, this.y, this.w, this.h, 5);
  
  // Fire particles rising from body
  for (let i = 0; i < 4; i++) {
    let particleX = this.x + random(0, this.w);
    let particleY = this.y + random(0, this.h);
    fill(255, random(50, 150), 0, random(100, 200));
    noStroke();
    ellipse(particleX, particleY, random(4, 10), random(4, 10));
  }
  
  // Poison timer indicator
  let timeLeft = Math.ceil(this.poisonTimer / 60);
  fill(255, 100, 0, 200);
  noStroke();
  textAlign(CENTER, BOTTOM);
  textSize(14);
  text(`POISON: ${timeLeft}s`, this.x + this.w/2, this.y - 25);
  
    pop();
  }

  // Poison Flower Field - Caster glow effect
  if (this.isPoisonFieldActive && this.poisonFieldTimer > 0) {
    push();
  
    // Deep green aura (stronger than Poison Hands)
    drawingContext.shadowBlur = 35;
    drawingContext.shadowColor = 'rgba(0, 200, 50, 1.0)';
  
    // Double pulsing outline
    let pulse1 = 150 + sin(frameCount * 0.15) * 100;
    let pulse2 = 150 + sin(frameCount * 0.15 + PI) * 100; // Offset pulse
  
    noFill();
    stroke(0, 255, 80, pulse1);
    strokeWeight(5);
    rect(this.x - 3, this.y - 3, this.w + 6, this.h + 6, 5);
  
    stroke(100, 255, 150, pulse2);
    strokeWeight(3);
    rect(this.x - 6, this.y - 6, this.w + 12, this.h + 12, 5);
  
    // Rising green particles (healing effect)
  for (let i = 0; i < 5; i++) {
    let particleX = this.x + random(0, this.w);
    let particleY = this.y + random(0, this.h);
    fill(0, 255, 100, random(150, 255));
    noStroke();
    ellipse(particleX, particleY, random(4, 10), random(4, 10));
  }
  
  // Timer
  let timeLeft = Math.ceil(this.poisonFieldTimer / 60);
  fill(0, 255, 80, 220);
  noStroke();
  textAlign(CENTER, BOTTOM);
  textSize(14);
  text(`FIELD: ${timeLeft}s`, this.x + this.w/2, this.y - 30);
  
  pop();
}

// Poison Flower Field - Debuffed enemy effect
if (this.isInPoisonField) {
  push();
  
  // Sickly green tint on affected character
  drawingContext.shadowBlur = 15;
  drawingContext.shadowColor = 'rgba(0, 180, 0, 0.6)';
  
  let debuffAlpha = 80 + sin(frameCount * 0.1) * 60;
  noFill();
  stroke(0, 200, 0, debuffAlpha);
  strokeWeight(3);
  rect(this.x, this.y, this.w, this.h, 5);
  
  // Downward particles (suppression effect)
  for (let i = 0; i < 3; i++) {
    let particleX = this.x + random(0, this.w);
    let particleY = this.y + random(0, this.h * 0.5);
    fill(0, 180, 0, random(80, 150));
    noStroke();
    ellipse(particleX, particleY, random(3, 7), random(3, 7));
  }
  
    pop();
  }
}

  drawHitbox() {
    let data = this.getHitboxData();
    if (!data.shapes || data.shapes.length === 0) return;

    if (this.hasHit) fill(255, 255, 255, 100); 
    else fill(data.col);
    noStroke();
    
    for (let box of data.shapes) {
      rect(box.x, box.y, box.w, box.h);
    }
  }

  getHitboxData() {
    return getHitboxData(this);
  }
}