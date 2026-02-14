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
    this.consecutiveAirHits = 0; // Track hits while airborne

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

  // ✅ FIXED TEKKEN-STYLE DASH - BALANCED FOR BOTH PLAYERS
  if (!this.attacking && this.isGrounded) {
    let buffer = (this === player1) ? p1Buffer : p2Buffer;
    
    if (buffer.checkDoubleTap("FW")) {
      // Forward Dash
      this.isDashing = true;
      this.dashDirection = this.facing; 
      this.dashTimer = 18;           // Slightly longer for 900px
      this.dashMaxSpeed = 60;        // Much faster (was 45)
      this.velX = this.facing * 50;  // Massive initial burst (was 35)
    } else if (buffer.checkDoubleTap("BW")) {
      // Backdash
      this.isDashing = true;
      this.dashDirection = -this.facing; 
      this.dashTimer = 16;           // Slightly longer for distance
      this.dashMaxSpeed = 52;        // Much faster (was 38)
      this.velX = -this.facing * 42; // Massive initial burst (was 28)
    }
  }

  // Active Dash Momentum
  if (this.isDashing && this.dashTimer > 0) {
    this.dashTimer--;
    
    // Only accelerate in the first 25% of dash (was 30%)
    if (this.dashTimer > this.dashTimer * 0.75) {
      let accel = (this.dashDirection === this.facing) ? 6.0 : 5.5; // Even higher accel
      this.velX += this.dashDirection * accel; 
      
      // ✅ FIXED: Cap using absolute values
      let currentSpeed = abs(this.velX);
      let maxSpeed = (this.dashDirection === this.facing) ? this.dashMaxSpeed : this.dashMaxSpeed * 0.85;
      
      if (currentSpeed > maxSpeed) {
        this.velX = this.dashDirection * maxSpeed; // ✅ Apply direction to max speed
      }
    }
    
    // End of dash
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
    this.velX *= 0.70; // Even faster decay (was 0.75) - very snappy stop
  } else {
    this.velX *= 0.82;
  }
  
  // Crouch
  if (keyIsDown(this.controls.crouch) && this.isGrounded) {
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

  // Jump
  if (keyIsDown(this.controls.jump) && this.isGrounded && !this.attacking) {
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
    
    // Phase 1: Jump up (first 8 frames)
    if (this.diveTimer > 35) {
      // Normal jump arc
      this.velY += this.gravity;
    }
    // Phase 2: Forward momentum (frames 35-25)
    else if (this.diveTimer > 25) {
      // Start accelerating downward
      this.diveVelY += this.gravity * 1.5; // Faster downward accel
      this.velY = this.diveVelY;
      this.x += this.diveVelX; // Forward movement
    }
    // Phase 3: Diving kick (last 25 frames)
    else {
      // Steep dive angle
      this.diveVelY += this.gravity * 2.0; // Even faster dive
      this.velY = this.diveVelY;
      this.x += this.diveVelX * 1.2; // Faster forward during kick
    }
    
    // End dive on landing or timer expiry
    if (this.y + this.h >= groundY || this.diveTimer <= 0) {
      this.isDiving = false;
      this.diveTimer = 0;
      this.diveVelX = 0;
      this.diveVelY = 0;
    }
  } else {
    // Normal gravity when not diving
    this.velY += this.gravity;
  }
  
  this.y += this.velY;

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
    
    // --- RESET SCALING HERE ---
    this.gravity = height * 0.003; // Reset to default gravity
    this.consecutiveAirHits = 0;   // Reset hit counter
    this.velX = 0;                 // Stop knockback momentum
  }
}

  handleAttack() {
  if (this.attackTimer > 0) {
    this.attackTimer--;
    
    // Handle combo progression
    if (this.isPerformingCombo && this.comboHits.length > 0) {
      this.comboHitTimer--;
      
      // Move to next hit when current hit finishes
      if (this.comboHitTimer <= 0) {
        if (this.currentComboHit < this.comboHits.length - 1) {
          // Progress to next hit
          this.currentComboHit++;
          this.comboHitTimer = this.comboHits[this.currentComboHit].duration;
          this.hasHit = false; // Reset so next hit can register
          this.lastHitIndex = -1; // Reset hit tracker
        } else {
          // ✅ FIX: On the FINAL hit, lock it after first connection
          // This prevents the last hit from registering multiple times
          if (this.hasHit) {
            this.lastHitIndex = this.currentComboHit; // Lock this hit
          }
        }
      }
    }
    
    // Combo/attack finished
    if (this.attackTimer <= 0) {
      this.recoveryTimer = !this.isPerformingCombo ? 12 : 4;
      this.attacking = null;
      this.isPerformingCombo = false;
      this.comboDamageMod = 1.0;
      
      // Reset combo tracking
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
  this.attacking = comboData.name;
  this.isPerformingCombo = true;
  this.comboDamageMod = comboData.damageMult;

  // ✅ FIX: Clear floating damage numbers from previous attacks
  // This prevents visual confusion
  if (typeof damageIndicators !== 'undefined') {
    damageIndicators = damageIndicators.filter(ind => ind.life < 100);
    // Only keeps very fresh indicators (< 100 life means they just spawned)
  }

  // NEW: Set up multi-hit progression
  this.comboHits = comboData.hits || [];
  this.currentComboHit = 0;

  if (this.comboHits.length > 0) {
    // Calculate total duration
    let totalDuration = this.comboHits.reduce((sum, hit) => sum + hit.duration, 0);
    this.attackTimer = totalDuration;
    this.comboHitTimer = this.comboHits[0].duration;
  } else {
    // Fallback if no hits defined
    this.attackTimer = 25;
    this.comboHitTimer = 25;
  }

  // Trigger launcher slide (300px)
  if (comboData.name === "Launcher") {
    this.isLauncherSliding = true;
    this.launcherSlideTimer = 15; // Duration of slide
    this.launcherSlideSpeed = this.facing * 10; // Reduced from 35 (300px range)
  }

    if (comboData.name === "Diving Kick") {
    this.isDiving = true;
    this.diveTimer = 43; // Total duration (8 + 10 + 25)
    this.isGrounded = false; // Launch into air
    
    // Jump up and forward
    this.velY = -this.jumpPower * 1.2; // Higher jump
    this.diveVelX = this.facing * 12; // Forward momentum
    this.diveVelY = 0; // Will accelerate downward
  }

  this.hasHit = false;
  this.recoveryTimer = 0;
}

  draw() {
  push();
  
  // Dash trail
  if (this.isDashing && this.dashTimer > 0) {
    // Draw 3 fading afterimages behind the character
    for (let i = 1; i <= 3; i++) {
      let trailX = this.x - (this.velX * i * 0.3); // Position behind based on velocity
      let alpha = 100 - (i * 25); // Fade out
      
      push();
      fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], alpha);
      noStroke();
      rect(trailX, this.y, this.w, this.h, 5);
      pop();
    }
    
    // Glowing outline on main character
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = 'rgba(255, 255, 255, 0.8)';
  }
  
  // NEW: Launcher slide trail
  if (this.isLauncherSliding && this.launcherSlideTimer > 0) {
    for (let i = 1; i <= 4; i++) {
      let trailX = this.x - (this.launcherSlideSpeed * i * 0.25); 
      let alpha = 120 - (i * 30);
      
      push();
      fill(255, 165, 0, alpha); // Orange trail for launcher
      noStroke();
      rect(trailX, this.y, this.w, this.h, 5);
      pop();
    }
    
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = 'rgba(255, 165, 0, 0.9)'; // Orange glow
  }
  
  strokeWeight(2);
  if (this.isHit) stroke(255, 0, 0);
  else if (this.recoveryTimer > 0) stroke(100);
  else if (this.attackTimer > 0) stroke(255, 255, 0);
  else if (this.isDashing || this.isLauncherSliding) stroke(255, 255, 255, 200);
  else stroke(0);

  fill(this.color);
  if (this.hp <= 0) {
    rect(this.x, this.y + this.h - 5, this.w, 5, 2);
  } else {
    rect(this.x, this.y, this.w, this.h, 5);
    fill(0);
    let eyeX = (this.facing === 1) ? (this.x + this.w - 15) : (this.x + 5);
    rect(eyeX, this.y + 10, 10, 10);
  }

  if (this.hp > 0) {
    if (this.attackTimer > 0) this.drawHitbox();
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
    // Delegate to centralized hitbox system
    return getHitboxData(this);
  }
}