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
    this.dashTrail = []; // For visual afterimage effect

    this.attacking = null;
    this.hasHit = false;
    this.attackTimer = 0;
    
    this.recoveryTimer = 0;
    this.isPerformingCombo = false;
    this.comboDamageMod = 1.0;

    this.comboHits = [];
    this.currentComboHit = 0;
    this.comboHitTimer = 0;
    this.lastHitIndex = -1; // ← NEW: Track which hit last connected


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
      this.dashDirection = this.facing; // ✅ Store actual facing direction
      this.dashTimer = 22;
      this.dashMaxSpeed = 18; // ✅ ABSOLUTE speed (no facing multiplier)
      this.velX = this.facing * 8;
    } else if (buffer.checkDoubleTap("BW")) {
      // Backdash
      this.isDashing = true;
      this.dashDirection = -this.facing; // ✅ Opposite of facing
      this.dashTimer = 20;
      this.dashMaxSpeed = 14; // ✅ ABSOLUTE speed
      this.velX = -this.facing * 6;
    }
  }

  // Active Dash Momentum
  if (this.isDashing && this.dashTimer > 0) {
    this.dashTimer--;
    
    // Acceleration phase (first ~13 frames)
    if (this.dashTimer > 9) {
      let accel = (this.dashDirection === this.facing) ? 2.5 : 2.0;
      this.velX += this.dashDirection * accel; // ✅ Use dashDirection only
      
      // ✅ FIXED: Cap using absolute values
      let currentSpeed = abs(this.velX);
      let maxSpeed = (this.dashDirection === this.facing) ? this.dashMaxSpeed : this.dashMaxSpeed * 0.78;
      
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
    this.velX *= 0.94;
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
  this.velY += this.gravity;
  this.y += this.velY;

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

  this.hasHit = false;
  this.recoveryTimer = 0;
} 

  draw() {
  push();
  
  // ✅ DASH AFTERIMAGE EFFECT
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
  
  // Main character rendering
  strokeWeight(2);
  if (this.isHit) stroke(255, 0, 0);
  else if (this.recoveryTimer > 0) stroke(100);
  else if (this.attackTimer > 0) stroke(255, 255, 0);
  else if (this.isDashing) stroke(255, 255, 255, 200); // White stroke during dash
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
  if (!this.attacking) return { shapes: [], col: color(0,0) };
  
  let shapes = [];
  let col = color(255, 150);
  let innerOverlap = 10;
  
  // Determine actual attack type
  let actualAttack = this.attacking;
  
  // If performing combo, use current hit's attack type
  if (this.isPerformingCombo && this.comboHits.length > 0) {
    actualAttack = this.comboHits[this.currentComboHit].attack;
  }
  
  // Special handling for Launcher's HP finisher
  if (this.attacking === "Launcher" && actualAttack === "HP") {
    col = color(255, 165, 0, 150);
    
    // Horizontal Base (The sweep)
    let baseW = 150;
    let baseH = 20;
    let baseY = this.y + this.h * 0.3;
    let baseX = (this.facing === 1) ? (this.x + this.w - innerOverlap) : (this.x - baseW + innerOverlap);
    shapes.push({ x: baseX, y: baseY, w: baseW, h: baseH });

    // Vertical Pillar (The "Up" part)
    let pillW = 20;
    let pillH = 100;
    let pillX = (this.facing === 1) ? (baseX + baseW - pillW) : baseX;
    shapes.push({ x: pillX, y: baseY - (pillH - baseH), w: pillW, h: pillH });
  }
  else {
    // Standard rectangular hitboxes based on attack type
    let atkW = 0, atkH = 0, offY = 0;

    if (actualAttack === "LP") {
      atkW = 150; atkH = 20; offY = 50; col = color(255, 255, 0, 150);
    } 
    else if (actualAttack === "HP") {
      atkW = 150; atkH = 20; offY = 30; col = color(255, 165, 0, 150);
    } 
    else if (actualAttack === "LK") {
      atkW = 200; atkH = 40; offY = 100; col = color(0, 255, 0, 150);
    } 
    else if (actualAttack === "HK") {
      atkW = 200; atkH = 40; offY = 100; col = color(255, 0, 0, 150);
    }
    else if (actualAttack === "DW") {
      // Crouch/down input - small startup hitbox
      atkW = 50; atkH = 15; offY = 80; col = color(150, 150, 255, 150);
    }
    else if (actualAttack === "FW") {
      // Forward dash - small hitbox
      atkW = 80; atkH = 20; offY = 60; col = color(100, 200, 255, 150);
    }
    
    // Fallback for undefined attacks
    if (atkW === 0) {
      atkW = 150; atkH = 20; offY = 30; col = color(255, 0, 255, 150);
    }

    let atkX = (this.facing === 1) ? (this.x + this.w - innerOverlap) : (this.x - atkW + innerOverlap);
    shapes.push({ x: atkX, y: this.y + offY, w: atkW, h: atkH });
    }

    return { shapes: shapes, col: col };
  }
}