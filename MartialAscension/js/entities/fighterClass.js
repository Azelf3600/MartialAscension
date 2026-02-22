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
      this.blockMod = 0.3;
      this.blockStun = 12;
    } else if (this.archetype === "Defensive") {
      this.maxHp = 1200;
      this.dmgMod = 0.6;
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

    this.isPoisonFieldActive = false;   
    this.poisonFieldTimer = 0;          
    this.poisonFieldCooldownPending = false;
    this.isInPoisonField = false;     
    this.poisonFieldDmgTickTimer = 0;   
    this.poisonFieldHealTickTimer = 0;  
    this.canPoisonFieldTeleport = false; // ✅ NEW: Can teleport once per field

    this.hasUsedPoisonRain = false;     
    this.isPoisonRainActive = false;    
    this.poisonRainTimer = 0;           
    this.poisonRainSpawnTimer = 0;      

    this.isAzureScalesActive = false;
    this.azureScalesTimer = 0;
    this.azureScalesDuration = 300; 
    this.azureScalesCooldownPending = false;

    this.isTortoiseBodyActive = false;
    this.tortoiseBodyTimer = 0;
    this.tortoiseBodyDuration = 300; 
    this.tortoiseBodyCooldownPending = false;

    this.isOceanMendingActive = false;
    this.oceanMendingTimer = 0;
    this.oceanMendingDuration = 180; 

    this.isSeaDragonCharging = false;
    this.seaDragonTimer = 0;
    this.seaDragonPhase = "none"; 
    this.seaDragonDistanceTraveled = 0;
    this.seaDragonMaxDistance = 800;
    this.seaDragonSpeed = 0;
    this.seaDragonDirection = 0;
    this.seaDragonTarget = null; 
    this.seaDragonDragStunTimer = 0; 

    this.hasUsedAzureDragon = false; 
    this.isAzureDragonActive = false;
    this.azureDragonTimer = 0;
    this.azureDragonPhase = "none"; 
    this.azureDragonIndicatorX = 0;
    this.azureDragonIndicatorY = 0;
    this.azureDragonTargetX = 0;
    this.azureDragonTargetY = 0;

    this.isDemonicAwakeningActive = false;
    this.demonicAwakeningTimer = 0;
    this.demonicAwakeningDuration = 300;
    this.demonicAwakeningCooldownPending = false;
    this.isDemonicStepsActive = false;
    this.demonicStepsTimer = 0;
    this.demonicStepsDirection = 0;
    this.demonicStepsSpeed = 0;
    this.demonicStepsDistanceTraveled = 0;
    this.demonicStepsMaxDistance = 500; 
    this.demonicStepsTargetX = 0;
    this.demonicStepsNextAttackBonus = false;
    this.isDemonicClawActive = false;
    this.demonicClawTimer = 0;
    this.demonicClawPhase = "none"; 
    this.demonicClawIndicatorX = 0;
    this.demonicClawIndicatorY = 0;
    this.demonicClawOwnerLocked = false; 
    this.isDemonicAbyssActive = false;
    this.demonicAbyssTimer = 0;
    this.demonicAbyssDuration = 180; // 5 seconds
    this.demonicAbyssCooldownPending = false;
    this.demonicAbyssRange = 300; // 300px range
    this.demonicAbyssDmgTickTimer = 0; // Damage tick timer
    this.isInDemonicAbyss = false; // ✅ NEW: Debuff flag for being pulled
    this.hasUsedAnnihilation = false; // Once per round flag
    this.isAnnihilationMarked = false; // Is this character marked?
    this.annihilationTimer = 0; // 8 second timer
    this.annihilationDuration = 480; // 8 seconds
    this.annihilationCumulativeDamage = 0; // Track damage dealt
    this.annihilationCaster = null; // Who cast the mark
    this.hasUsedAnnihilation = false;
    this.isAnnihilationMarked = false;
    this.annihilationTimer = 0;
    this.annihilationDuration = 480;
    this.annihilationCumulativeDamage = 0;
    this.annihilationCaster = null;
    this.annihilationExploding = false; // ✅ NEW
    this.annihilationExplosionTimer = 0; // ✅ NEW
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

    // NEW: Azure Dragon Scales duration and cooldown
if (this.isAzureScalesActive && this.azureScalesTimer > 0) {
  this.azureScalesTimer--;
  
  // Duration ended
  if (this.azureScalesTimer <= 0) {
    this.isAzureScalesActive = false;
    
    // Start cooldown
    if (this.azureScalesCooldownPending) {
      this.comboCooldowns["Azure Dragon Scales"] = 300; // 5 seconds
      this.azureScalesCooldownPending = false;
      console.log("Azure Dragon Scales ended. Cooldown started.");
    }
  }
}

// NEW: Undying Tortoise Body duration and cooldown
if (this.isTortoiseBodyActive && this.tortoiseBodyTimer > 0) {
  this.tortoiseBodyTimer--;
  
  // Duration ended
  if (this.tortoiseBodyTimer <= 0) {
    this.isTortoiseBodyActive = false;
    
    // Start cooldown
    if (this.tortoiseBodyCooldownPending) {
      this.comboCooldowns["Undying Tortoise Body"] = 300; // 5 seconds
      this.tortoiseBodyCooldownPending = false;
      console.log("Undying Tortoise Body ended. Cooldown started.");
    }
  }
}

// NEW: Ocean Mending Water duration
if (this.isOceanMendingActive && this.oceanMendingTimer > 0) {
  this.oceanMendingTimer--;
  
  // Clear debuffs every frame while active
  this.isPoisoned = false;
  this.poisonDamage = 0;
  this.poisonTimer = 0;
  this.isInPoisonField = false;
  
  // Duration ended
  if (this.oceanMendingTimer <= 0) {
    this.isOceanMendingActive = false;
    console.log("Ocean Mending Water debuff immunity ended.");
  }
}

// NEW: Demonic Heaven's Awakening duration and cooldown
if (this.isDemonicAwakeningActive && this.demonicAwakeningTimer > 0) {
  this.demonicAwakeningTimer--;
  
  // Duration ended
  if (this.demonicAwakeningTimer <= 0) {
    this.isDemonicAwakeningActive = false;
    
    // Start cooldown
    if (this.demonicAwakeningCooldownPending) {
      this.comboCooldowns["Demonic Heavens Awakening"] = 180; // 3 seconds
      this.demonicAwakeningCooldownPending = false;
      console.log("Demonic Heaven's Awakening ended. Cooldown started.");
    }
  }
}

// NEW: Demonic Heaven's Abyss duration and effects
if (this.isDemonicAbyssActive && this.demonicAbyssTimer > 0) {
  this.demonicAbyssTimer--;
  
  // Get opponent
  let abyssOpponent = (this === player1) ? player2 : player1;
  
  // Check if opponent is in range
  let distanceToOpponent = abs(abyssOpponent.x - this.x);
  let isInRange = false;
  
  // Check if opponent is in front and within 300px
  if (this.facing === 1 && abyssOpponent.x > this.x && distanceToOpponent <= this.demonicAbyssRange) {
    isInRange = true;
  } else if (this.facing === -1 && abyssOpponent.x < this.x && distanceToOpponent <= this.demonicAbyssRange) {
    isInRange = true;
  }
  
  if (isInRange) {
    abyssOpponent.isInDemonicAbyss = true;
    // Gravitational pull (slow pull towards caster)
    let pullStrength = 2; // Slow pull speed
    let pullDirection = (abyssOpponent.x > this.x) ? -pullStrength : pullStrength;
    abyssOpponent.x += pullDirection;
    
    // Damage tick (10 damage per second)
    this.demonicAbyssDmgTickTimer--;
    if (this.demonicAbyssDmgTickTimer <= 0) {
      this.demonicAbyssDmgTickTimer = 60; // Reset every second
      
      let abyssDmg = 10;
      abyssOpponent.hp -= abyssDmg;
      if (abyssOpponent.hp < 0) abyssOpponent.hp = 0;
      
      if (typeof spawnDamageIndicator === 'function') {
        spawnDamageIndicator(
          abyssOpponent.x + abyssOpponent.w / 2,
          abyssOpponent.y - 20,
          abyssDmg,
          false
        );
      }
      console.log(`Demonic Abyss damage: -${abyssDmg} HP to opponent`);
    }
  } else {
    // ✅ NEW: Clear debuff when out of range
    abyssOpponent.isInDemonicAbyss = false;
  }
  
  // Duration ended
  if (this.demonicAbyssTimer <= 0) {
    this.isDemonicAbyssActive = false;
    this.demonicClawOwnerLocked = false;
    abyssOpponent.isInDemonicAbyss = false;

    
    // ✅ NEW: Explosion if cast during Awakening
    if (this.isDemonicAwakeningActive && isInRange) {
      // Apply explosion stun (3 seconds)
      abyssOpponent.hitStun = 180; // 3 seconds
      abyssOpponent.isHit = true;
      console.log("Demonic Abyss explosion! Enemy stunned for 3 seconds!");
    }
    
    // Start cooldown
    if (this.demonicAbyssCooldownPending) {
      this.comboCooldowns["Demonic Heavens Abyss"] = 300; // 5 seconds
      this.demonicAbyssCooldownPending = false;
      console.log("Demonic Heaven's Abyss ended. Cooldown started.");
    }
  }
}
if (this.isInDemonicAbyss) {
  let abyssCaster = (this === player1) ? player2 : player1;
  if (!abyssCaster.isDemonicAbyssActive) {
    this.isInDemonicAbyss = false;
  }
}

// ✅ NEW: Demonic Heaven Annihilation mark countdown
if (this.isAnnihilationMarked && this.annihilationTimer > 0) {
  this.annihilationTimer--;
  
// Mark expired - EXPLOSION
if (this.annihilationTimer <= 0) {
  this.isAnnihilationMarked = false;
  
  // ✅ NEW: Trigger explosion visual
  this.annihilationExploding = true;
  this.annihilationExplosionTimer = 30; // 0.5 second explosion visual
  
  // Apply cumulative damage
  let explosionDamage = this.annihilationCumulativeDamage;
  this.hp -= explosionDamage;
  if (this.hp < 0) this.hp = 0;
  
  if (typeof spawnDamageIndicator === 'function') {
    spawnDamageIndicator(
      this.x + this.w / 2,
      this.y - 50,
      Math.floor(explosionDamage),
      false
    );
  }
  
  console.log(`ANNIHILATION EXPLOSION! ${Math.floor(explosionDamage)} damage dealt!`);
  
  this.annihilationCumulativeDamage = 0;
  this.annihilationCaster = null;
}

// ✅ NEW: Explosion visual timer
if (this.annihilationExploding && this.annihilationExplosionTimer > 0) {
  this.annihilationExplosionTimer--;
  
    if (this.annihilationExplosionTimer <= 0) {
      this.annihilationExploding = false;
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
    
  // NEW: Skip damage if Ocean Mending is active
  if (fieldOpponent.isOceanMendingActive) {
    console.log("Poison Field damage blocked by Ocean Mending Water!");
  } else {
    let fieldDmg = 10;
    fieldOpponent.hp -= fieldDmg;
    if (fieldOpponent.hp < 0) fieldOpponent.hp = 0;
    
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
}
  
  // Field expired
  if (this.poisonFieldTimer <= 0) {
    this.isPoisonFieldActive = false;
    fieldOpponent.isInPoisonField = false; // Remove debuff
    this.canPoisonFieldTeleport = false;
    
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
  if (this.demonicClawOwnerLocked) return;
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

  // ✅ NEW: Poison Field Teleport (once per field activation)
if (this.isPoisonFieldActive && this.canPoisonFieldTeleport && this.isGrounded && !this.attacking) {
  let buffer = (this === player1) ? p1Buffer : p2Buffer;
  
  if (buffer.checkDoubleTap("FW")) {
    // Teleport behind enemy
    let opponent = (this === player1) ? player2 : player1;
    
    // Position behind enemy (opposite side of their facing)
    let teleportX = opponent.facing === 1 ? 
      opponent.x - 150 : // Behind if enemy faces right
      opponent.x + opponent.w + 150; // Behind if enemy faces left
    
    this.x = teleportX;
    
    // Consume teleport
    this.canPoisonFieldTeleport = false;
    
    console.log("Poison Field Teleport! Behind enemy!");
    
    // Prevent normal dash from also triggering
    return;
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

    //NEW: Handle Demonic Heaven's Steps teleport dash
    else if (this.isDemonicStepsActive && this.demonicStepsTimer > 0) {
      this.demonicStepsTimer--;
  
    // Move towards target position
      this.x += this.demonicStepsSpeed;
      this.demonicStepsDistanceTraveled += Math.abs(this.demonicStepsSpeed);
  
    // Maintain ground position (no gravity)
    this.velY = 0;
  
    // End dash
    if (this.demonicStepsTimer <= 0 || this.demonicStepsDistanceTraveled >= this.demonicStepsMaxDistance) {
      this.isDemonicStepsActive = false;
      this.demonicStepsSpeed = 0;
      this.demonicStepsDistanceTraveled = 0;
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

    //Handle Sea Dragon Charge movement
    if (this.isSeaDragonCharging && this.seaDragonTimer > 0) {
      this.seaDragonTimer--;
      this.seaDragonDistanceTraveled += Math.abs(this.seaDragonSpeed);
  
    // Phase 1: Slow charge (first 100px)
    if (this.seaDragonDistanceTraveled < 100) {
      this.seaDragonPhase = "charge";
      this.seaDragonSpeed = this.seaDragonDirection * 5; // Slow speed
    } 
    // Phase 2: Burst acceleration (100px to 800px)
    else {
      this.seaDragonPhase = "burst";
      this.seaDragonSpeed = this.seaDragonDirection * 15; // Fast speed (not as fast as projectiles)
    }
  
    // Move forward
    this.x += this.seaDragonSpeed;
  
    // Drag enemy if grabbed
    if (this.seaDragonTarget) {
      this.seaDragonTarget.x += this.seaDragonSpeed;
      this.seaDragonTarget.isHit = true;
      this.seaDragonTarget.hitStun = 999; // Locked during drag
     }
  
    // End charge at max distance OR timer expires
    if (this.seaDragonDistanceTraveled >= this.seaDragonMaxDistance || this.seaDragonTimer <= 0) {
      this.isSeaDragonCharging = false;
      this.seaDragonPhase = "none";
      this.seaDragonSpeed = 0;
    
    // Release enemy and apply post-drag stun
    if (this.seaDragonTarget) {
      this.seaDragonTarget.hitStun = 60; // 1 second stun
      this.seaDragonTarget = null;
    }
    
      console.log("Sea Dragon Charge ended!");
     }
    }

    //Handle Azure Flowing Dragon phases
if (this.isAzureDragonActive && this.azureDragonTimer > 0) {
  this.azureDragonTimer--;
  
  // Phase 1: Submerge (0-10 frames) - Character sinks into ground
  if (this.azureDragonTimer > 80) {
    this.azureDragonPhase = "submerge";
    
    // Sink into ground (move down)
    this.y += 5; // Sink speed
    
    // Disable gravity during submerge
    this.velY = 0;
  }
  
  // Phase 2: Indicator (10-70 frames = 1 second) - Show indicator at target location
  else if (this.azureDragonTimer > 50) {
    this.azureDragonPhase = "indicator";
  }
  
  // Phase 3: Emerge (70-120 frames = ~0.8 seconds) - Rise from indicator position
  else if (this.azureDragonTimer > 0) {
    // Transition to emerge on first frame
    if (this.azureDragonPhase === "indicator") {
      this.azureDragonPhase = "emerge";
      
      // Teleport character to indicator position (underground)
      this.x = this.azureDragonTargetX - this.w / 2; // Center on indicator
      this.y = this.azureDragonTargetY + 50; // Start below ground
      
      console.log("Azure Dragon emerging from ground!");
    }
    
    // Rise upward quickly (launcher speed)
    this.velY = -6; // Fast upward speed
    this.y += this.velY;
    
    // Stop at ground level
    let groundY = height - 100;
    if (this.y + this.h <= groundY) {
      // Continue rising
    } else {
      // Reached surface - end move
      this.y = groundY - this.h;
      this.velY = 0;
      this.isGrounded = true;
    }
  }
  
    // Phase 4: End
    if (this.azureDragonTimer <= 0) {
      this.isAzureDragonActive = false;
      this.azureDragonPhase = "none";
      this.velY = 0;
      console.log("Azure Flowing Dragon ended!");
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
  if (this.demonicClawOwnerLocked) return;
  if (this.attackTimer <= 2 && !this.isBlocking) { 
    this.attacking = type;
    this.hasHit = false;
    this.recoveryTimer = 0;
    this.attackTimer = (type === "LP" || type === "LK") ? 12 : 22;
    
    // NEW: Apply Poison Hands damage bonus to basic attacks
    if (this.isPoisonHandsActive) {
      this.comboDamageMod = 1.5; // This will be applied in damage calculation
      }
    else if (this.demonicStepsNextAttackBonus) {
      this.comboDamageMod = 1.5; // +50% damage
      this.demonicStepsNextAttackBonus = false; // Consume bonus
      console.log("Demonic Steps bonus applied! +50% damage on this attack!");
    } else {
          this.comboDamageMod = 1.0; // Normal
        }
      }
    }

  executeCombo(comboData) {
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

      // ✅ NEW: Demonic Heaven's Steps (Forward or Backward)
    if (comboData.isDemonicSteps) {
      let opponent = (this === player1) ? player2 : player1;
    
      if (comboData.stepsDirection === "forward") {
        // Teleport in front of enemy
        this.demonicStepsTargetX = this.x + (this.facing * 500);
        this.demonicStepsDirection = 1; // Moving forward
        console.log("Demonic Heaven's Steps FORWARD!");
      } else {
        // Dash backward 800px
        this.demonicStepsTargetX = this.x + (this.facing * -500); // Opposite direction
        this.demonicStepsDirection = -1; // Moving backward
        console.log("Demonic Heaven's Steps BACKWARD!");
      }
    
      // Activate dash
      this.isDemonicStepsActive = true;
      this.demonicStepsTimer = 15; // Same as Ethan's air dash (15 frames)
      this.demonicStepsDistanceTraveled = 0;
      this.demonicStepsSpeed = (this.demonicStepsTargetX - this.x) / this.demonicStepsTimer;
    
      // Grant next attack bonus if Demonic Awakening is active
      if (this.isDemonicAwakeningActive) {
        this.demonicStepsNextAttackBonus = true;
        console.log("Demonic Steps during Awakening! Next attack +50% damage!");
      }
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
    if (this.isPoisonHandsActive) {
      console.log("Poison Hands is already active!");
      return; 
    }
    
    this.isPoisonHandsActive = true;
    this.poisonHandsTimer = comboData.duration; // 300 frames (5 seconds)
    this.poisonHandsCooldownPending = true;
    
    console.log("Poison Hands activated! Damage +50% for 5 seconds");
  }

  if (comboData.name === "Azure Dragon Scales") {
    if (this.isAzureScalesActive) {
      console.log("Azure Dragon Scales is already active!");
      return;
    }
    // NEW: Can't stack with Tortoise Body
    if (this.isTortoiseBodyActive) {
      console.log("Cannot use Azure Dragon Scales while Undying Tortoise Body is active!");
      return;
    }
    this.isAzureScalesActive = true;
    this.azureScalesTimer = comboData.duration;
    this.azureScalesCooldownPending = true;
    console.log("Azure Dragon Scales activated! 50% damage reflection for 5 seconds");
  }

  if (comboData.name === "Undying Tortoise Body") {
    if (this.isTortoiseBodyActive) {
      console.log("Undying Tortoise Body is already active!");
      return;
    }
    // NEW: Can't stack with Dragon Scales
    if (this.isAzureScalesActive) {
      console.log("Cannot use Undying Tortoise Body while Azure Dragon Scales is active!");
      return;
    }
    this.isTortoiseBodyActive = true;
    this.tortoiseBodyTimer = comboData.duration;
    this.tortoiseBodyCooldownPending = true;
    console.log("Undying Tortoise Body activated! +20% defense, damage boost for 5 seconds");
  }

  // Ocean Mending Water
  if (comboData.name === "Ocean Mending Water") {

  if (this.isOceanMendingActive) {
    console.log("Ocean Mending Water is already active!");
    return;
  }

    // Calculate heal amount based on remaining duration
    let healAmount = 0;
    let consumedBuff = "";
  
  if (this.isAzureScalesActive) {
    // 10 HP per second remaining
    let secondsLeft = Math.ceil(this.azureScalesTimer / 60);
    healAmount = secondsLeft * 10;
    healAmount = Math.min(healAmount, 50); // Cap at 50 HP
    
    // Consume Azure Scales
    this.isAzureScalesActive = false;
    this.azureScalesTimer = 0;
    if (this.azureScalesCooldownPending) {
      this.comboCooldowns["Azure Dragon Scales"] = 300;
      this.azureScalesCooldownPending = false;
    }
    consumedBuff = "Azure Dragon Scales";
  } 
  else if (this.isTortoiseBodyActive) {
    // 10 HP per second remaining
    let secondsLeft = Math.ceil(this.tortoiseBodyTimer / 60);
    healAmount = secondsLeft * 10;
    healAmount = Math.min(healAmount, 50); // Cap at 50 HP
    
    // Consume Tortoise Body
    this.isTortoiseBodyActive = false;
    this.tortoiseBodyTimer = 0;
    if (this.tortoiseBodyCooldownPending) {
      this.comboCooldowns["Undying Tortoise Body"] = 300;
      this.tortoiseBodyCooldownPending = false;
    }
    consumedBuff = "Undying Tortoise Body";
  }
  
  // Apply heal (cap at maxHp)
  this.hp = Math.min(this.hp + healAmount, this.maxHp);
  
  // Show heal indicator
  if (typeof spawnDamageIndicator === 'function') {
    spawnDamageIndicator(
      this.x + this.w / 2,
      this.y - 40,
      healAmount,
      false
    );
  }
  
    // Clear existing debuffs
    this.isPoisoned = false;
    this.poisonDamage = 0;
    this.poisonTimer = 0;
    this.isInPoisonField = false;
  
    // Activate debuff immunity
    this.isOceanMendingActive = true;
    this.oceanMendingTimer = 180; // 3 seconds
  
    console.log(`Ocean Mending Water healed ${healAmount} HP! ${consumedBuff} consumed. Debuff immunity for 3 seconds.`);
  }

  // ✅ NEW: Demonic Heaven's Awakening
  if (comboData.name === "Demonic Heavens Awakening") {
    if (this.isDemonicAwakeningActive) {
      console.log("Demonic Heaven's Awakening is already active!");
      return;
    }
    
    // Pay HP cost
    this.hp -= comboData.hpCost; // Costs 50 HP
    if (this.hp < 0) this.hp = 0;
    
    // Show HP cost indicator
    if (typeof spawnDamageIndicator === 'function') {
      spawnDamageIndicator(
        this.x + this.w / 2,
        this.y - 40,
        comboData.hpCost,
        false
      );
    }
    
    // Activate power-up
    this.isDemonicAwakeningActive = true;
    this.demonicAwakeningTimer = comboData.duration; // 300 frames (5 seconds)
    this.demonicAwakeningCooldownPending = true;
    
    console.log("Demonic Heaven's Awakening activated! +40% damage, 50% lifesteal for 5 seconds");
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
    this.canPoisonFieldTeleport = true;
    
    console.log("Poison Flower Field activated!");
  }

  // ✅ NEW: Demonic Heaven's Abyss
  if (comboData.name === "Demonic Heavens Abyss") {
    if (this.isDemonicAbyssActive) {
      console.log("Demonic Heaven's Abyss is already active!");
      return;
    }
    
    // Activate Abyss
    this.isDemonicAbyssActive = true;
    this.demonicAbyssTimer = comboData.duration; // 300 frames (5 seconds)
    this.demonicAbyssCooldownPending = true;
    this.demonicAbyssDmgTickTimer = 60; // First damage tick in 1 second
    
    // Lock caster in place (cannot move/attack)
    this.demonicClawOwnerLocked = true; // Reuse the same lock flag
    
    console.log("Demonic Heaven's Abyss activated! Gravitational pull for 5 seconds!");
  }
  
  this.hasHit = false;
  this.recoveryTimer = 0;
  return;
}
  
  this.attacking = comboData.name;
  this.isPerformingCombo = true;

  // ✅ UPDATED: Apply Demonic Steps bonus if active
if (this.demonicStepsNextAttackBonus) {
  this.comboDamageMod = comboData.damageMult * 1.5; // Base multiplier × 1.5
  this.demonicStepsNextAttackBonus = false; // Consume bonus
  console.log("Demonic Steps combo bonus applied! +50% damage!");
} else {
  this.comboDamageMod = comboData.damageMult;
}

  // ✅ NEW: Demonic Heaven's Claw - lock unless Awakening is active
  if (comboData.name === "Demonic Heavens Claw" && !this.isDemonicAwakeningActive) {
    // Normal behavior: locked until projectile disappears (handled in projectile timer)
    console.log("Demonic Claw - locked until claw disappears!");
  } else if (comboData.name === "Demonic Heavens Claw" && this.isDemonicAwakeningActive) {
    // Awakening override: can move immediately
    this.attacking = null;
    this.attackTimer = 0;
    this.isPerformingCombo = false;
    console.log("Demonic Claw during Awakening - free to move!");
  }

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
  // ✅ FIX: Clear attack state immediately so caster can move
  this.attacking = null;
  this.attackTimer = 0;
  this.isPerformingCombo = false;
  
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
  
  // ✅ FIX: Exit early - don't continue to normal combo execution
  this.hasHit = false;
  this.recoveryTimer = 0;
  return;
  }

  //Execute Aaron Shu Combo
if (comboData.name === "Unstoppable Sea Dragon") {
  // Consume either Azure Dragon Scales OR Undying Tortoise Body
  if (this.isAzureScalesActive) {
    this.isAzureScalesActive = false;
    this.azureScalesTimer = 0;
    if (this.azureScalesCooldownPending) {
      this.comboCooldowns["Azure Dragon Scales"] = 300;
      this.azureScalesCooldownPending = false;
    }
    console.log("Azure Dragon Scales consumed by Sea Dragon Charge!");
  } 
  else if (this.isTortoiseBodyActive) {
    this.isTortoiseBodyActive = false;
    this.tortoiseBodyTimer = 0;
    if (this.tortoiseBodyCooldownPending) {
      this.comboCooldowns["Undying Tortoise Body"] = 300;
      this.tortoiseBodyCooldownPending = false;
    }
    console.log("Undying Tortoise Body consumed by Sea Dragon Charge!");
  }
  
  // Initialize charge
  this.isSeaDragonCharging = true;
  this.seaDragonTimer = 60; // Total duration (1 second)
  this.seaDragonPhase = "charge";
  this.seaDragonDistanceTraveled = 0;
  this.seaDragonDirection = this.facing;
  this.seaDragonSpeed = 0;
  this.seaDragonTarget = null;
  
  console.log("Unstoppable Sea Dragon activated!");
  }

  //Execute Aaron Shu Signature - Azure Flowing Dragon
if (comboData.name === "Azure Flowing Dragon") {
  // Mark as used for this round
  this.hasUsedAzureDragon = true;
  
  // Consume either Azure Dragon Scales OR Undying Tortoise Body
  if (this.isAzureScalesActive) {
    this.isAzureScalesActive = false;
    this.azureScalesTimer = 0;
    if (this.azureScalesCooldownPending) {
      this.comboCooldowns["Azure Dragon Scales"] = 300;
      this.azureScalesCooldownPending = false;
    }
    console.log("Azure Dragon Scales consumed by Azure Flowing Dragon!");
  } 
  else if (this.isTortoiseBodyActive) {
    this.isTortoiseBodyActive = false;
    this.tortoiseBodyTimer = 0;
    if (this.tortoiseBodyCooldownPending) {
      this.comboCooldowns["Undying Tortoise Body"] = 300;
      this.tortoiseBodyCooldownPending = false;
    }
    console.log("Undying Tortoise Body consumed by Azure Flowing Dragon!");
  }
  
    // Get opponent position for indicator
    let opponent = (this === player1) ? player2 : player1;
    this.azureDragonIndicatorX = opponent.x + opponent.w / 2; // Center on enemy
    this.azureDragonIndicatorY = opponent.y + opponent.h; // At enemy's feet
  
    // Store target position (will emerge here after 1 second)
    this.azureDragonTargetX = this.azureDragonIndicatorX;
    this.azureDragonTargetY = this.azureDragonIndicatorY;
  
    // Initialize Azure Dragon sequence
    this.isAzureDragonActive = true;
    this.azureDragonTimer = 90; // 2 seconds total
    this.azureDragonPhase = "submerge"; // Start by going underground
  
    console.log("Azure Flowing Dragon activated!");
  }

  // ✅ NEW: Execute Damon Cheon Signature - Demonic Heaven Annihilation
  if (comboData.name === "Demonic Heaven Annihilation") {
    // Mark as used for this round
    this.hasUsedAnnihilation = true;
  
    // Get opponent and mark them
    let opponent = (this === player1) ? player2 : player1;
  
    opponent.isAnnihilationMarked = true;
    opponent.annihilationTimer = comboData.duration; // 480 frames (8 seconds)
    opponent.annihilationCumulativeDamage = 0; // Reset damage counter
    opponent.annihilationCaster = this; // Track who cast it
  
    console.log("Demonic Heaven Annihilation! Enemy marked for 8 seconds!");
  }

  // Demonic Heaven's Claw (Ground launcher projectile)
  if (comboData.name === "Demonic Heavens Claw") {
    // Get opponent position for indicator
    let opponent = (this === player1) ? player2 : player1;
    this.demonicClawIndicatorX = opponent.x + opponent.w / 2; // Center on enemy
    this.demonicClawIndicatorY = opponent.y + opponent.h; // At enemy's feet
    
    // Spawn the claw projectile at ground below enemy
    let spawnX = this.demonicClawIndicatorX;
    let spawnY = this.demonicClawIndicatorY;
    
    spawnProjectile(spawnX, spawnY, 1, this, "demonic_claw");
    
    console.log("Demonic Heaven's Claw activated!");
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

    // ✅ NEW: Demonic Heaven's Steps teleport effect
if (this.isDemonicStepsActive && this.demonicStepsTimer > 0) {
  push();
  
  // Dark purple/crimson teleport trail
  drawingContext.shadowBlur = 35;
  drawingContext.shadowColor = 'rgba(150, 0, 150, 1.0)';
  
  // Multiple afterimages
  for (let i = 1; i <= 3; i++) {
    let trailX = this.x - (this.demonicStepsSpeed * i * 2);
    let alpha = 180 - (i * 60);
    
    fill(150, 0, 150, alpha);
    noStroke();
    rect(trailX, this.y, this.w, this.h, 5);
  }
  
  // Demonic energy particles
  for (let i = 0; i < 5; i++) {
    let particleX = this.x + random(-30, 30);
    let particleY = this.y + random(0, this.h);
    fill(200, 0, 150, random(150, 255));
    noStroke();
    ellipse(particleX, particleY, random(5, 12), random(5, 12));
  }
  
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

// ✅ NEW: Sea Dragon Charge effect
if (this.isSeaDragonCharging && this.seaDragonTimer > 0) {
  push();
  
  // Charge phase glow (building power)
  if (this.seaDragonPhase === "charge") {
    drawingContext.shadowBlur = 25;
    drawingContext.shadowColor = 'rgba(0, 150, 255, 0.9)';
    
    // Pulsing blue aura
    let chargePulse = 150 + sin(frameCount * 0.5) * 100;
    noFill();
    stroke(0, 180, 255, chargePulse);
    strokeWeight(6);
    rect(this.x, this.y, this.w, this.h, 5);
    
    // Charge particles gathering
    for (let i = 0; i < 5; i++) {
      let particleX = this.x + this.w/2 + random(-40, 40);
      let particleY = this.y + this.h/2 + random(-40, 40);
      fill(0, 180, 255, random(150, 255));
      noStroke();
      ellipse(particleX, particleY, random(8, 15), random(8, 15));
    }
  }
  
  // Burst phase (accelerating forward)
  else if (this.seaDragonPhase === "burst") {
    drawingContext.shadowBlur = 40;
    drawingContext.shadowColor = 'rgba(0, 200, 255, 1.0)';
    
    // Speed trail
    for (let i = 1; i <= 5; i++) {
      let trailX = this.x - (this.seaDragonSpeed * i * 2);
      let alpha = 200 - (i * 40);
      
      fill(0, 200, 255, alpha);
      noStroke();
      rect(trailX, this.y, this.w, this.h, 5);
    }
    
    // Dragon-like energy wave
    stroke(100, 230, 255, 200);
    strokeWeight(8);
    noFill();
    rect(this.x - 5, this.y - 5, this.w + 10, this.h + 10, 5);
  }
  
  pop();
}

// Azure Flowing Dragon effect
if (this.isAzureDragonActive && this.azureDragonTimer > 0) {
  push();
  
  // Submerge phase - character fading into ground
  if (this.azureDragonPhase === "submerge") {
    // Water/earth ripple effect
    drawingContext.shadowBlur = 30;
    drawingContext.shadowColor = 'rgba(0, 150, 255, 0.8)';
    
    // Ground ripples
    for (let i = 1; i <= 3; i++) {
      let rippleSize = 50 + (i * 30);
      noFill();
      stroke(0, 180, 255, 200 - (i * 60));
      strokeWeight(4);
      ellipse(this.x + this.w/2, this.y + this.h, rippleSize, rippleSize * 0.3);
    }
    
    // Fading blue particles
    for (let i = 0; i < 8; i++) {
      let particleX = this.x + random(0, this.w);
      let particleY = this.y + this.h + random(-20, 10);
      fill(0, 180, 255, random(150, 255));
      noStroke();
      ellipse(particleX, particleY, random(5, 12), random(5, 12));
    }
  }
  
  // Emerge phase - character rising from ground
  else if (this.azureDragonPhase === "emerge") {
    drawingContext.shadowBlur = 50;
    drawingContext.shadowColor = 'rgba(0, 200, 255, 1.0)';
    
    // Explosive upward energy
    for (let i = 1; i <= 5; i++) {
      let trailY = this.y + (i * 20);
      let alpha = 200 - (i * 40);
      
      fill(0, 200, 255, alpha);
      noStroke();
      rect(this.x, trailY, this.w, this.h, 5);
    }
    
    // Dragon aura
    noFill();
    stroke(100, 230, 255, 255);
    strokeWeight(8);
    rect(this.x - 10, this.y - 10, this.w + 20, this.h + 20, 5);
    
    // Rising water/energy particles
    for (let i = 0; i < 10; i++) {
      let particleX = this.x + random(0, this.w);
      let particleY = this.y + this.h + random(0, 40);
      fill(0, 220, 255, random(180, 255));
      noStroke();
      ellipse(particleX, particleY, random(6, 14), random(6, 14));
    }
  }
  
  pop();
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
  else if (this.isAzureScalesActive) stroke(0, 150, 255, 255); // NEW: Deep blue outline
  else if (this.isTortoiseBodyActive) stroke(255, 215, 0, 255); // NEW: Golden outline
  else if (this.isOceanMendingActive) stroke(0, 220, 255, 255); // NEW: Cyan outline
  else if (this.isDemonicStepsActive) stroke(150, 0, 150, 255); // ✅ NEW: Purple during dash
  else if (this.isDemonicAwakeningActive) stroke(200, 0, 150, 255); // NEW: Dark crimson outline
  else if (this.isPoisonHandsActive) stroke(0, 255, 0, 200);  // Keep existing
  else stroke(0);

  // Character body
  fill(this.color);
  if (this.hp <= 0) {
    rect(this.x, this.y + this.h - 5, this.w, 5, 2);
  } else {
    // ✅ NEW: Hide character during underground phases
    if (this.isAzureDragonActive && 
        (this.azureDragonPhase === "submerge" || this.azureDragonPhase === "indicator")) {
      // Don't draw character - they're underground
    } else {
      // Normal character rendering
      rect(this.x, this.y, this.w, this.h, 5);
      fill(0);
      let eyeX = (this.facing === 1) ? (this.x + this.w - 15) : (this.x + 5);
      rect(eyeX, this.y + 10, 10, 10);
    }
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
  text(`POISON HANDS: ${timeLeft}s`, this.x + this.w/2, this.y - 10);
  
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
  text(`POISONED: ${timeLeft}s`, this.x + this.w/2, this.y - 25);
  
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

  // Azure Dragon Scales effect (Aaron Shu)
  if (this.isAzureScalesActive && this.azureScalesTimer > 0) {
  push();
  
  // Deep ocean blue aura
  drawingContext.shadowBlur = 30;
  drawingContext.shadowColor = 'rgba(0, 100, 200, 1.0)';
  
  // Pulsing blue outline (scales shimmer)
  let pulseAlpha = 150 + sin(frameCount * 0.2) * 100;
  noFill();
  stroke(0, 150, 255, pulseAlpha);
  strokeWeight(4);
  rect(this.x, this.y, this.w, this.h, 5);
  
  // Secondary pulse (dragon scales pattern)
  stroke(50, 200, 255, pulseAlpha * 0.6);
  strokeWeight(2);
  rect(this.x - 2, this.y - 2, this.w + 4, this.h + 4, 5);
  
  // Blue scale particles around body
  for (let i = 0; i < 4; i++) {
    let scaleX = this.x + random(0, this.w);
    let scaleY = this.y + random(0, this.h);
    fill(0, 150, 255, random(120, 220));
    noStroke();
    // Small diamond shapes (scales)
    push();
    translate(scaleX, scaleY);
    rotate(random(TWO_PI));
    rect(0, 0, random(4, 8), random(4, 8));
    pop();
  }
  
  // Timer indicator
  let timeLeft = Math.ceil(this.azureScalesTimer / 60);
  fill(0, 180, 255, 220);
  noStroke();
  textAlign(CENTER, BOTTOM);
  textSize(14);
  text(`DRAGON SCALES: ${timeLeft}s`, this.x + this.w/2, this.y - 10);
  
  pop();
  }

  // Undying Tortoise Body effect (Aaron Shu)
if (this.isTortoiseBodyActive && this.tortoiseBodyTimer > 0) {
  push();
  
  // Golden yellow aura (defensive shield)
  drawingContext.shadowBlur = 30;
  drawingContext.shadowColor = 'rgba(255, 215, 0, 1.0)';
  
  // Pulsing golden outline (tortoise shell pattern)
  let pulseAlpha = 150 + sin(frameCount * 0.2) * 100;
  noFill();
  stroke(255, 215, 0, pulseAlpha);
  strokeWeight(4);
  rect(this.x, this.y, this.w, this.h, 5);
  
  // Secondary pulse (hexagonal shell pattern)
  stroke(255, 235, 100, pulseAlpha * 0.6);
  strokeWeight(2);
  rect(this.x - 2, this.y - 2, this.w + 4, this.h + 4, 5);
  
  // Golden shield particles around body
  for (let i = 0; i < 4; i++) {
    let shieldX = this.x + random(0, this.w);
    let shieldY = this.y + random(0, this.h);
    fill(255, 215, 0, random(120, 220));
    noStroke();
    // Small hexagon shapes (shell segments)
    push();
    translate(shieldX, shieldY);
    rotate(random(TWO_PI));
    ellipse(0, 0, random(5, 10), random(5, 10));
    pop();
  }
  
  // Timer indicator
  let timeLeft = Math.ceil(this.tortoiseBodyTimer / 60);
    fill(255, 215, 0, 220);
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(14);
    text(`TORTOISE BODY: ${timeLeft}s`, this.x + this.w/2, this.y - 10);
  
    pop();
  }

  // Ocean Mending Water effect (Aaron Shu)
if (this.isOceanMendingActive && this.oceanMendingTimer > 0) {
  push();
  
  // Water/cleansing aura (cyan/aqua glow)
  drawingContext.shadowBlur = 35;
  drawingContext.shadowColor = 'rgba(0, 200, 255, 1.0)';
  
  // Pulsing cyan outline (water flow)
  let pulseAlpha = 180 + sin(frameCount * 0.25) * 75;
  noFill();
  stroke(0, 220, 255, pulseAlpha);
  strokeWeight(5);
  rect(this.x, this.y, this.w, this.h, 5);
  
  // Secondary pulse (healing waves)
  stroke(100, 240, 255, pulseAlpha * 0.7);
  strokeWeight(3);
  rect(this.x - 3, this.y - 3, this.w + 6, this.h + 6, 5);
  
  // Water droplet particles (cleansing effect)
  for (let i = 0; i < 6; i++) {
    let dropX = this.x + random(0, this.w);
    let dropY = this.y + random(0, this.h);
    fill(0, 220, 255, random(150, 255));
    noStroke();
    ellipse(dropX, dropY, random(4, 10), random(6, 12));
  }
  
  // Rising bubbles (purification)
  for (let i = 0; i < 3; i++) {
    let bubbleX = this.x + random(0, this.w);
    let bubbleY = this.y + this.h - (frameCount % 60) * 2 + (i * 20);
    fill(100, 240, 255, random(80, 150));
    noStroke();
    ellipse(bubbleX, bubbleY, random(6, 12), random(6, 12));
  }
  
  // Timer indicator
  let timeLeft = Math.ceil(this.oceanMendingTimer / 60);
    fill(0, 220, 255, 255);
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(14);
    text(`OCEAN MENDING: ${timeLeft}s`, this.x + this.w/2, this.y - 10);
  
    pop();
  }

  //NEW: Demonic Heaven's Awakening effect (Damon Cheon)
  if (this.isDemonicAwakeningActive && this.demonicAwakeningTimer > 0) {
    push();
    
    // Dark crimson/purple aura (demonic energy)
    drawingContext.shadowBlur = 40;
    drawingContext.shadowColor = 'rgba(150, 0, 150, 1.0)';
    
    // Pulsing dark red outline (demonic power)
    let pulseAlpha = 180 + sin(frameCount * 0.3) * 75;
    noFill();
    stroke(200, 0, 100, pulseAlpha);
    strokeWeight(5);
    rect(this.x, this.y, this.w, this.h, 5);
    
    // Secondary pulse (dark purple aura)
    stroke(150, 0, 150, pulseAlpha * 0.7);
    strokeWeight(3);
    rect(this.x - 3, this.y - 3, this.w + 6, this.h + 6, 5);
    
    // Demonic energy particles (dark red/purple)
    for (let i = 0; i < 8; i++) {
      let particleX = this.x + random(0, this.w);
      let particleY = this.y + random(0, this.h);
      fill(random(150, 200), 0, random(100, 150), random(150, 255));
      noStroke();
      ellipse(particleX, particleY, random(4, 10), random(4, 10));
    }
    
    // Rising dark flames (demonic power)
    for (let i = 0; i < 4; i++) {
      let flameX = this.x + random(0, this.w);
      let flameY = this.y + this.h - (frameCount % 60) * 2 + (i * 20);
      fill(150, 0, 100, random(100, 200));
      noStroke();
      ellipse(flameX, flameY, random(6, 14), random(10, 18));
    }
    
    // Timer indicator
    let timeLeft = Math.ceil(this.demonicAwakeningTimer / 60);
    fill(200, 0, 150, 255);
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(14);
    text(`DEMONIC AWAKENING: ${timeLeft}s`, this.x + this.w/2, this.y - 10);
    
    pop();
  }

  // ✅ NEW: Demonic Heaven's Abyss effect (Damon Cheon)
if (this.isDemonicAbyssActive && this.demonicAbyssTimer > 0) {
  push();
  
  // Calculate range zone
  let zoneX = this.facing === 1 ? this.x + this.w : this.x - this.demonicAbyssRange;
  let zoneW = this.demonicAbyssRange;
  let zoneY = this.y;
  let zoneH = this.h;
  
  // Dark purple/red abyss zone
  drawingContext.shadowBlur = 40;
  drawingContext.shadowColor = 'rgba(150, 0, 100, 0.8)';
  
  // Pulsing zone overlay
  let abyssPulse = 80 + sin(frameCount * 0.15) * 40;
  fill(150, 0, 100, abyssPulse);
  noStroke();
  
  if (this.facing === 1) {
    rect(this.x + this.w, zoneY, zoneW, zoneH, 5);
  } else {
    rect(this.x - this.demonicAbyssRange, zoneY, zoneW, zoneH, 5);
  }
  
  // Gravitational pull lines (animated toward caster)
  for (let i = 0; i < 8; i++) {
    let lineProgress = (frameCount * 0.05 + i * 0.3) % 1;
    let lineX = this.facing === 1 ? 
      this.x + this.w + (this.demonicAbyssRange * (1 - lineProgress)) :
      this.x - (this.demonicAbyssRange * (1 - lineProgress));
    
    stroke(200, 0, 150, 150 * lineProgress);
    strokeWeight(3);
    
    if (this.facing === 1) {
      line(lineX, zoneY, this.x + this.w, this.y + this.h/2);
    } else {
      line(lineX, zoneY, this.x, this.y + this.h/2);
    }
  }
  
  // Dark energy particles swirling toward caster
  for (let i = 0; i < 10; i++) {
    let spiralAngle = (frameCount * 0.1 + i * 0.6) % TWO_PI;
    let spiralDist = this.demonicAbyssRange * (0.5 + sin(frameCount * 0.05 + i) * 0.5);
    
    let particleX = this.facing === 1 ?
      this.x + this.w + cos(spiralAngle) * spiralDist :
      this.x - cos(spiralAngle) * spiralDist;
    let particleY = this.y + this.h/2 + sin(spiralAngle) * 50;
    
    fill(150, 0, 100, random(100, 200));
    noStroke();
    ellipse(particleX, particleY, random(4, 10), random(4, 10));
  }
  
  // Timer indicator
  let timeLeft = Math.ceil(this.demonicAbyssTimer / 60);
  fill(200, 0, 150, 255);
  noStroke();
  textAlign(CENTER, BOTTOM);
  textSize(14);
  text(`ABYSS: ${timeLeft}s`, this.x + this.w/2, this.y - 10);
  
  pop();
}

// ✅ NEW: Demonic Heaven Annihilation mark effect (on marked enemy)
if (this.isAnnihilationMarked && this.annihilationTimer > 0) {
  push();
  
  // Pulsing black/dark purple mark on character center
  let markPulse = 150 + sin(frameCount * 0.4) * 100;
  let markSize = 20 + sin(frameCount * 0.3) * 8;
  
  drawingContext.shadowBlur = 40;
  drawingContext.shadowColor = 'rgba(0, 0, 0, 1.0)';
  
  // Outer dark aura
  fill(0, 0, 0, markPulse * 0.6);
  noStroke();
  ellipse(this.x + this.w/2, this.y + this.h/2, markSize * 2, markSize * 2);
  
  // Main black dot (pulsing)
  fill(50, 0, 50, markPulse);
  stroke(150, 0, 150, 255);
  strokeWeight(3);
  ellipse(this.x + this.w/2, this.y + this.h/2, markSize, markSize);
  
  // Inner core (darker)
  fill(0, 0, 0, 255);
  noStroke();
  ellipse(this.x + this.w/2, this.y + this.h/2, markSize * 0.5, markSize * 0.5);
  
  // Dark energy particles orbiting the mark
  for (let i = 0; i < 6; i++) {
    let orbitAngle = (frameCount * 0.08 + i * TWO_PI / 6) % TWO_PI;
    let orbitDist = markSize * 1.5;
    
    let particleX = this.x + this.w/2 + cos(orbitAngle) * orbitDist;
    let particleY = this.y + this.h/2 + sin(orbitAngle) * orbitDist;
    
    fill(100, 0, 100, random(150, 255));
    noStroke();
    ellipse(particleX, particleY, random(3, 8), random(3, 8));
  }
  
  // Timer indicator and damage counter
  let timeLeft = Math.ceil(this.annihilationTimer / 60);
  let dmgAccumulated = Math.floor(this.annihilationCumulativeDamage);
  
  fill(200, 0, 150, 255);
  noStroke();
  textAlign(CENTER, BOTTOM);
  textSize(14);
  text(`⚫ MARKED: ${timeLeft}s ⚫`, this.x + this.w/2, this.y - 10);
  
  // Damage counter below timer
  fill(255, 0, 150, 220);
  textSize(12);
  text(`${dmgAccumulated} DMG`, this.x + this.w/2, this.y - 25);
  
  pop();
}

// ✅ NEW: Annihilation explosion visual
if (this.annihilationExploding && this.annihilationExplosionTimer > 0) {
  push();
  
  let explosionProgress = (30 - this.annihilationExplosionTimer) / 30; // 0 to 1
  let explosionSize = 150 * explosionProgress;
  let explosionAlpha = 255 * (1 - explosionProgress); // Fade out
  
  drawingContext.shadowBlur = 60;
  drawingContext.shadowColor = 'rgba(100, 0, 100, 1.0)';
  
  // Outer explosion ring (expanding)
  noFill();
  stroke(150, 0, 150, explosionAlpha);
  strokeWeight(10);
  ellipse(this.x + this.w/2, this.y + this.h/2, explosionSize * 2, explosionSize * 2);
  
  // Middle ring
  stroke(200, 0, 200, explosionAlpha * 0.8);
  strokeWeight(6);
  ellipse(this.x + this.w/2, this.y + this.h/2, explosionSize * 1.5, explosionSize * 1.5);
  
  // Core explosion
  fill(100, 0, 100, explosionAlpha);
  noStroke();
  ellipse(this.x + this.w/2, this.y + this.h/2, explosionSize, explosionSize);
  
  // Explosion particles
  for (let i = 0; i < 20; i++) {
    let particleAngle = random(TWO_PI);
    let particleDist = explosionSize * random(0.5, 1.5);
    
    let particleX = this.x + this.w/2 + cos(particleAngle) * particleDist;
    let particleY = this.y + this.h/2 + sin(particleAngle) * particleDist;
    
    fill(150, 0, 150, explosionAlpha * random(0.5, 1));
    noStroke();
    ellipse(particleX, particleY, random(5, 15), random(5, 15));
  }
  
  pop();
}

  // ✅ NEW: Demonic Steps next attack bonus indicator
if (this.demonicStepsNextAttackBonus) {
  push();
  
  // Pulsing "BONUS READY" indicator
  let bonusPulse = 200 + sin(frameCount * 0.4) * 55;
  
  fill(255, 215, 0, bonusPulse);
  noStroke();
  textAlign(CENTER, BOTTOM);
  textSize(16);
  text("BONUS READY", this.x + this.w/2, this.y - 25);
  
  // Small golden particles
  for (let i = 0; i < 3; i++) {
    let sparkX = this.x + this.w/2 + random(-20, 20);
    let sparkY = this.y - 30 + random(-10, 10);
    fill(255, 215, 0, random(150, 255));
    noStroke();
    ellipse(sparkX, sparkY, random(3, 6), random(3, 6));
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