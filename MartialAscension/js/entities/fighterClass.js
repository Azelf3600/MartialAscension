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

  if (!this.attacking && this.isGrounded) {
    let buffer = (this === player1) ? p1Buffer : p2Buffer;
    
    if (buffer.checkDoubleTap("FW")) {
      this.isDashing = true;
      this.dashDirection = this.facing; 
      this.dashTimer = 22;
      this.dashMaxSpeed = 18; 
      this.velX = this.facing * 8;
    } else if (buffer.checkDoubleTap("BW")) {
      this.isDashing = true;
      this.dashDirection = -this.facing; 
      this.dashTimer = 20;
      this.dashMaxSpeed = 14;
      this.velX = -this.facing * 6;
    }
  }

  if (this.isDashing && this.dashTimer > 0) {
    this.dashTimer--;
    
    if (this.dashTimer > 9) {
      let accel = (this.dashDirection === this.facing) ? 2.5 : 2.0;
      this.velX += this.dashDirection * accel; 
      
      let currentSpeed = abs(this.velX);
      let maxSpeed = (this.dashDirection === this.facing) ? this.dashMaxSpeed : this.dashMaxSpeed * 0.78;
      
      if (currentSpeed > maxSpeed) {
        this.velX = this.dashDirection * maxSpeed; 
      }
    }
    
    if (this.dashTimer <= 0) {
      this.isDashing = false;
      this.dashDirection = 0;
    }
  }

  if (!this.attacking) {
    if (keyIsDown(this.controls.left)) this.x -= this.speed;
    if (keyIsDown(this.controls.right)) this.x += this.speed;
  }

  this.x += this.velX;
  
  if (this.isDashing) {
    this.velX *= 0.94;
  } else {
    this.velX *= 0.82;
  }
  
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

  this.hasHit = false;
  this.recoveryTimer = 0;
} 

  draw() {
  push();
  
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
  
  strokeWeight(2);
  if (this.isHit) stroke(255, 0, 0);
  else if (this.recoveryTimer > 0) stroke(100);
  else if (this.attackTimer > 0) stroke(255, 255, 0);
  else if (this.isDashing) stroke(255, 255, 255, 200);
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
  
  let actualAttack = this.attacking;
  
  if (this.isPerformingCombo && this.comboHits.length > 0) {
    actualAttack = this.comboHits[this.currentComboHit].attack;
  }
  
  if (this.attacking === "Launcher" && actualAttack === "HP") {
    col = color(255, 165, 0, 150);
    
    let baseW = 150;
    let baseH = 20;
    let baseY = this.y + this.h * 0.3;
    let baseX = (this.facing === 1) ? (this.x + this.w - innerOverlap) : (this.x - baseW + innerOverlap);
    shapes.push({ x: baseX, y: baseY, w: baseW, h: baseH });

    let pillW = 20;
    let pillH = 100;
    let pillX = (this.facing === 1) ? (baseX + baseW - pillW) : baseX;
    shapes.push({ x: pillX, y: baseY - (pillH - baseH), w: pillW, h: pillH });
  }
  else {
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
      atkW = 50; atkH = 15; offY = 80; col = color(150, 150, 255, 150);
    }
    else if (actualAttack === "FW") {
      atkW = 80; atkH = 20; offY = 60; col = color(100, 200, 255, 150);
    }
    
    if (atkW === 0) {
      atkW = 150; atkH = 20; offY = 30; col = color(255, 0, 255, 150);
    }

    let atkX = (this.facing === 1) ? (this.x + this.w - innerOverlap) : (this.x - atkW + innerOverlap);
    shapes.push({ x: atkX, y: this.y + offY, w: atkW, h: atkH });
    }

    return { shapes: shapes, col: col };
  }
}