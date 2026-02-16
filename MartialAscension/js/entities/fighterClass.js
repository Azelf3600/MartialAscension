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

    this.hasUsedJudgment = false; // Can only use once per round
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

    // Flight controls (only when flying - Ethan Li only via combo check)
    if (this.isFlying && !this.isGrounded) {
      // Option 1: Hold UP to slow fall
      if (keyIsDown(this.controls.jump) && this.flightLaunchTimer <= 0) {
        this.slowFallActive = true;
        this.velY = 2; // Very slow fall
      } else {
        this.slowFallActive = false;
      }
      
      // Option 2: Dash forward to teleport behind enemy
      let buffer = (this === player1) ? p1Buffer : p2Buffer;
      if (buffer.checkDoubleTap("FW") && this.canAirDash && !this.isAirDashing) {
        this.isAirDashing = true;
        this.canAirDash = false; // Can only air dash once per flight
        this.airDashTimer = 15; // Duration of teleport dash
        
        // Calculate target position behind enemy
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
        this.velX = this.facing * 50;
      } else if (buffer.checkDoubleTap("BW")) {
        this.isDashing = true;
        this.dashDirection = -this.facing; 
        this.dashTimer = 16;
        this.dashMaxSpeed = 52;
        this.velX = -this.facing * 42;
      }
    }

    // Active Dash Momentum
    if (this.isDashing && this.dashTimer > 0) {
      this.dashTimer--;
      
      if (this.dashTimer > this.dashTimer * 0.75) {
        let accel = (this.dashDirection === this.facing) ? 6.0 : 5.5;
        this.velX += this.dashDirection * accel; 
        
        let currentSpeed = abs(this.velX);
        let maxSpeed = (this.dashDirection === this.facing) ? this.dashMaxSpeed : this.dashMaxSpeed * 0.85;
        
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

    // Apply velocity
    this.x += this.velX;
    
    // Friction
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

    // Normal Jump (only when not flying)
    if (keyIsDown(this.controls.jump) && this.isGrounded && !this.attacking && !this.isFlying) {
      this.velY = -this.jumpPower;
      this.isGrounded = false;
      this.isDashing = false;
      this.dashTimer = 0;
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
  else if (this.isGodSlashing) stroke(255, 0, 0, 255); // Red outline during God Slash
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