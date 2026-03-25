class Character {
  constructor(x, y, w, h, color, controls, name = "Fighter", side = 1, archetype = "Controller") {
    // Basic properties
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.standH = h;
    this.crouchH = h * 0.8;
    this.color = color;
    this.name = name;
    this.controls = controls;
    this.archetype = archetype;
    this.consecutiveAirHits = 0;

    // Archetype stats
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

    // Physics
    this.velX = 0;
    this.velY = 0;
    this.speed = width * 0.01;
    this.gravity = height * 0.003;
    this.jumpPower = height * 0.05;
    this.facing = side;
    this.isGrounded = false;

    // Dash
    this.isDashing = false;
    this.isBackDashing = false;
    this.isCrouchDashing = false;
    this.isCrouchBackDashing = false; 
    this.dashDirection = 0;
    this.dashTimer = 0;
    this.dashMaxSpeed = 0;
    this.dashTrail = [];
    this.isLauncherSliding = false;
    this.launcherSlideTimer = 0;
    this.launcherSlideSpeed = 0;

    // Dive
    this.isDiving = false;
    this.diveTimer = 0;
    this.diveVelX = 0;
    this.diveVelY = 0;

    // Attack
    this.attacking = null;
    this.hasHit = false;
    this.attackTimer = 0;
    this.recoveryTimer = 0;
    this.isPerformingCombo = false;
    this.comboDamageMod = 1.0;

    // Combo
    this.comboHits = [];
    this.currentComboHit = 0;
    this.comboHitTimer = 0;
    this.lastHitIndex = -1;
    this.comboCooldowns = {};

    // Hit stun
    this.isHit = false;
    this.hitStun = 0;

    // Ethan Li - Lunge
    this.isLunging = false;
    this.lungeTimer = 0;
    this.lungeTotalFrames = 0;
    this.lungePhase = "none";
    this.lungePullbackDistance = 0;
    this.lungeBurstDistance = 0;
    this.lungeDirection = 0;
    this.lungeSpeed = 0;

    // Ethan Li - Flight
    this.isFlying = false;
    this.canAirDash = false;
    this.isAirDashing = false;
    this.airDashTimer = 0;
    this.airDashSpeed = 0;
    this.slowFallActive = false;
    this.flightLaunchTimer = 0;

    // Ethan Li - God Slash
    this.isGodSlashing = false;
    this.godSlashTimer = 0;
    this.godSlashPhase = "none";

    // Ethan Li - Judgment
    this.hasUsedJudgment = false;

    // Lucas Tang - Poison Hands
    this.isPoisonHandsActive = false;
    this.poisonHandsTimer = 0;
    this.poisonHandsDuration = 300;
    this.poisonHandsCooldownPending = false;

    // Lucas Tang - Poison DOT
    this.isPoisoned = false;
    this.poisonDamage = 0;
    this.poisonTimer = 0;
    this.poisonTickInterval = 60;
    this.poisonTickTimer = 0;
    this.poisonAttacker = null;

    // Lucas Tang - Poison Field
    this.isPoisonFieldActive = false;
    this.poisonFieldTimer = 0;
    this.poisonFieldCooldownPending = false;
    this.isInPoisonField = false;
    this.poisonFieldDmgTickTimer = 0;
    this.poisonFieldHealTickTimer = 0;
    this.canPoisonFieldTeleport = false;

    // Lucas Tang - Poison Rain
    this.hasUsedPoisonRain = false;
    this.isPoisonRainActive = false;
    this.poisonRainTimer = 0;
    this.poisonRainSpawnTimer = 0;

    // Aaron Shu - Azure Scales
    this.isAzureScalesActive = false;
    this.azureScalesTimer = 0;
    this.azureScalesDuration = 300;
    this.azureScalesCooldownPending = false;

    // Aaron Shu - Tortoise Body
    this.isTortoiseBodyActive = false;
    this.tortoiseBodyTimer = 0;
    this.tortoiseBodyDuration = 300;
    this.tortoiseBodyCooldownPending = false;

    // Aaron Shu - Ocean Mending
    this.isOceanMendingActive = false;
    this.oceanMendingTimer = 0;
    this.oceanMendingDuration = 180;

    // Aaron Shu - Sea Dragon Charge
    this.isSeaDragonCharging = false;
    this.seaDragonTimer = 0;
    this.seaDragonPhase = "none";
    this.seaDragonDistanceTraveled = 0;
    this.seaDragonMaxDistance = 800;
    this.seaDragonSpeed = 0;
    this.seaDragonDirection = 0;
    this.seaDragonTarget = null;
    this.seaDragonDragStunTimer = 0;

    // Aaron Shu - Azure Dragon
    this.hasUsedAzureDragon = false;
    this.isAzureDragonActive = false;
    this.azureDragonTimer = 0;
    this.azureDragonPhase = "none";
    this.azureDragonIndicatorX = 0;
    this.azureDragonIndicatorY = 0;
    this.azureDragonTargetX = 0;
    this.azureDragonTargetY = 0;

    // Damon Cheon - Demonic Awakening
    this.isDemonicAwakeningActive = false;
    this.demonicAwakeningTimer = 0;
    this.demonicAwakeningDuration = 300;
    this.demonicAwakeningCooldownPending = false;

    // Damon Cheon - Demonic Steps
    this.isDemonicStepsActive = false;
    this.demonicStepsTimer = 0;
    this.demonicStepsDirection = 0;
    this.demonicStepsSpeed = 0;
    this.demonicStepsDistanceTraveled = 0;
    this.demonicStepsMaxDistance = 500;
    this.demonicStepsTargetX = 0;
    this.demonicStepsNextAttackBonus = false;

    // Damon Cheon - Demonic Claw
    this.isDemonicClawActive = false;
    this.demonicClawTimer = 0;
    this.demonicClawPhase = "none";
    this.demonicClawIndicatorX = 0;
    this.demonicClawIndicatorY = 0;
    this.demonicClawOwnerLocked = false;

    // Damon Cheon - Demonic Abyss
    this.isDemonicAbyssActive = false;
    this.demonicAbyssTimer = 0;
    this.demonicAbyssDuration = 180;
    this.demonicAbyssCooldownPending = false;
    this.demonicAbyssRange = 300;
    this.demonicAbyssDmgTickTimer = 0;
    this.isInDemonicAbyss = false;

    // Damon Cheon - Annihilation
    this.hasUsedAnnihilation = false;
    this.isAnnihilationMarked = false;
    this.annihilationTimer = 0;
    this.annihilationDuration = 480;
    this.annihilationCumulativeDamage = 0;
    this.annihilationCaster = null;
    this.annihilationExploding = false;
    this.annihilationExplosionTimer = 0;

    // Animation system
    this.animations = {}; 
    this.currentAnimation = "idle";
    this.currentFrame = 0;
    this.frameTimer = 0;
    this.frameDelay = 5; 
    this.isWalking = false;
    this.isCrouching = false;
    // Generate a unique identifier for independent footstep audio tracking
    this.footstepId = name + "_" + Math.floor(Math.random() * 1000000);

    // Sprite rendering properties
    this.spriteOffsetX = 0;      // Horizontal offset from hurtbox center
    this.spriteOffsetY = -60;      // Vertical offset from hurtbox center  
    this.spriteScale = 1.5;      // Size multiplier (2.5 = 2.5x hurtbox height)

    // Hurtbox properties (separate from w/h for flexibility)
    this.hurtboxOffsetX = 0;     // Offset from x position
    this.hurtboxOffsetY = -60;     // Offset from y position
    this.hurtboxWidth = w;       // Hurtbox width (default = character w)
    this.hurtboxHeight = h + 60;      // Hurtbox height (default = character h)
  }

  // Main update loop
  update(opponent, groundY) {
    // Hit stun
    if (this.hitStun > 0) {
      this.hitStun--;
      this.isHit = true;
      this.attacking = null;
    } else {
      this.isHit = false;
    }

    // Recovery
    if (this.recoveryTimer > 0) {
      this.recoveryTimer--;
      this.applyPhysics(groundY);
      return;
    }

    // Get opponent helper
    const getOpponent = () => {
      if (currentState === GAME_STATE.TRAINING) {
        return (this === trainingPlayer) ? trainingDummy : trainingPlayer;
      } else if (currentState === GAME_STATE.MATCH) {
        return (this === singlePlayer1) ? singlePlayer2 : singlePlayer1;
      } else {
        return (this === player1) ? player2 : player1;
      }
    };

    // Update cooldowns
    for (let comboName in this.comboCooldowns) {
      if (this.comboCooldowns[comboName] > 0) {
        this.comboCooldowns[comboName]--;
      }
    }

    // Poison Hands duration
    if (this.isPoisonHandsActive && this.poisonHandsTimer > 0) {
      this.poisonHandsTimer--;
      if (this.poisonHandsTimer <= 0) {
        this.isPoisonHandsActive = false;
        if (this.poisonHandsCooldownPending) {
          this.comboCooldowns["Poison Hands"] = 120;
          this.poisonHandsCooldownPending = false;
          console.log("Poison Hands ended. Cooldown started.");
        }
      }
    }

    // Azure Scales duration
    if (this.isAzureScalesActive && this.azureScalesTimer > 0) {
      this.azureScalesTimer--;
      if (this.azureScalesTimer <= 0) {
        this.isAzureScalesActive = false;
        if (this.azureScalesCooldownPending) {
          this.comboCooldowns["Azure Dragon Scales"] = 300;
          this.azureScalesCooldownPending = false;
          console.log("Azure Dragon Scales ended. Cooldown started.");
        }
      }
    }

    // Tortoise Body duration
    if (this.isTortoiseBodyActive && this.tortoiseBodyTimer > 0) {
      this.tortoiseBodyTimer--;
      if (this.tortoiseBodyTimer <= 0) {
        this.isTortoiseBodyActive = false;
        if (this.tortoiseBodyCooldownPending) {
          this.comboCooldowns["Undying Tortoise Body"] = 300;
          this.tortoiseBodyCooldownPending = false;
          console.log("Undying Tortoise Body ended. Cooldown started.");
        }
      }
    }

    // Ocean Mending duration
    if (this.isOceanMendingActive && this.oceanMendingTimer > 0) {
      this.oceanMendingTimer--;
      this.isPoisoned = false;
      this.poisonDamage = 0;
      this.poisonTimer = 0;
      this.isInPoisonField = false;
      if (this.oceanMendingTimer <= 0) {
        this.isOceanMendingActive = false;
        console.log("Ocean Mending Water debuff immunity ended.");
      }
    }

    // Demonic Awakening duration
    if (this.isDemonicAwakeningActive && this.demonicAwakeningTimer > 0) {
      this.demonicAwakeningTimer--;
      if (this.demonicAwakeningTimer <= 0) {
        this.isDemonicAwakeningActive = false;
        if (this.demonicAwakeningCooldownPending) {
          this.comboCooldowns["Demonic Heavens Awakening"] = 180;
          this.demonicAwakeningCooldownPending = false;
          console.log("Demonic Heaven's Awakening ended. Cooldown started.");
        }
      }
    }

    // Demonic Abyss duration
    if (this.isDemonicAbyssActive && this.demonicAbyssTimer > 0) {
      this.demonicAbyssTimer--;
      let abyssOpponent = getOpponent();
      let distanceToOpponent = abs(abyssOpponent.x - this.x);
      let isInRange = false;

      if (this.facing === 1 && abyssOpponent.x > this.x && distanceToOpponent <= this.demonicAbyssRange) {
        isInRange = true;
      } else if (this.facing === -1 && abyssOpponent.x < this.x && distanceToOpponent <= this.demonicAbyssRange) {
        isInRange = true;
      }

      if (isInRange) {
        abyssOpponent.isInDemonicAbyss = true;
        let pullStrength = 2;
        let pullDirection = (abyssOpponent.x > this.x) ? -pullStrength : pullStrength;
        abyssOpponent.x += pullDirection;

        this.demonicAbyssDmgTickTimer--;
        if (this.demonicAbyssDmgTickTimer <= 0) {
          this.demonicAbyssDmgTickTimer = 60;
          let abyssDmg = 10;
          abyssOpponent.hp -= abyssDmg;
          if (abyssOpponent.hp < 0) abyssOpponent.hp = 0;

          if (typeof spawnDamageIndicator === 'function') {
            spawnDamageIndicator(abyssOpponent.x + abyssOpponent.w / 2, abyssOpponent.y - 20, abyssDmg, false);
          }
          console.log(`Demonic Abyss damage: -${abyssDmg} HP to opponent`);
        }
      } else {
        abyssOpponent.isInDemonicAbyss = false;
      }

      if (this.demonicAbyssTimer <= 0) {
        this.isDemonicAbyssActive = false;
        this.demonicClawOwnerLocked = false;
        abyssOpponent.isInDemonicAbyss = false;

        if (isInRange) {
          abyssOpponent.hitStun = 60;
          abyssOpponent.isHit = true;

          if (this.isDemonicAwakeningActive) {
            abyssOpponent.hitStun = 180;
            console.log("Demonic Abyss explosion! Enemy stunned for 3 seconds!");
          } else {
            console.log("Demonic Abyss ended! Enemy stunned for 1 second!");
          }
        }

        if (this.demonicAbyssCooldownPending) {
          this.comboCooldowns["Demonic Heavens Abyss"] = 300;
          this.demonicAbyssCooldownPending = false;
          console.log("Demonic Heaven's Abyss cooldown started.");
        }
      }
    }

    if (this.isInDemonicAbyss) {
      let abyssCaster = getOpponent();
      if (!abyssCaster.isDemonicAbyssActive) {
        this.isInDemonicAbyss = false;
      }
    }

    // Annihilation mark countdown
    if (this.isAnnihilationMarked && this.annihilationTimer > 0) {
      this.annihilationTimer--;

      if (this.annihilationTimer <= 0) {
        this.annihilationExploding = true;
        this.annihilationExplosionTimer = 30;

        let explosionDamage = this.annihilationCumulativeDamage;
        this.hp -= explosionDamage;
        if (this.hp < 0) this.hp = 0;

        if (typeof spawnDamageIndicator === 'function') {
          spawnDamageIndicator(this.x + this.w / 2, this.y - 50, Math.floor(explosionDamage), false);
        }

        console.log(`ANNIHILATION EXPLOSION! ${Math.floor(explosionDamage)} damage dealt!`);
        this.annihilationCumulativeDamage = 0;
        this.annihilationCaster = null;
      }
    }

    // Annihilation explosion visual
    if (this.annihilationExploding && this.annihilationExplosionTimer > 0) {
      this.annihilationExplosionTimer--;
      if (this.annihilationExplosionTimer <= 0) {
        this.annihilationExploding = false;
        this.isAnnihilationMarked = false;
        console.log("Annihilation mark cleared!");
      }
    }

    // Poison DOT
    if (this.isPoisoned && this.poisonTimer > 0) {
      this.poisonTimer--;
      this.poisonTickTimer--;

      if (this.poisonTickTimer <= 0) {
        this.poisonTickTimer = this.poisonTickInterval;
        this.hp -= this.poisonDamage;
        if (this.hp < 0) this.hp = 0;

        if (typeof spawnDamageIndicator === 'function') {
          spawnDamageIndicator(this.x + this.w / 2, this.y - 20, this.poisonDamage, false);
        }

        console.log(`Poison tick! ${this.poisonDamage} damage. ${Math.ceil(this.poisonTimer / 60)}s remaining`);
      }

      if (this.poisonTimer <= 0) {
        this.isPoisoned = false;
        this.poisonDamage = 0;
        this.poisonAttacker = null;
        console.log("Poison expired!");
      }
    }

    // Poison Field (caster)
    if (this.isPoisonFieldActive && this.poisonFieldTimer > 0) {
      this.poisonFieldTimer--;
      let fieldOpponent = getOpponent();
      fieldOpponent.isInPoisonField = true;

      this.poisonFieldHealTickTimer--;
      if (this.poisonFieldHealTickTimer <= 0) {
        this.poisonFieldHealTickTimer = 60;
        let healAmount = 10;
        this.hp = min(this.hp + healAmount, this.maxHp);

        if (typeof spawnDamageIndicator === 'function') {
          spawnDamageIndicator(this.x + this.w / 2, this.y - 20, healAmount, false);
        }
        console.log(`Poison Field heal: +${healAmount} HP`);
      }

      this.poisonFieldDmgTickTimer--;
      if (this.poisonFieldDmgTickTimer <= 0) {
        this.poisonFieldDmgTickTimer = 60;

        if (fieldOpponent.isOceanMendingActive) {
          console.log("Poison Field damage blocked by Ocean Mending Water!");
        } else {
          let fieldDmg = 10;
          fieldOpponent.hp -= fieldDmg;
          if (fieldOpponent.hp < 0) fieldOpponent.hp = 0;

          if (typeof spawnDamageIndicator === 'function') {
            spawnDamageIndicator(fieldOpponent.x + fieldOpponent.w / 2, fieldOpponent.y - 20, fieldDmg, false);
          }
          console.log(`Poison Field damage: -${fieldDmg} HP to opponent`);
        }
      }

      if (this.poisonFieldTimer <= 0) {
        this.isPoisonFieldActive = false;
        fieldOpponent.isInPoisonField = false;
        this.canPoisonFieldTeleport = false;

        if (this.poisonFieldCooldownPending) {
          this.comboCooldowns["Poison Flower Field"] = 300;
          this.poisonFieldCooldownPending = false;
          console.log("Poison Flower Field ended. Cooldown started.");
        }
      }
    }

    if (this.isInPoisonField) {
      let fieldCaster = getOpponent();
      if (!fieldCaster.isPoisonFieldActive) {
        this.isInPoisonField = false;
      }
    }

    // Poison Rain spawning
    if (this.isPoisonRainActive && this.poisonRainTimer > 0) {
      this.poisonRainTimer--;
      this.poisonRainSpawnTimer--;

      if (this.poisonRainSpawnTimer <= 0) {
        this.poisonRainSpawnTimer = 30;
        let rainTarget = getOpponent();
        let spawnX = rainTarget.x + rainTarget.w / 2;
        let spawnY = rainTarget.y - 300;
        spawnProjectile(spawnX, spawnY, 1, this, "poison_rain");
        console.log(`Poison Rain drop spawned above enemy! ${Math.ceil(this.poisonRainTimer / 60)}s remaining`);
      }

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
    
    // Play looping footstep audio only during uninterrupted ground walking
    if (this.isWalking && this.isGrounded && this.hitStun <= 0 && !this.isBlocking && !this.attacking && !this.isDashing) {
      if (typeof soundSystem !== 'undefined') {
        soundSystem.startFootstep(this.footstepId);
      }
    } else {
      // Pause audio immediately when action is interrupted (e.g. jumping, attacking, or stopping)
      if (typeof soundSystem !== 'undefined') {
        soundSystem.stopFootstep(this.footstepId);
      }
    }

    if (typeof animationSystem !== 'undefined') {
      animationSystem.updateAnimation(this); 
    }
  }

  // Handle movement
  handleMovement(groundY) {
    if (this.hitStun > 0) return;
    if (this.demonicClawOwnerLocked) return;

    this.speed = width * 0.002;
    this.isBlocking = keyIsDown(this.controls.block) && this.isGrounded;
    if (this.isBlocking) this.speed *= 0.3;

    if (this.isInPoisonField) {
      this.speed *= 0.5;
    }

    // Get input buffer
    let buffer = null;
    if (currentState === GAME_STATE.TRAINING) {
      buffer = (this === trainingPlayer) ? p1Buffer : null;
    } else if (currentState === GAME_STATE.MATCH) {
      buffer = (this === singlePlayer1) ? p1Buffer : null;
    } else if (currentState === GAME_STATE.MATCH_MULTI) {
      buffer = (this === player1) ? p1Buffer : (this === player2) ? p2Buffer : null;
    }

    // Flight controls
    if (this.isFlying && !this.isGrounded) {
      if (keyIsDown(this.controls.jump) && this.flightLaunchTimer <= 0) {
        this.slowFallActive = true;
        this.velY = 2;
      } else {
        this.slowFallActive = false;
      }

      if (buffer && buffer.checkDoubleTap("FW") && this.canAirDash && !this.isAirDashing) {
        this.isAirDashing = true;
        this.canAirDash = false;
        this.airDashTimer = 15;
        if (this.name === "Ethan Li") {
          soundSystem.playSfx("skySeveringStep");
        } else {
          soundSystem.playRandomDashSfx();
        }

        let opponent;
        if (currentState === GAME_STATE.TRAINING) {
          opponent = (this === trainingPlayer) ? trainingDummy : trainingPlayer;
        } else if (currentState === GAME_STATE.MATCH) {
          opponent = (this === singlePlayer1) ? singlePlayer2 : singlePlayer1;
        } else {
          opponent = (this === player1) ? player2 : player1;
        }

        let targetX = opponent.x + (opponent.facing === 1 ? -150 : opponent.w + 150);
        this.airDashSpeed = (targetX - this.x) / this.airDashTimer;
      }
    }

    // Poison Field Teleport
    if (this.isPoisonFieldActive && this.canPoisonFieldTeleport && this.isGrounded && !this.attacking) {
      if (buffer && buffer.checkDoubleTap("FW")) {
        let opponent;
        if (currentState === GAME_STATE.TRAINING) {
          opponent = (this === trainingPlayer) ? trainingDummy : trainingPlayer;
        } else if (currentState === GAME_STATE.MATCH) {
          opponent = (this === singlePlayer1) ? singlePlayer2 : singlePlayer1;
        } else {
          opponent = (this === player1) ? player2 : player1;
        }

        let teleportX = opponent.facing === 1 ? opponent.x - 150 : opponent.x + opponent.w + 150;
        this.x = teleportX;
        this.canPoisonFieldTeleport = false;
        soundSystem.playSfx("venomShadowStep");
        console.log("Poison Field Teleport! Behind enemy!");
        return;
      }
    }

    // Ground dash (double-tap FW/BW). !isDashing keeps one SFX per dash start.
    if (!this.attacking && this.isGrounded && buffer && !this.isDashing) {
      if (buffer.checkDoubleTap("FW")) {
        soundSystem.playRandomDashSfx();
        if (this.isCrouching) {
          this.isCrouchDashing = true;
          this.isDashing = true;
          this.dashDirection = this.facing;
          this.dashTimer = 20;
          this.dashMaxSpeed = 55;
          let dashSpeed = this.isInPoisonField ? 22 : 45;
          this.velX = this.facing * dashSpeed;
          console.log("Crouch Dash Forward!");
        } else {
          this.isDashing = true;
          this.dashDirection = this.facing;
          this.dashTimer = 18;
          this.dashMaxSpeed = 60;
          let dashSpeed = this.isInPoisonField ? 25 : 50;
          this.velX = this.facing * dashSpeed;
        }
      } else if (buffer.checkDoubleTap("BW")) {
        soundSystem.playRandomDashSfx();
        if (this.isCrouching) {
          this.isCrouchBackDashing = true;
          this.isDashing = true;
          this.dashDirection = -this.facing;
          this.dashTimer = 18;
          this.dashMaxSpeed = 48;
          let dashSpeed = this.isInPoisonField ? 19 : 38;
          this.velX = -this.facing * dashSpeed;
          console.log("Crouch Back Dash!");
        } else {
          this.isBackDashing = true;
          this.isDashing = true;
          this.dashDirection = -this.facing;
          this.dashTimer = 16;
          this.dashMaxSpeed = 52;
          let dashSpeed = this.isInPoisonField ? 21 : 42;
          this.velX = -this.facing * dashSpeed;
          console.log("Back Dash!");
        }
      }
    }

    // Dash momentum
    if (this.isDashing && this.dashTimer > 0) {
      this.dashTimer--;

      if (this.dashTimer > this.dashTimer * 0.75) {
        let accel = (this.dashDirection === this.facing) ? 6.0 : 5.5;
        if (this.isInPoisonField) accel *= 0.5;
        this.velX += this.dashDirection * accel;

        let currentSpeed = abs(this.velX);
        let maxSpeed = (this.dashDirection === this.facing) ? this.dashMaxSpeed : this.dashMaxSpeed * 0.85;
        if (this.isInPoisonField) maxSpeed *= 0.5;

        if (currentSpeed > maxSpeed) {
          this.velX = this.dashDirection * maxSpeed;
        }
      }

      if (this.dashTimer <= 0) {
        this.isDashing = false;
        this.isCrouchDashing = false;
        this.isBackDashing = false;
        this.isCrouchBackDashing = false; 
        this.dashDirection = 0;
      }
    }

// Walking
this.isWalking = false;
if (!this.attacking && !this.isDashing) {  // ✅ ADD THIS CHECK
  if (keyIsDown(this.controls.left)) {
    this.x -= this.speed;
    this.isWalking = true;
  }
  if (keyIsDown(this.controls.right)) {
    this.x += this.speed;
    this.isWalking = true;
  }
}
// ✅ ADD THESE LINES BACK:
this.x += this.velX;

if (this.isDashing) {
  this.velX *= 0.70;
} else {
  this.velX *= 0.82;
}
// Crouch
if (keyIsDown(this.controls.crouch) && this.isGrounded && !this.isLunging) {
  if (!this.isCrouching) {
    this.isCrouching = true;
    
    // Move hurtbox down so bottom stays at ground level
    this.hurtboxOffsetY = this.standH - this.crouchH;
    this.hurtboxHeight = this.crouchH;
  }
} else {
  if (this.isCrouching) {
    this.isCrouching = false;
    
    // Restore original hurtbox position and size
    this.hurtboxOffsetY = -60;
    this.hurtboxHeight = this.standH + 60;
  }
}

    // Jump
    if (keyIsDown(this.controls.jump) && this.isGrounded && !this.attacking && !this.isFlying) {
      if (this.isInPoisonField) {
        console.log("Jump nullified by Poison Flower Field!");
      } else {
        soundSystem.playRandomJumpSfx();
        this.velY = -this.jumpPower;
        this.isGrounded = false;
        this.isDashing = false;
        this.dashTimer = 0;
      }
    }
  }

  // Apply physics
  applyPhysics(groundY) {
    // Diving kick
    if (this.isDiving && this.diveTimer > 0) {
      this.diveTimer--;

      if (this.diveTimer > 35) {
        this.velY += this.gravity;
      } else if (this.diveTimer > 25) {
        this.diveVelY += this.gravity * 1.5;
        this.velY = this.diveVelY;
        this.x += this.diveVelX;
      } else {
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
    // Air dash teleport
    else if (this.isAirDashing && this.airDashTimer > 0) {
      this.airDashTimer--;
      this.x += this.airDashSpeed;
      this.velY = 0;

      if (this.airDashTimer <= 0) {
        this.isAirDashing = false;
        this.airDashSpeed = 0;
      }
    }
    // Demonic Steps teleport
    else if (this.isDemonicStepsActive && this.demonicStepsTimer > 0) {
      this.demonicStepsTimer--;
      this.x += this.demonicStepsSpeed;
      this.demonicStepsDistanceTraveled += Math.abs(this.demonicStepsSpeed);
      this.velY = 0;

      if (this.demonicStepsTimer <= 0 || this.demonicStepsDistanceTraveled >= this.demonicStepsMaxDistance) {
        this.isDemonicStepsActive = false;
        this.demonicStepsSpeed = 0;
        this.demonicStepsDistanceTraveled = 0;
      }
    }
    // God Slash
    else if (this.isGodSlashing && this.godSlashTimer > 0) {
      this.godSlashTimer--;

      if (this.godSlashTimer > 30) {
        this.godSlashPhase = "teleport";
        this.velY = 0;
      } else {
        this.godSlashPhase = "slash";
        this.velY = 15;
      }

      if (this.godSlashTimer <= 0) {
        this.isGodSlashing = false;
        this.godSlashPhase = "none";
      }
    }
    // Normal gravity
    else {
      if (this.flightLaunchTimer > 0) {
        this.flightLaunchTimer--;
      } else if (!this.slowFallActive) {
        this.velY += this.gravity;
      }
    }

    this.y += this.velY;

    // Lunge
    if (this.isLunging && this.lungeTimer > 0) {
      this.lungeTimer--;
      let pullbackFrames = 10;
      let burstFrames = 25;

      if (this.lungeTimer > burstFrames) {
        this.lungePhase = "pullback";
        let pullbackPerFrame = this.lungePullbackDistance / pullbackFrames;
        this.x -= this.lungeDirection * pullbackPerFrame;
      } else {
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

    // Sea Dragon Charge
    if (this.isSeaDragonCharging && this.seaDragonTimer > 0) {
      this.seaDragonTimer--;
      this.seaDragonDistanceTraveled += Math.abs(this.seaDragonSpeed);

      if (this.seaDragonDistanceTraveled < 100) {
        this.seaDragonPhase = "charge";
        this.seaDragonSpeed = this.seaDragonDirection * 5;
      } else {
        this.seaDragonPhase = "burst";
        this.seaDragonSpeed = this.seaDragonDirection * 15;
      }

      this.x += this.seaDragonSpeed;

      if (this.seaDragonTarget) {
        this.seaDragonTarget.x += this.seaDragonSpeed;
        this.seaDragonTarget.isHit = true;
        this.seaDragonTarget.hitStun = 999;
      }

      if (this.seaDragonDistanceTraveled >= this.seaDragonMaxDistance || this.seaDragonTimer <= 0) {
        this.isSeaDragonCharging = false;
        this.seaDragonPhase = "none";
        this.seaDragonSpeed = 0;

        if (this.seaDragonTarget) {
          this.seaDragonTarget.hitStun = 60;
          this.seaDragonTarget = null;
        }

        console.log("Sea Dragon Charge ended!");
      }
    }

    // Azure Dragon phases
    if (this.isAzureDragonActive && this.azureDragonTimer > 0) {
      this.azureDragonTimer--;

      if (this.azureDragonTimer > 80) {
        this.azureDragonPhase = "submerge";
        this.y += 5;
        this.velY = 0;
      } else if (this.azureDragonTimer > 50) {
        this.azureDragonPhase = "indicator";
      } else if (this.azureDragonTimer > 0) {
        if (this.azureDragonPhase === "indicator") {
          this.azureDragonPhase = "emerge";
          this.x = this.azureDragonTargetX - this.w / 2;
          this.y = this.azureDragonTargetY + 50;
          console.log("Azure Dragon emerging from ground!");
        }

        this.velY = -6;
        this.y += this.velY;

        let groundY = height - 100;
        if (this.y + this.h <= groundY) {
          // Continue rising
        } else {
          this.y = groundY - this.h;
          this.velY = 0;
          this.isGrounded = true;
        }
      }

      if (this.azureDragonTimer <= 0) {
        this.isAzureDragonActive = false;
        this.azureDragonPhase = "none";
        this.velY = 0;
        console.log("Azure Flowing Dragon ended!");
      }
    }

    // Launcher slide
    if (this.isLauncherSliding && this.launcherSlideTimer > 0) {
      this.launcherSlideTimer--;
      this.x += this.launcherSlideSpeed;
      this.launcherSlideSpeed *= 0.85;

      if (this.launcherSlideTimer <= 0) {
        this.isLauncherSliding = false;
        this.launcherSlideSpeed = 0;
      }
    }

    // Ground collision
    if (this.y + this.h >= groundY) {
      // Landing: only play once when transitioning from air to ground.
      if (!this.isGrounded && this.velY > 0) {
        soundSystem.playRandomLandSfx();
      }
      this.y = groundY - this.h;
      this.velY = 0;
      this.isGrounded = true;

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

  // Handle attack timers
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
            // Next combo segment: swing SFX only for normal punch/kick symbols.
            let comboAtk = this.comboHits[this.currentComboHit].attack;
            if (comboAtk === "LP" || comboAtk === "HP") {
              soundSystem.playRandomPunchSfx();
            } else if (comboAtk === "LK" || comboAtk === "HK") {
              soundSystem.playRandomKickSfx();
            }
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

  // Start basic attack
  startAttack(type) {
    if (this.demonicClawOwnerLocked) return;
    if (this.attackTimer <= 2 && !this.isBlocking) {
      this.attacking = type;
      this.hasHit = false;
      this.recoveryTimer = 0;
      this.attackTimer = (type === "LP" || type === "LK") ? 12 : 22;

      if (this.isPoisonHandsActive) {
        this.comboDamageMod = 1.5;
      } else if (this.demonicStepsNextAttackBonus) {
        this.comboDamageMod = 1.5;
        this.demonicStepsNextAttackBonus = false;
        console.log("Demonic Steps bonus applied! +50% damage on this attack!");
      } else {
        this.comboDamageMod = 1.0;
      }

      // Basic attack swing layer: separate pools for arms vs legs.
      if (type === "LP" || type === "HP") {
        soundSystem.playRandomPunchSfx();
      } else if (type === "LK" || type === "HK") {
        soundSystem.playRandomKickSfx();
      }
    }
  }

  // Execute combo
  executeCombo(comboData) {
    const getOpponent = () => {
      if (currentState === GAME_STATE.TRAINING) {
        return (this === trainingPlayer) ? trainingDummy : trainingPlayer;
      } else if (currentState === GAME_STATE.MATCH) {
        return (this === singlePlayer1) ? singlePlayer2 : singlePlayer1;
      } else {
        return (this === player1) ? player2 : player1;
      }
    };

    // Movement combos
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
      soundSystem.playRandomJumpSfx();
      }

      if (comboData.isDemonicSteps) {
        let opponent = getOpponent();

  if (comboData.stepsDirection === "forward") {
    // ✅ Dash toward opponent instead of fixed 500px
    this.demonicStepsTargetX = opponent.x + (opponent.facing === 1 ? -50 : opponent.w + 50);
    this.demonicStepsDirection = 1;
    soundSystem.playSfx("heavenSplittingDemonStep");
    console.log("Demonic Heaven's Steps FORWARD toward enemy!");
  } else {
    this.demonicStepsTargetX = this.x + (this.facing * -500);
    this.demonicStepsDirection = -1;
    soundSystem.playSfx("heavenShadowReversalStep");
    console.log("Demonic Heaven's Steps BACKWARD!");
  }

        this.isDemonicStepsActive = true;
        this.demonicStepsTimer = 15;
        this.demonicStepsDistanceTraveled = 0;
        this.demonicStepsSpeed = (this.demonicStepsTargetX - this.x) / this.demonicStepsTimer;

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

    // Power-up combos
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
        this.poisonHandsTimer = comboData.duration;
        this.poisonHandsCooldownPending = true;
        soundSystem.playSfx("myriadVenomBody");
        console.log("Poison Hands activated! Damage +50% for 5 seconds");
      }

      if (comboData.name === "Azure Dragon Scales") {
        if (this.isAzureScalesActive) {
          console.log("Azure Dragon Scales is already active!");
          return;
        }
        if (this.isTortoiseBodyActive) {
          console.log("Cannot use Azure Dragon Scales while Undying Tortoise Body is active!");
          return;
        }
        this.isAzureScalesActive = true;
        this.azureScalesTimer = comboData.duration;
        this.azureScalesCooldownPending = true;
        soundSystem.playSfx("azureDragonScale");
        console.log("Azure Dragon Scales activated! 50% damage reflection for 5 seconds");
      }

      if (comboData.name === "Undying Tortoise Body") {
        if (this.isTortoiseBodyActive) {
          console.log("Undying Tortoise Body is already active!");
          return;
        }
        if (this.isAzureScalesActive) {
          console.log("Cannot use Undying Tortoise Body while Azure Dragon Scales is active!");
          return;
        }
        this.isTortoiseBodyActive = true;
        this.tortoiseBodyTimer = comboData.duration;
        this.tortoiseBodyCooldownPending = true;
        soundSystem.playSfx("immortalTortoiseBody");
        console.log("Undying Tortoise Body activated! +20% defense, damage boost for 5 seconds");
      }

      if (comboData.name === "Ocean Mending Water") {
        if (this.isOceanMendingActive) {
          console.log("Ocean Mending Water is already active!");
          return;
        }

        let healAmount = 0;
        let consumedBuff = "";

        if (this.isAzureScalesActive) {
          let secondsLeft = Math.ceil(this.azureScalesTimer / 60);
          healAmount = secondsLeft * 10;
          healAmount = Math.min(healAmount, 50);
          this.isAzureScalesActive = false;
          this.azureScalesTimer = 0;
          if (this.azureScalesCooldownPending) {
            this.comboCooldowns["Azure Dragon Scales"] = 300;
            this.azureScalesCooldownPending = false;
          }
          consumedBuff = "Azure Dragon Scales";
        } else if (this.isTortoiseBodyActive) {
          let secondsLeft = Math.ceil(this.tortoiseBodyTimer / 60);
          healAmount = secondsLeft * 10;
          healAmount = Math.min(healAmount, 50);
          this.isTortoiseBodyActive = false;
          this.tortoiseBodyTimer = 0;
          if (this.tortoiseBodyCooldownPending) {
            this.comboCooldowns["Undying Tortoise Body"] = 300;
            this.tortoiseBodyCooldownPending = false;
          }
          consumedBuff = "Undying Tortoise Body";
        }

        this.hp = Math.min(this.hp + healAmount, this.maxHp);

        if (typeof spawnDamageIndicator === 'function') {
          spawnDamageIndicator(this.x + this.w / 2, this.y - 40, healAmount, false);
        }

        this.isPoisoned = false;
        this.poisonDamage = 0;
        this.poisonTimer = 0;
        this.isInPoisonField = false;
        this.isOceanMendingActive = true;
        this.oceanMendingTimer = 180;

        soundSystem.playSfx("oceanRebirthScripture");
        console.log(`Ocean Mending Water healed ${healAmount} HP! ${consumedBuff} consumed. Debuff immunity for 3 seconds.`);
      }

      if (comboData.name === "Demonic Heavens Awakening") {
        if (this.isDemonicAwakeningActive) {
          console.log("Demonic Heaven's Awakening is already active!");
          return;
        }

        this.hp -= comboData.hpCost;
        if (this.hp < 0) this.hp = 0;

        if (typeof spawnDamageIndicator === 'function') {
          spawnDamageIndicator(this.x + this.w / 2, this.y - 40, comboData.hpCost, false);
        }

        this.isDemonicAwakeningActive = true;
        this.demonicAwakeningTimer = comboData.duration;
        this.demonicAwakeningCooldownPending = true;

        soundSystem.playSfx("crimsonHeavenAwakening");
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
        this.isPoisonHandsActive = false;
        this.poisonHandsTimer = 0;
        if (this.poisonHandsCooldownPending) {
          this.comboCooldowns["Poison Hands"] = 120;
          this.poisonHandsCooldownPending = false;
        }

        this.isPoisonFieldActive = true;
        this.poisonFieldTimer = comboData.duration;
        this.poisonFieldCooldownPending = true;
        this.poisonFieldDmgTickTimer = 60;
        this.poisonFieldHealTickTimer = 60;
        this.canPoisonFieldTeleport = true;

        soundSystem.playSfx("netherBlossomDomain");
        console.log("Poison Flower Field activated!");
      }

      if (comboData.name === "Demonic Heavens Abyss") {
        if (this.isDemonicAbyssActive) {
          console.log("Demonic Heaven's Abyss is already active!");
          return;
        }

        this.isDemonicAbyssActive = true;
        this.demonicAbyssTimer = comboData.duration;
        this.demonicAbyssCooldownPending = true;
        this.demonicAbyssDmgTickTimer = 60;
        this.demonicClawOwnerLocked = true;

        soundSystem.playSfx("heavenDevouringAbyss");

        console.log("Demonic Heaven's Abyss activated! Gravitational pull for 5 seconds!");
      }

      this.hasHit = false;
      this.recoveryTimer = 0;
      return;
    }

    // Standard attack combos
    this.attacking = comboData.name;
    this.isPerformingCombo = true;

    if (this.demonicStepsNextAttackBonus) {
      this.comboDamageMod = comboData.damageMult * 1.5;
      this.demonicStepsNextAttackBonus = false;
      console.log("Demonic Steps combo bonus applied! +50% damage!");
    } else {
      this.comboDamageMod = comboData.damageMult;
    }

    if (comboData.name === "Demonic Heavens Claw" && !this.isDemonicAwakeningActive) {
      console.log("Demonic Claw - locked until claw disappears!");
    } else if (comboData.name === "Demonic Heavens Claw" && this.isDemonicAwakeningActive) {
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
      // First segment of the combo string uses the same swing rules as startAttack.
      let firstAtk = this.comboHits[0].attack;
      if (firstAtk === "LP" || firstAtk === "HP") {
        soundSystem.playRandomPunchSfx();
      } else if (firstAtk === "LK" || firstAtk === "HK") {
        soundSystem.playRandomKickSfx();
      }
    } else {
      this.attackTimer = 25;
      this.comboHitTimer = 25;
    }

    // Launcher
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
      soundSystem.playRandomJumpSfx();
    }

    // Ethan Li - Sword Qi Strike
    if (comboData.name === "Sword Qi Strike") {
      soundSystem.playSfx("whiteWindSword");
      let spawnX = this.facing === 1 ? this.x + this.w : this.x;
      let spawnY = this.y + 50;
      spawnProjectile(spawnX, spawnY, this.facing, this, "sword_qi");
    }

    // Ethan Li - Sword Qi Lunge
    if (comboData.name === "Sword Qi Lunge") {
      if (this.h !== this.standH) {
        this.y -= (this.standH - this.h);
        this.h = this.standH;
      }
      soundSystem.playSfx("unstoppableSword");

      this.isLunging = true;
      this.lungeTimer = 35;
      this.lungeTotalFrames = 35;
      this.lungePullbackDistance = 200;
      this.lungeBurstDistance = 400;
      this.lungeDirection = this.facing;
    }

    // Ethan Li - Sword God Slash
    if (comboData.name === "Sword God Slash") {
      soundSystem.playSfx("heavenfallSlash");
      this.isGodSlashing = true;
      this.godSlashTimer = 40;
      this.godSlashPhase = "teleport";

      let opponent = getOpponent();
      let teleportX = opponent.x + (opponent.facing === 1 ? opponent.w + 100 : -100);
      let teleportY = opponent.y - 150;

      this.x = teleportX;
      this.y = teleportY;
      this.velX = 0;
      this.velY = 0;
    }

    // Ethan Li - Sword God Judgment
    if (comboData.name === "Sword God Judgment") {
      soundSystem.playSfx("swordGodJudgment");
      this.hasUsedJudgment = true;
      let opponent = getOpponent();
      let spawnX = opponent.x + opponent.w / 2;
      let spawnY = -200;
      spawnProjectile(spawnX, spawnY, 1, this, "judgment");
    }

    // Lucas Tang - Poison Qi Palm
    if (comboData.name === "Poison Qi Palm") {
      this.isPoisonHandsActive = false;
      this.poisonHandsTimer = 0;

      if (this.poisonHandsCooldownPending) {
        this.comboCooldowns["Poison Hands"] = 120;
        this.poisonHandsCooldownPending = false;
      }

      let spawnX = this.facing === 1 ? this.x + this.w : this.x;
      let spawnY = this.y + 50;
      spawnProjectile(spawnX, spawnY, this.facing, this, "poison_qi");
      soundSystem.playSfx("projectileAbility");

      console.log("Poison Qi Palm fired! Poison Hands ended.");
    }

    // Lucas Tang - Flame Poison Needle
    if (comboData.name === "Flame Poison Needle") {
      let spawnX = this.facing === 1 ? this.x + this.w : this.x;
      let spawnY = this.y + 50;
      spawnProjectile(spawnX, spawnY, this.facing, this, "flame_needle");
      soundSystem.playSfx("projectileAbility");
    }

    // Lucas Tang - Poison Rain
    if (comboData.name === "Ten Thousand Poison Flower Rain") {
      this.attacking = null;
      this.attackTimer = 0;
      this.isPerformingCombo = false;

      this.hasUsedPoisonRain = true;
      this.isPoisonFieldActive = false;
      this.poisonFieldTimer = 0;

      let rainOpponent = getOpponent();
      rainOpponent.isInPoisonField = false;

      if (this.poisonFieldCooldownPending) {
        this.comboCooldowns["Poison Flower Field"] = 300;
        this.poisonFieldCooldownPending = false;
      }

      this.isPoisonRainActive = true;
      this.poisonRainTimer = 300;
      this.poisonRainSpawnTimer = 0;

      soundSystem.playSfx("poisonRain");
      console.log("Ten Thousand Poison Flower Rain activated!");

      this.hasHit = false;
      this.recoveryTimer = 0;
      return;
    }

    // Aaron Shu - Sea Dragon Charge
    if (comboData.name === "Unstoppable Sea Dragon") {
      soundSystem.playSfx("unstoppableSeaDragon");
      if (this.isAzureScalesActive) {
        this.isAzureScalesActive = false;
        this.azureScalesTimer = 0;
        if (this.azureScalesCooldownPending) {
          this.comboCooldowns["Azure Dragon Scales"] = 300;
          this.azureScalesCooldownPending = false;
        }
        console.log("Azure Dragon Scales consumed by Sea Dragon Charge!");
      } else if (this.isTortoiseBodyActive) {
        this.isTortoiseBodyActive = false;
        this.tortoiseBodyTimer = 0;
        if (this.tortoiseBodyCooldownPending) {
          this.comboCooldowns["Undying Tortoise Body"] = 300;
          this.tortoiseBodyCooldownPending = false;
        }
        console.log("Undying Tortoise Body consumed by Sea Dragon Charge!");
      }

      this.isSeaDragonCharging = true;
      this.seaDragonTimer = 60;
      this.seaDragonPhase = "charge";
      this.seaDragonDistanceTraveled = 0;
      this.seaDragonDirection = this.facing;
      this.seaDragonSpeed = 0;
      this.seaDragonTarget = null;

      console.log("Unstoppable Sea Dragon activated!");
    }

    // Aaron Shu - Azure Flowing Dragon
    if (comboData.name === "Azure Flowing Dragon") {
      soundSystem.playSfx("azureDragonAscension");
      this.hasUsedAzureDragon = true;

      if (this.isAzureScalesActive) {
        this.isAzureScalesActive = false;
        this.azureScalesTimer = 0;
        if (this.azureScalesCooldownPending) {
          this.comboCooldowns["Azure Dragon Scales"] = 300;
          this.azureScalesCooldownPending = false;
        }
        console.log("Azure Dragon Scales consumed by Azure Flowing Dragon!");
      } else if (this.isTortoiseBodyActive) {
        this.isTortoiseBodyActive = false;
        this.tortoiseBodyTimer = 0;
        if (this.tortoiseBodyCooldownPending) {
          this.comboCooldowns["Undying Tortoise Body"] = 300;
          this.tortoiseBodyCooldownPending = false;
        }
        console.log("Undying Tortoise Body consumed by Azure Flowing Dragon!");
      }

      let opponent = getOpponent();
      this.azureDragonIndicatorX = opponent.x + opponent.w / 2;
      this.azureDragonIndicatorY = opponent.y + opponent.h;
      this.azureDragonTargetX = this.azureDragonIndicatorX;
      this.azureDragonTargetY = this.azureDragonIndicatorY;

      this.isAzureDragonActive = true;
      this.azureDragonTimer = 90;
      this.azureDragonPhase = "submerge";

      console.log("Azure Flowing Dragon activated!");
    }

    // Damon Cheon - Demonic Claw
    if (comboData.name === "Demonic Heavens Claw") {
      let opponent = getOpponent();
      this.demonicClawIndicatorX = opponent.x + opponent.w / 2;
      this.demonicClawIndicatorY = opponent.y + opponent.h;

      let spawnX = this.demonicClawIndicatorX;
      let spawnY = this.demonicClawIndicatorY;

      spawnProjectile(spawnX, spawnY, 1, this, "demonic_claw");
      console.log("Demonic Heaven's Claw activated!");
    }

    // Damon Cheon - Annihilation
    if (comboData.name === "Demonic Heaven Annihilation") {
      soundSystem.playSfx("crimsonHeavenAnnihilation");
      this.hasUsedAnnihilation = true;
      let opponent = getOpponent();

      opponent.isAnnihilationMarked = true;
      opponent.annihilationTimer = comboData.duration;
      opponent.annihilationCumulativeDamage = 0;
      opponent.annihilationCaster = this;

      console.log("Demonic Heaven Annihilation! Enemy marked for 8 seconds!");
    }

    // Set cooldown
    if (comboData.cooldown) {
      let cooldownKey = comboData.name;
      this.comboCooldowns[cooldownKey] = comboData.cooldown;
    }

    this.hasHit = false;
    this.recoveryTimer = 0;
  }

  // Draw character
  draw() {
    push();

// Dash trail - sprite-based afterimages
if (this.isDashing && this.dashTimer > 0) {
  let frames = animationSystem.getAnimation(this.name, this.currentAnimation);
  
  if (frames.length > 0 && frames[this.currentFrame]) {
    let sprite = frames[this.currentFrame];
    let spriteAspect = sprite.width / sprite.height;
    let targetHeight = this.standH * this.spriteScale;
    let targetWidth = targetHeight * spriteAspect;
    
    // Draw 3 afterimage sprites behind the character
    for (let i = 1; i <= 3; i++) {
      let trailX = this.x - (this.velX * i * 0.3);
      let alpha = 100 - (i * 25);
      
      push();
      tint(255, alpha); // Apply transparency to sprite
      
      let spriteCenterX = trailX + this.w/2 + this.spriteOffsetX;
      let spriteCenterY = this.y + this.h/2 + this.spriteOffsetY;
      
      translate(spriteCenterX, spriteCenterY);
      
      if (this.facing === -1) {
        scale(-1, 1);
      }
      
      imageMode(CENTER);
      image(sprite, 0, 0, targetWidth, targetHeight);
      pop();
    }
  }

  drawingContext.shadowBlur = 15;
  drawingContext.shadowColor = 'rgba(255, 255, 255, 0.8)';
}

   // Launcher slide trail - sprite-based afterimages with orange tint
if (this.isLauncherSliding && this.launcherSlideTimer > 0) {
  let frames = animationSystem.getAnimation(this.name, this.currentAnimation);
  
  if (frames.length > 0 && frames[this.currentFrame]) {
    let sprite = frames[this.currentFrame];
    let spriteAspect = sprite.width / sprite.height;
    let targetHeight = this.standH * this.spriteScale;
    let targetWidth = targetHeight * spriteAspect;
    
    for (let i = 1; i <= 4; i++) {
      let trailX = this.x - (this.launcherSlideSpeed * i * 0.25);
      let alpha = 120 - (i * 30);
      
      push();
      tint(255, 165, 0, alpha); // Orange tint with transparency
      
      let spriteCenterX = trailX + this.w/2 + this.spriteOffsetX;
      let spriteCenterY = this.y + this.h/2 + this.spriteOffsetY;
      
      translate(spriteCenterX, spriteCenterY);
      
      if (this.facing === -1) {
        scale(-1, 1);
      }
      
      imageMode(CENTER);
      image(sprite, 0, 0, targetWidth, targetHeight);
      pop();
    }
  }

  drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = 'rgba(255, 165, 0, 0.9)';
}

// Lunge trail - sprite-based afterimages with pink tint
if (this.isLunging && this.lungeTimer > 0) {
  let frames = animationSystem.getAnimation(this.name, this.currentAnimation);
  
  if (frames.length > 0 && frames[this.currentFrame]) {
    let sprite = frames[this.currentFrame];
    let spriteAspect = sprite.width / sprite.height;
    let targetHeight = this.standH * this.spriteScale;
    let targetWidth = targetHeight * spriteAspect;
    
    let trailCount = this.lungePhase === "burst" ? 5 : 2;

    for (let i = 1; i <= trailCount; i++) {
      let trailX = this.lungePhase === "burst" ?
        this.x - (this.lungeDirection * i * 30) :
        this.x + (this.lungeDirection * i * 15);

      let alpha = this.lungePhase === "burst" ?
        150 - (i * 30) :
        100 - (i * 40);

      push();
      tint(255, 200, 200, alpha); // Pink tint with transparency
      
      let spriteCenterX = trailX + this.w/2 + this.spriteOffsetX;
      let spriteCenterY = this.y + this.h/2 + this.spriteOffsetY;
      
      translate(spriteCenterX, spriteCenterY);
      
      if (this.facing === -1) {
        scale(-1, 1);
      }
      
      imageMode(CENTER);
      image(sprite, 0, 0, targetWidth, targetHeight);
      pop();
    }
  }

  if (this.lungePhase === "burst") {
    drawingContext.shadowBlur = 25;
    drawingContext.shadowColor = 'rgba(255, 100, 100, 0.9)';
  }
}

    // Flight effects
if (this.isFlying && !this.isGrounded) {
if (this.isAirDashing) {
  push();
  let hurtboxY = this.y + this.hurtboxOffsetY;
  
  for (let i = 1; i <= 3; i++) {
    let trailX = this.x + this.hurtboxOffsetX - (this.airDashSpeed * i * 2);
    let alpha = 150 - (i * 50);

    fill(255, 255, 255, alpha);
    noStroke();
    rect(trailX, hurtboxY, this.hurtboxWidth, this.hurtboxHeight, 5);
  }

        drawingContext.shadowBlur = 30;
        drawingContext.shadowColor = 'rgba(255, 255, 255, 1.0)';
        pop();
      }

      // Demonic Steps effect
      if (this.isDemonicStepsActive && this.demonicStepsTimer > 0) {
        push();

          let hurtboxX = this.x + this.hurtboxOffsetX;
          let hurtboxY = this.y + this.hurtboxOffsetY;

        drawingContext.shadowBlur = 35;
        drawingContext.shadowColor = 'rgba(150, 0, 150, 1.0)';

  for (let i = 1; i <= 3; i++) {
    let trailX = hurtboxX - (this.demonicStepsSpeed * i * 2);
    let alpha = 180 - (i * 60);

    fill(150, 0, 150, alpha);
    noStroke();
    rect(trailX, hurtboxY, this.hurtboxWidth, this.hurtboxHeight, 5);
  }

  for (let i = 0; i < 5; i++) {
    let particleX = hurtboxX + random(-30, 30);
    let particleY = hurtboxY + random(0, this.hurtboxHeight);
          fill(200, 0, 150, random(150, 255));
          noStroke();
          ellipse(particleX, particleY, random(5, 12), random(5, 12));
        }

        pop();
      }

      if (!this.isAirDashing) {
        drawingContext.shadowBlur = 15;
        drawingContext.shadowColor = 'rgba(200, 220, 255, 0.6)';
      }
    }

    // God Slash effect
    if (this.isGodSlashing && this.godSlashTimer > 0) {
      if (this.godSlashPhase === "teleport") {
          let hurtboxCenterX = this.x + this.hurtboxOffsetX + this.hurtboxWidth / 2;
          let hurtboxCenterY = this.y + this.hurtboxOffsetY + this.hurtboxHeight / 2;
        push();
        drawingContext.shadowBlur = 50;
        drawingContext.shadowColor = 'rgba(255, 255, 255, 1.0)';

        for (let i = 0; i < 3; i++) {
          let ringSize = 50 + (i * 30);
          noFill();
          stroke(255, 255, 255, 200 - (i * 60));
          strokeWeight(5);
          ellipse(hurtboxCenterX, hurtboxCenterY, ringSize, ringSize);
        }
        pop();
      } else if (this.godSlashPhase === "slash") {
        push();

  let slashProgress = map(this.godSlashTimer, 30, 0, 0, 1);
  let angle;
  if (this.facing === 1) {
    angle = map(slashProgress, 0, 1, -20, 60);
  } else {
    angle = map(slashProgress, 0, 1, 210, 120);
  }

  let angleRad = radians(angle);
  let hurtboxCenterX = this.x + this.hurtboxOffsetX + this.hurtboxWidth / 2;
  let hurtboxCenterY = this.y + this.hurtboxOffsetY + this.hurtboxHeight / 2;
  let anchorX = hurtboxCenterX;
  let anchorY = hurtboxCenterY;

        drawingContext.shadowBlur = 30;
        drawingContext.shadowColor = 'rgba(255, 0, 0, 1.0)';

        stroke(255, 50, 50, 250);
        strokeWeight(40);
        strokeCap(ROUND);

        let endX = anchorX + cos(angleRad) * 200;
        let endY = anchorY + sin(angleRad) * 200;

        line(anchorX, anchorY, endX, endY);

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

    // Sea Dragon Charge effect
    if (this.isSeaDragonCharging && this.seaDragonTimer > 0) {
      push();

      let hurtboxX = this.x + this.hurtboxOffsetX;
      let hurtboxY = this.y + this.hurtboxOffsetY;
      let hurtboxCenterX = hurtboxX + this.hurtboxWidth / 2;
      let hurtboxCenterY = hurtboxY + this.hurtboxHeight / 2;

      if (this.seaDragonPhase === "charge") {
        drawingContext.shadowBlur = 25;
        drawingContext.shadowColor = 'rgba(0, 150, 255, 0.9)';
 
        // ✅ Removed visible rect — glow only via shadow on particles
        for (let i = 0; i < 5; i++) {
          let particleX = hurtboxCenterX + random(-40, 40);
          let particleY = hurtboxCenterY + random(-40, 40);
          fill(0, 180, 255, random(150, 255));
          noStroke();
          ellipse(particleX, particleY, random(8, 15), random(8, 15));
        }
      }
 else if (this.seaDragonPhase === "burst") {
        drawingContext.shadowBlur = 40;
        drawingContext.shadowColor = 'rgba(0, 200, 255, 1.0)';
 
        for (let i = 1; i <= 5; i++) {
          let trailX = hurtboxX - (this.seaDragonSpeed * i * 2);
          let alpha = 200 - (i * 40);
          fill(0, 200, 255, alpha);
          noStroke();
          rect(trailX, hurtboxY, this.hurtboxWidth, this.hurtboxHeight, 5);
        }
  }

      pop();
    }

    // Azure Flowing Dragon effect
    if (this.isAzureDragonActive && this.azureDragonTimer > 0) {
      push();

        let hurtboxX = this.x + this.hurtboxOffsetX;
        let hurtboxY = this.y + this.hurtboxOffsetY;
        let hurtboxCenterX = hurtboxX + this.hurtboxWidth / 2;
        let hurtboxBottomY = hurtboxY + this.hurtboxHeight;

      if (this.azureDragonPhase === "submerge") {
        drawingContext.shadowBlur = 30;
        drawingContext.shadowColor = 'rgba(0, 150, 255, 0.8)';

        for (let i = 1; i <= 3; i++) {
          let rippleSize = 50 + (i * 30);
          noFill();
          stroke(0, 180, 255, 200 - (i * 60));
          strokeWeight(4);
    ellipse(hurtboxCenterX, hurtboxBottomY, rippleSize, rippleSize * 0.3);
        }
    
    for (let i = 0; i < 8; i++) {
      let particleX = hurtboxX + random(0, this.hurtboxWidth);
      let particleY = hurtboxBottomY + random(-20, 10);
          fill(0, 180, 255, random(150, 255));
          noStroke();
          ellipse(particleX, particleY, random(5, 12), random(5, 12));
        }
      } else if (this.azureDragonPhase === "emerge") {
        drawingContext.shadowBlur = 50;
        drawingContext.shadowColor = 'rgba(0, 200, 255, 1.0)';

    for (let i = 1; i <= 5; i++) {
      let trailY = hurtboxY + (i * 20);
      let alpha = 200 - (i * 40);

      fill(0, 200, 255, alpha);
      noStroke();
      rect(hurtboxX, trailY, this.hurtboxWidth, this.hurtboxHeight, 5);
    }

    noFill();
    stroke(100, 230, 255, 255);
    strokeWeight(8);
    rect(hurtboxX - 10, hurtboxY - 10, this.hurtboxWidth + 20, this.hurtboxHeight + 20, 5);

    for (let i = 0; i < 10; i++) {
      let particleX = hurtboxX + random(0, this.hurtboxWidth);
      let particleY = hurtboxBottomY + random(0, 40);
          fill(0, 220, 255, random(180, 255));
          noStroke();
          ellipse(particleX, particleY, random(6, 14), random(6, 14));
        }
      }

      pop();
    }

    // Character outline
    strokeWeight(2);
    if (this.isHit) stroke(255, 0, 0);
    else if (this.recoveryTimer > 0) stroke(100);
    else if (this.attackTimer > 0) stroke(255, 255, 0);
    else if (this.isDashing || this.isLauncherSliding || this.isLunging) stroke(255, 255, 255, 200);
    else if (this.isFlying) stroke(150, 200, 255, 200);
    else if (this.isGodSlashing) stroke(255, 0, 0, 255);
    else if (this.isPoisonFieldActive) stroke(0, 255, 80, 255);
    else if (this.isAzureScalesActive) stroke(0, 150, 255, 255);
    else if (this.isTortoiseBodyActive) stroke(255, 215, 0, 255);
    else if (this.isOceanMendingActive) stroke(0, 220, 255, 255);
    else if (this.isDemonicStepsActive) stroke(150, 0, 150, 255);
    else if (this.isDemonicAwakeningActive) stroke(200, 0, 150, 255);
    else if (this.isPoisonHandsActive) stroke(0, 255, 0, 200);
    else stroke(0);

// ✅ UPDATED: Character body - sprite + adjustable debug hurtbox
if (this.hp <= 0) {
  // ✅ Dead - just show a flat bar using hurtbox dimensions
  let hurtboxX = this.x + this.hurtboxOffsetX;
  let hurtboxY = this.y + this.hurtboxOffsetY;
  
  fill(this.color);
  rect(hurtboxX, hurtboxY + this.hurtboxHeight - 5, this.hurtboxWidth, 5, 2);
} else {
  // ✅ Hide during underground phases
  if (this.isAzureDragonActive && 
      (this.azureDragonPhase === "submerge" || this.azureDragonPhase === "indicator")) {
    // Don't draw character - they're underground
  } else {
    // ✅ Draw sprite (if available)
    if (animationSystem && animationSystem.getAnimation(this.name, this.currentAnimation).length > 0) {
      animationSystem.drawAnimation(this);
} else {
  // ✅ Fallback to colored rectangle (old system) - use hurtbox dimensions
  let hurtboxX = this.x + this.hurtboxOffsetX;
  let hurtboxY = this.y + this.hurtboxOffsetY;
  
  fill(this.color);
  rect(hurtboxX, hurtboxY, this.hurtboxWidth, this.hurtboxHeight, 5);
  
  // Eye
  fill(0);
  let eyeX = (this.facing === 1) ? 
    (hurtboxX + this.hurtboxWidth - 15) : 
    (hurtboxX + 5);
  rect(eyeX, hurtboxY + 10, 10, 10);
}
    
    // ✅ NEW: Debug hurtbox overlay using adjustable properties
    if (showHurtboxes) {
      push();
      noFill();
      stroke(0, 255, 0); // Green outline
      strokeWeight(2);
      
      // ✅ Draw hurtbox at offset position with custom size
      let hurtboxX = this.x + this.hurtboxOffsetX;
      let hurtboxY = this.y + this.hurtboxOffsetY;
      
      rect(hurtboxX, hurtboxY, this.hurtboxWidth, this.hurtboxHeight, 5);
      
      // ✅ Draw crosshair at hurtbox center for alignment reference
      stroke(255, 0, 0); // Red crosshair
      strokeWeight(1);
      let centerX = hurtboxX + this.hurtboxWidth/2;
      let centerY = hurtboxY + this.hurtboxHeight/2;
      line(centerX - 10, centerY, centerX + 10, centerY); // Horizontal
      line(centerX, centerY - 10, centerX, centerY + 10); // Vertical
      
      pop();
    }
  }
}

    // Hitbox and block
    if (this.hp > 0) {
      if (this.attackTimer > 0 && this.attacking !== "Sword Qi Fly") {
        this.drawHitbox();
      }

if (this.isBlocking) {
  noFill();
  stroke(0, 200, 255, 200);
  strokeWeight(6);
  
    // ✅ Use hurtbox properties for shield position
      let hurtboxX = this.x + this.hurtboxOffsetX;
      let hurtboxY = this.y + this.hurtboxOffsetY;
      let shieldX = (this.facing === 1) ? 
      hurtboxX + this.hurtboxWidth : 
      hurtboxX;
  
      line(shieldX, hurtboxY, shieldX, hurtboxY + this.hurtboxHeight);
      }
    }

    pop();

    // Status effects
    this.drawStatusEffects();
  }

// Draw status effect indicators
drawStatusEffects() {
  push();
 
  let hurtboxX = this.x + this.hurtboxOffsetX;
  let hurtboxY = this.y + this.hurtboxOffsetY;
  let hurtboxCenterX = hurtboxX + this.hurtboxWidth / 2;
  let hurtboxCenterY = hurtboxY + this.hurtboxHeight / 2;
 
  const applyGlow = (blur, color) => {
    drawingContext.shadowBlur  = blur;
    drawingContext.shadowColor = color;
    noStroke();
    fill(0, 0); // fully transparent — only the shadow is visible
    rect(hurtboxX, hurtboxY, this.hurtboxWidth, this.hurtboxHeight, 5);
  };
 
  if (this.annihilationExploding && this.annihilationExplosionTimer > 0) {
    // Explosion overrides everything
    let explosionProgress = (30 - this.annihilationExplosionTimer) / 30;
    let explosionAlpha    = 255 * (1 - explosionProgress);
    let explosionSize     = 150 * explosionProgress;
 
    drawingContext.shadowBlur  = 80;
    drawingContext.shadowColor = `rgba(150, 0, 150, ${explosionAlpha / 255})`;
    noStroke();
    fill(0, 0);
    rect(hurtboxX, hurtboxY, this.hurtboxWidth, this.hurtboxHeight, 5);
 
    // Expanding rings (no fill, just stroke — these are fine to keep as FX)
    noFill();
    stroke(150, 0, 150, explosionAlpha);
    strokeWeight(10);
    ellipse(hurtboxCenterX, hurtboxCenterY, explosionSize * 2, explosionSize * 2);
    stroke(200, 0, 200, explosionAlpha * 0.8);
    strokeWeight(6);
    ellipse(hurtboxCenterX, hurtboxCenterY, explosionSize * 1.5, explosionSize * 1.5);
 
    for (let i = 0; i < 20; i++) {
      let a = random(TWO_PI);
      let d = explosionSize * random(0.5, 1.5);
      fill(150, 0, 150, explosionAlpha * random(0.5, 1));
      noStroke();
      ellipse(hurtboxCenterX + cos(a) * d, hurtboxCenterY + sin(a) * d, random(5, 15), random(5, 15));
    }
 
  } else if (this.isDemonicAwakeningActive && this.demonicAwakeningTimer > 0) {
    applyGlow(45, 'rgba(200, 0, 100, 1.0)');
 
    // Floating flame particles (no rect)
    for (let i = 0; i < 8; i++) {
      let px = hurtboxX + random(0, this.hurtboxWidth);
      let py = hurtboxY + random(0, this.hurtboxHeight);
      fill(random(150, 200), 0, random(100, 150), random(150, 255));
      noStroke();
      ellipse(px, py, random(4, 10), random(4, 10));
    }
    for (let i = 0; i < 4; i++) {
      let fx = hurtboxX + random(0, this.hurtboxWidth);
      let fy = hurtboxY + this.hurtboxHeight - (frameCount % 60) * 2 + (i * 20);
      fill(150, 0, 100, random(100, 200));
      noStroke();
      ellipse(fx, fy, random(6, 14), random(10, 18));
    }
 
    let timeLeft = Math.ceil(this.demonicAwakeningTimer / 60);
    fill(200, 0, 150, 255);
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(14);
    text(`DEMONIC AWAKENING: ${timeLeft}s`, hurtboxCenterX, hurtboxY - 10);
 
  } else if (this.isOceanMendingActive && this.oceanMendingTimer > 0) {
    applyGlow(40, 'rgba(0, 210, 255, 1.0)');
 
    for (let i = 0; i < 6; i++) {
      let dx = hurtboxX + random(0, this.hurtboxWidth);
      let dy = hurtboxY + random(0, this.hurtboxHeight);
      fill(0, 220, 255, random(150, 255));
      noStroke();
      ellipse(dx, dy, random(4, 10), random(6, 12));
    }
    for (let i = 0; i < 3; i++) {
      let bx = hurtboxX + random(0, this.hurtboxWidth);
      let by = hurtboxY + this.hurtboxHeight - (frameCount % 60) * 2 + (i * 20);
      fill(100, 240, 255, random(80, 150));
      noStroke();
      ellipse(bx, by, random(6, 12), random(6, 12));
    }
 
    let timeLeft = Math.ceil(this.oceanMendingTimer / 60);
    fill(0, 220, 255, 255);
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(14);
    text(`OCEAN MENDING: ${timeLeft}s`, hurtboxCenterX, hurtboxY - 10);
 
  } else if (this.isTortoiseBodyActive && this.tortoiseBodyTimer > 0) {
    applyGlow(35, 'rgba(255, 215, 0, 1.0)');
 
    for (let i = 0; i < 4; i++) {
      let sx = hurtboxX + random(0, this.hurtboxWidth);
      let sy = hurtboxY + random(0, this.hurtboxHeight);
      fill(255, 215, 0, random(120, 220));
      noStroke();
      push();
      translate(sx, sy);
      rotate(random(TWO_PI));
      ellipse(0, 0, random(5, 10), random(5, 10));
      pop();
    }
 
    let timeLeft = Math.ceil(this.tortoiseBodyTimer / 60);
    fill(255, 215, 0, 220);
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(14);
    text(`TORTOISE BODY: ${timeLeft}s`, hurtboxCenterX, hurtboxY - 10);
 
  } else if (this.isAzureScalesActive && this.azureScalesTimer > 0) {
    applyGlow(35, 'rgba(0, 120, 255, 1.0)');
 
    for (let i = 0; i < 4; i++) {
      let sx = hurtboxX + random(0, this.hurtboxWidth);
      let sy = hurtboxY + random(0, this.hurtboxHeight);
      fill(0, 150, 255, random(120, 220));
      noStroke();
      push();
      translate(sx, sy);
      rotate(random(TWO_PI));
      rect(0, 0, random(4, 8), random(4, 8));
      pop();
    }
 
    let timeLeft = Math.ceil(this.azureScalesTimer / 60);
    fill(0, 180, 255, 220);
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(14);
    text(`DRAGON SCALES: ${timeLeft}s`, hurtboxCenterX, hurtboxY - 10);
 
  } else if (this.isPoisonFieldActive && this.poisonFieldTimer > 0) {
    applyGlow(40, 'rgba(0, 210, 60, 1.0)');
 
    for (let i = 0; i < 5; i++) {
      let px = hurtboxX + random(0, this.hurtboxWidth);
      let py = hurtboxY + random(0, this.hurtboxHeight);
      fill(0, 255, 100, random(150, 255));
      noStroke();
      ellipse(px, py, random(4, 10), random(4, 10));
    }
 
    let timeLeft = Math.ceil(this.poisonFieldTimer / 60);
    fill(0, 255, 80, 220);
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(14);
    text(`FIELD: ${timeLeft}s`, hurtboxCenterX, hurtboxY - 30);
 
  } else if (this.isPoisonHandsActive && this.poisonHandsTimer > 0) {
    applyGlow(30, 'rgba(0, 255, 0, 0.9)');
 
    for (let i = 0; i < 3; i++) {
      let hx = (this.facing === 1)
        ? hurtboxX + this.hurtboxWidth + random(-10, 10)
        : hurtboxX + random(-10, 10);
      let hy = hurtboxY + this.hurtboxHeight * 0.4 + random(-20, 20);
      fill(0, 255, 0, random(100, 200));
      noStroke();
      ellipse(hx, hy, random(5, 12), random(5, 12));
    }
 
    let timeLeft = Math.ceil(this.poisonHandsTimer / 60);
    fill(0, 255, 0, 200);
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(14);
    text(`POISON HANDS: ${timeLeft}s`, hurtboxCenterX, hurtboxY - 10);
  }
 
  // ─── ALWAYS-ON EFFECTS (stack on top regardless of above) ─────────────────
 
  // Poison DOT — pulsing red-orange glow on top of whatever else is active
  if (this.isPoisoned && this.poisonTimer > 0) {
    drawingContext.shadowBlur  = 25;
    drawingContext.shadowColor = 'rgba(255, 80, 0, 0.85)';
    noStroke();
    fill(0, 0);
    rect(hurtboxX, hurtboxY, this.hurtboxWidth, this.hurtboxHeight, 5);
 
    for (let i = 0; i < 4; i++) {
      let px = hurtboxX + random(0, this.hurtboxWidth);
      let py = hurtboxY + random(0, this.hurtboxHeight);
      fill(255, random(50, 150), 0, random(100, 200));
      noStroke();
      ellipse(px, py, random(4, 10), random(4, 10));
    }
 
    let timeLeft = Math.ceil(this.poisonTimer / 60);
    fill(255, 100, 0, 200);
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(14);
    text(`POISONED: ${timeLeft}s`, hurtboxCenterX, hurtboxY - 25);
  }
 
  // Poison Field debuff on victim
  if (this.isInPoisonField) {
    drawingContext.shadowBlur  = 18;
    drawingContext.shadowColor = 'rgba(0, 180, 0, 0.6)';
    noStroke();
    fill(0, 0);
    rect(hurtboxX, hurtboxY, this.hurtboxWidth, this.hurtboxHeight, 5);
 
    for (let i = 0; i < 3; i++) {
      let px = hurtboxX + random(0, this.hurtboxWidth);
      let py = hurtboxY + random(0, this.hurtboxHeight * 0.5);
      fill(0, 180, 0, random(80, 150));
      noStroke();
      ellipse(px, py, random(3, 7), random(3, 7));
    }
  }
 
  // Demonic Abyss zone (keep the zone VFX, just no character rect)
  if (this.isDemonicAbyssActive && this.demonicAbyssTimer > 0) {
    applyGlow(40, 'rgba(150, 0, 100, 0.85)');
 
    let zoneX = this.facing === 1
      ? hurtboxX + this.hurtboxWidth
      : hurtboxX - this.demonicAbyssRange;
    let zoneW = this.demonicAbyssRange;
 
    let abyssPulse = 80 + sin(frameCount * 0.15) * 40;
    fill(150, 0, 100, abyssPulse);
    noStroke();
    rect(zoneX, hurtboxY, zoneW, this.hurtboxHeight, 5);
 
    for (let i = 0; i < 8; i++) {
      let lineProgress = (frameCount * 0.05 + i * 0.3) % 1;
      let lineX = this.facing === 1
        ? hurtboxX + this.hurtboxWidth + (this.demonicAbyssRange * (1 - lineProgress))
        : hurtboxX - (this.demonicAbyssRange * (1 - lineProgress));
      let anchorX = this.facing === 1
        ? hurtboxX + this.hurtboxWidth
        : hurtboxX;
 
      stroke(200, 0, 150, 150 * lineProgress);
      strokeWeight(3);
      line(lineX, hurtboxY, anchorX, hurtboxY + this.hurtboxHeight / 2);
    }
 
    for (let i = 0; i < 10; i++) {
      let sa = (frameCount * 0.1 + i * 0.6) % TWO_PI;
      let sd = this.demonicAbyssRange * (0.5 + sin(frameCount * 0.05 + i) * 0.5);
      let px = this.facing === 1
        ? hurtboxX + this.hurtboxWidth + cos(sa) * sd
        : hurtboxX - cos(sa) * sd;
      let py = hurtboxY + this.hurtboxHeight / 2 + sin(sa) * 50;
 
      fill(150, 0, 100, random(100, 200));
      noStroke();
      ellipse(px, py, random(4, 10), random(4, 10));
    }
 
    let timeLeft = Math.ceil(this.demonicAbyssTimer / 60);
    fill(200, 0, 150, 255);
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(14);
    text(`ABYSS: ${timeLeft}s`, hurtboxCenterX, hurtboxY - 10);
  }
 
  // Annihilation mark
  if (this.isAnnihilationMarked && this.annihilationTimer > 0) {
    drawingContext.shadowBlur  = 40;
    drawingContext.shadowColor = 'rgba(120, 0, 120, 0.9)';
    noStroke();
    fill(0, 0);
    rect(hurtboxX, hurtboxY, this.hurtboxWidth, this.hurtboxHeight, 5);
 
    let markPulse = 150 + sin(frameCount * 0.4) * 100;
    let markSize  = 20  + sin(frameCount * 0.3) * 8;
 
    fill(0, 0, 0, markPulse * 0.6);
    noStroke();
    ellipse(hurtboxCenterX, hurtboxCenterY, markSize * 2, markSize * 2);
 
    fill(50, 0, 50, markPulse);
    stroke(150, 0, 150, 255);
    strokeWeight(3);
    ellipse(hurtboxCenterX, hurtboxCenterY, markSize, markSize);
 
    fill(0, 0, 0, 255);
    noStroke();
    ellipse(hurtboxCenterX, hurtboxCenterY, markSize * 0.5, markSize * 0.5);
 
    for (let i = 0; i < 6; i++) {
      let oa = (frameCount * 0.08 + i * TWO_PI / 6) % TWO_PI;
      let od = markSize * 1.5;
      fill(100, 0, 100, random(150, 255));
      noStroke();
      ellipse(hurtboxCenterX + cos(oa) * od, hurtboxCenterY + sin(oa) * od, random(3, 8), random(3, 8));
    }
 
    let timeLeft       = Math.ceil(this.annihilationTimer / 60);
    let dmgAccumulated = Math.floor(this.annihilationCumulativeDamage);
    fill(200, 0, 150, 255);
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(14);
    text(`MARKED: ${timeLeft}s`, hurtboxCenterX, hurtboxY - 10);
    fill(255, 0, 150, 220);
    textSize(12);
    text(`${dmgAccumulated} DMG`, hurtboxCenterX, hurtboxY - 25);
  }
 
  // Demonic Steps bonus indicator
  if (this.demonicStepsNextAttackBonus) {
    let bonusPulse = 200 + sin(frameCount * 0.4) * 55;
    fill(255, 215, 0, bonusPulse);
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(16);
    text("BONUS READY", hurtboxCenterX, hurtboxY - 25);
 
    for (let i = 0; i < 3; i++) {
      let sx = hurtboxCenterX + random(-20, 20);
      let sy = hurtboxY - 30 + random(-10, 10);
      fill(255, 215, 0, random(150, 255));
      noStroke();
      ellipse(sx, sy, random(3, 6), random(3, 6));
    }
  }
 
  // Always reset shadow so it doesn't bleed into other draws
  drawingContext.shadowBlur  = 0;
  drawingContext.shadowColor = 'rgba(0,0,0,0)';
 
  pop();
}

  // Draw hitbox (called from draw)
  drawHitbox() {
    let data = this.getHitboxData();
    if (!data.shapes || data.shapes.length === 0) return;

    if (this.hasHit) fill(0, 0);
    else fill(data.col);
    noStroke();

    for (let box of data.shapes) {
      rect(box.x, box.y, box.w, box.h);
    }
  }

  // Get hitbox data (implemented elsewhere)
  getHitboxData() {
    return getHitboxData(this);
  }
}