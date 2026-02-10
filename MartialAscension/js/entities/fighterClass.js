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

    this.attacking = null;
    this.hasHit = false;
    this.attackTimer = 0;
    
    this.recoveryTimer = 0;
    this.isPerformingCombo = false;
    this.comboDamageMod = 1.0;

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

    if (!this.attacking) {
      let buffer = (this === player1) ? p1Buffer : p2Buffer;
      if (buffer.checkDoubleTap("FW")) {
        this.velX = this.facing * 70;
      } else if (buffer.checkDoubleTap("BW")) {
        this.velX = -this.facing * 65;
      }
    }

    if (!this.attacking) {
      if (keyIsDown(this.controls.left)) this.x -= this.speed;
      if (keyIsDown(this.controls.right)) this.x += this.speed;
    }

    this.x += this.velX;
    this.velX *= 0.8; 
    
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
      if (this.attackTimer <= 0) {
        this.recoveryTimer = !this.isPerformingCombo ? 12 : 4;
        this.attacking = null;
        this.isPerformingCombo = false;
        this.comboDamageMod = 1.0;
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
    this.hasHit = false;
    this.isPerformingCombo = true;
    this.comboDamageMod = comboData.damageMult;
    this.attackTimer = 25; 
    this.recoveryTimer = 0; 
  }

  draw() {
    push();
    strokeWeight(2);
    if (this.isHit) stroke(255, 0, 0);
    else if (this.recoveryTimer > 0) stroke(100);
    else if (this.attackTimer > 0) stroke(255, 255, 0);
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
    let name = this.attacking;
    let innerOverlap = 10;

    if (name === "Launcher") {
    col = color(255, 165, 0, 150); 
  
    // 1. Horizontal Base (The sweep)
    let baseW = 150; 
    let baseH = 20;
    let baseY = this.y + this.h * 0.3; // Store this to align the pillar
    let baseX = (this.facing === 1) ? (this.x + this.w - innerOverlap) : (this.x - baseW + innerOverlap);
    shapes.push({ x: baseX, y: baseY, w: baseW, h: baseH });

    // 2. Vertical Pillar (The "Up" part of the L)
    let pillW = 20;
    let pillH = 100; // Increased height to ensure overlap
    let pillX = (this.facing === 1) ? (baseX + baseW - pillW) : baseX;

    // FIX: Start the pillar at the same Y as the base, then subtract its height 
    // so it grows UPWARDS from the base without a gap.
    shapes.push({ x: pillX, y: baseY - (pillH - baseH), w: pillW, h: pillH });
  }

   else {
      // --- STANDARD RECTANGULAR BOXES ---
      let atkW = 0, atkH = 0, offY = 0;

      if (name === "LP" || name.includes("Punch Chain")) {
        atkW = 150; atkH = 20; offY = 50; col = color(255, 255, 0, 150);
      } 
      else if (name === "HP" || name.includes("PK Chain 1")) {
        atkW = 150; atkH = 20; offY = 30; col = color(255, 165, 0, 150);
      } 
      else if (name === "LK" || name.includes("Kick Chain") || name.includes("PK Chain 2")) {
        atkW = 200; atkH = 40; offY = 100; col = color(0, 255, 0, 150);
      } 
      else if (name === "HK") {
        atkW = 200; atkH = 40; offY = 100; col = color(255, 0, 0, 150);
      }
      
      if (atkW === 0 && this.isPerformingCombo) {
        atkW = 150; atkH = 20; offY = 30; col = color(255, 0, 255, 150);
      }

      let atkX = (this.facing === 1) ? (this.x + this.w - innerOverlap) : (this.x - atkW + innerOverlap);
      shapes.push({ x: atkX, y: this.y + offY, w: atkW, h: atkH });
    }

    return { shapes: shapes, col: col };
  }
}