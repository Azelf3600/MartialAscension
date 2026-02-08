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
    this.archetype = archetype; // Store archetype

    //Archetype Stat Calculator  
  if (this.archetype === "Offensive") {
  this.maxHp = 1000;
  this.dmgMod = 1.2; //20% more damage
  this.blockMod = 0.4; // 40% reduction
  this.blockStun = 12; 
  } else if (this.archetype === "Defensive") {
  this.maxHp = 1200;
  this.dmgMod = 0.8; //20% less damage
  this.blockMod = 0.6; // 60% reduction
  this.blockStun = 10;
  } else { // Controller / Standard
  this.maxHp = 800;
  this.dmgMod = 1.0; //Standard damage
  this.blockMod = 0.5; // 50% reduction
  this.blockStun = 6;
}

    this.isBlocking = false;
    this.attackReleased = true; 
    
    this.hp = this.maxHp; 

    this.velX = 0;
    this.velY = 0;
    this.speed = width * 0.01;
    this.gravity = height * 0.003;
    this.jumpPower = height * 0.06;
    this.facing = side;
    this.isGrounded = false;

    this.attacking = null;
    this.hasHit = false; 
    this.attackTimer = 0;
    this.isHit = false;
    this.hitStun = 0;
  }

  update(opponent, groundY) {
    if (this.hitStun > 0) {
      this.hitStun--;
      this.isHit = true;
      return; 
    }
    this.isHit = false;

    this.facing = (this.x < opponent.x) ? 1 : -1;
    this.handleMovement(groundY);
    this.handleAttack();
    this.applyPhysics(groundY);
  }

  handleMovement(groundY) {
    this.isBlocking = keyIsDown(this.controls.block) && this.isGrounded;

    // If blocking, we should probably prevent movement or attacking
    if (this.isBlocking) {
    this.speed = width * 0.002; // Slow down significantly while blocking
    this.attacking = null;     // Cannot attack while blocking
    } else {
    this.speed = this.isBlocking ? (width * 0.002) : (width * 0.01);
    }

    if (keyIsDown(this.controls.left)) this.x -= this.speed;
    if (keyIsDown(this.controls.right)) this.x += this.speed;

    if (keyIsDown(this.controls.jump) && this.isGrounded) {
      this.velY = -this.jumpPower;
      this.isGrounded = false;
    }

    if (keyIsDown(this.controls.crouch)) {
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
  }

  applyPhysics(groundY) {
    this.velY += this.gravity;
    this.y += this.velY;

    if (this.y + this.h >= groundY) {
      this.y = groundY - this.h;
      this.velY = 0;
      this.isGrounded = true;
    }
  }

  handleAttack() {
    // Check if any attack keys are currently held down
    let isAnyAttackKeyDown = 
      keyIsDown(this.controls.lightPunch) || 
      keyIsDown(this.controls.heavyPunch) || 
      keyIsDown(this.controls.lightKick) || 
      keyIsDown(this.controls.heavyKick);

    if (this.attackTimer <= 0 && !this.isBlocking) {
      // Only start a new attack if the player has released the button from the last time
      if (this.attackReleased) {
        if (keyIsDown(this.controls.lightPunch)) this.startAttack("LP");
        else if (keyIsDown(this.controls.heavyPunch)) this.startAttack("HP");
        else if (keyIsDown(this.controls.lightKick)) this.startAttack("LK");
        else if (keyIsDown(this.controls.heavyKick)) this.startAttack("HK");
      
        // If we just started an attack, set released to false
        if (this.attacking) {
          this.attackReleased = false; 
        }
      }
    } else if (this.attackTimer > 0) {
      this.attackTimer--;
    }

    // If no attack keys are held down, the player has "released" the button
      if (!isAnyAttackKeyDown) {
        this.attackReleased = true;
      }
    }

    startAttack(type) {
      this.attacking = type;
      this.hasHit = false; // Reset for the new move
        // Light attacks (10 frames) are faster than Heavy attacks (20 frames)
        if (type === "LP" || type === "LK") {
          this.attackTimer = 10; 
        }
        else {
        this.attackTimer = 20; 
        }
    }

  draw() {
    push();
    strokeWeight(2);

    // 1. Visual feedback for state
    if (this.isHit) stroke(255, 0, 0);
    else if (this.attackTimer > 0) stroke(255, 255, 0);
    else stroke(0);

    fill(this.color);

    // 2. The "Deflate" Logic
    if (this.hp <= 0) {
    // Draw a flat line/puddle at their feet
    rect(this.x, this.y + this.h - 5, this.w, 5, 2);
    } 
    else 
    {
    // Draw normal character
    rect(this.x, this.y, this.w, this.h, 5);

    // Only draw the eye if alive
    fill(0);
    let eyeX = (this.facing === 1) ? (this.x + this.w - 15) : (this.x + 5);
    rect(eyeX, this.y + 10, 10, 10);
    }

    // 3. Only draw combat visuals if alive
    if (this.hp > 0) {
      if (this.attackTimer > 0) {
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
    let box = this.getHitboxData();
    
    // If it already hit someone, make it white/faded
    if (this.hasHit) {
      fill(255, 255, 255, 100); 
    } else {
      fill(box.col);
    }
    
    noStroke();
    rect(box.x, box.y, box.w, box.h);
  }

  getHitboxData() {
    let atkW, atkH, col, offY;
    switch (this.attacking) {
      case "LP": atkW = 150; atkH = 20; offY = 50; col = color(255, 255, 0, 150); break;
      case "HP": atkW = 150; atkH = 20; offY = 50; col = color(255, 165, 0, 150); break;
      case "LK": atkW = 200; atkH = 40; offY = 100; col = color(0, 255, 0, 150); break;
      case "HK": atkW = 200; atkH = 40; offY = 100; col = color(255, 0, 0, 150); break;
      default: return { x: 0, y: 0, w: 0, h: 0, col: 0 };
    }

    // FIX: Allow the hitbox to overlap the character's own body slightly (e.g., 10 pixels)
    // This prevents the hitbox from "missing" when players are chest-to-chest.
    let innerOverlap = 10; 
    let atkX = (this.facing === 1) 
      ? (this.x + this.w - innerOverlap) 
      : (this.x - atkW + innerOverlap);

    return { x: atkX, y: this.y + offY, w: atkW, h: atkH, col: col };
  }
}