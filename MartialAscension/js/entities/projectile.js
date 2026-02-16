// Global projectile array
let projectiles = [];

class Projectile {
  constructor(x, y, direction, owner, type = "sword_qi") {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.owner = owner;
    this.type = type;
    this.active = true;
    this.hasHit = false;
    
    // Set dimensions based on type
    if (type === "judgment") {
      // Sword God Judgment - wide vertical beam
      this.w = 300; // Very wide
      this.h = 100; // Thick beam
      this.startX = x;
      this.startY = y;
      this.distanceTraveled = 0;
      this.maxDistance = 2000; // Travel until ground
      
      // NEW: Slow phase like Sword Qi Strike
      this.slowPhaseDistance = 100; // First 300px slow
      this.currentSpeed = 0;
      this.slowSpeed = 5; // Slow descent speed
      this.burstSpeed = 35; // Fast descent speed after 300px
      
      // NEW: Linger after hit
      this.lingerTimer = 0;
      this.isLingering = false;
    } else {
      // Sword Qi Strike - horizontal projectile
      this.w = 100;
      this.h = 20;
      this.startX = x;
      this.distanceTraveled = 0;
      this.maxDistance = 800;
      this.slowPhaseDistance = 200;
      this.currentSpeed = 0;
      this.slowSpeed = 3;
      this.burstSpeed = 25;
    }
    
    // Visual
    this.alpha = 255;
    this.trailPoints = [];
  }
  
  update() {
    if (!this.active) return;
    
    if (this.type === "judgment") {
      // NEW: Linger for 1 second after hit
      if (this.isLingering) {
        this.lingerTimer--;
        if (this.lingerTimer <= 0) {
          this.active = false;
        }
        return; // Don't move while lingering
      }
      
      // Vertical movement (downward) with slow phase
      this.distanceTraveled = abs(this.y - this.startY);
      
      // Speed phases (like Sword Qi Strike)
      if (this.distanceTraveled < this.slowPhaseDistance) {
        // Slow phase (first 300px)
        this.currentSpeed = this.slowSpeed;
      } else {
        // Burst phase (after 300px)
        this.currentSpeed = this.burstSpeed;
      }
      
      this.y += this.currentSpeed; // Move down
      
      // Add trail
      this.trailPoints.push({ x: this.x, y: this.y, alpha: 200 });
      if (this.trailPoints.length > 12) {
        this.trailPoints.shift();
      }
      
      // Deactivate if traveled max distance
      if (this.distanceTraveled >= this.maxDistance) {
        this.active = false;
      }
    } else {
      // Horizontal movement (Sword Qi Strike)
      this.distanceTraveled = abs(this.x - this.startX);
      
      if (this.distanceTraveled < this.slowPhaseDistance) {
        this.currentSpeed = this.slowSpeed;
      } else {
        this.currentSpeed = this.burstSpeed;
      }
      
      this.x += this.direction * this.currentSpeed;
      
      this.trailPoints.push({ x: this.x, y: this.y, alpha: 200 });
      if (this.trailPoints.length > 8) {
        this.trailPoints.shift();
      }
      
      if (this.distanceTraveled >= this.maxDistance) {
        this.active = false;
      }
    }
  }
  
  draw() {
  if (!this.active) return;
  
  push();
  
  if (this.type === "judgment") {
    // Judgment beam visual (vertical divine light FROM TOP TO CURRENT POSITION)
    
    rectMode(CORNER);
    
    // Calculate beam from top of screen to current position
    let beamTopY = -200; // Start from above screen
    let beamHeight = this.y - beamTopY + this.h/2; // Full height from top to current
    
    // Draw continuous beam trail (no segments, one solid beam)
    
    // Outer glow layer
    drawingContext.shadowBlur = 50;
    drawingContext.shadowColor = 'rgba(220, 240, 255, 0.8)';
    
    fill(150, 200, 255, 80);
    noStroke();
    rect(this.x - this.w * 0.6, beamTopY, this.w * 1.2, beamHeight, 20);
    
    // Middle layer
    fill(200, 230, 255, 150);
    rect(this.x - this.w * 0.5, beamTopY, this.w, beamHeight, 15);
    
    // Core beam (brightest)
    drawingContext.shadowBlur = 30;
    drawingContext.shadowColor = 'rgba(240, 250, 255, 1.0)';
    
    fill(240, 250, 255, 230);
    stroke(220, 240, 255, 200);
    strokeWeight(2);
    rect(this.x - this.w * 0.5, beamTopY, this.w, beamHeight, 12);
    
    // Inner bright core
    fill(255, 255, 255, 255);
    noStroke();
    rect(this.x - this.w * 0.3, beamTopY, this.w * 0.6, beamHeight, 8);
    
    // Energy particles along the beam
    for (let i = 0; i < 15; i++) {
      let particleX = this.x + random(-this.w/2, this.w/2);
      let particleY = beamTopY + random(0, beamHeight);
      fill(200, 230, 255, random(100, 255));
      noStroke();
      ellipse(particleX, particleY, random(5, 15), random(5, 15));
    }
    
    // Impact effect at the bottom (current position)
    if (this.isLingering || this.currentSpeed > 0) {
      // Draw impact burst at bottom of beam
      drawingContext.shadowBlur = 40;
      drawingContext.shadowColor = 'rgba(255, 255, 255, 1.0)';
      
      for (let i = 0; i < 5; i++) {
        let burstSize = 30 + (i * 20);
        noFill();
        stroke(200, 230, 255, 200 - (i * 40));
        strokeWeight(8 - i);
        ellipse(this.x, this.y + this.h/2, burstSize, burstSize * 0.5);
      }
    }
    
  } else {
    // Sword Qi Strike visual (horizontal)
    for (let i = 0; i < this.trailPoints.length; i++) {
      let point = this.trailPoints[i];
      let trailAlpha = map(i, 0, this.trailPoints.length, 50, 200);
      fill(200, 220, 255, trailAlpha);
      noStroke();
      ellipse(point.x, point.y, this.w * 0.6, this.h * 0.6);
    }
    
    rectMode(CENTER);
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = 'rgba(200, 220, 255, 0.8)';
    
    fill(220, 240, 255, this.alpha);
    stroke(150, 200, 255);
    strokeWeight(2);
    rect(this.x, this.y, this.w, this.h, 8);
    
    fill(255, 255, 255, 200);
    noStroke();
    ellipse(this.x, this.y, this.w * 0.5, this.h * 0.5);
  }
  
  pop();
}
  
checkCollision(target) {
  if (!this.active || this.hasHit) return false;
  if (target === this.owner) return false;
  
  // AABB collision
  if (this.x - this.w/2 < target.x + target.w &&
      this.x + this.w/2 > target.x &&
      this.y - this.h/2 < target.y + target.h &&
      this.y + this.h/2 > target.y) {
    
    this.hasHit = true;
    
      // NEW: Judgment beam stays active and lingers
      if (this.type !== "judgment") {
        this.active = false; // Only normal projectiles disappear on hit
      } 
    
      return true;
    }
    return false;
  }
}

// Update all projectiles
function updateProjectiles() {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    projectiles[i].update();
    
    // Remove inactive projectiles
    if (!projectiles[i].active) {
      projectiles.splice(i, 1);
    }
  }
}

// Draw all projectiles
function drawProjectiles() {
  for (let proj of projectiles) {
    proj.draw();
  }
}

// Check projectile collisions
function checkProjectileCollisions(player1, player2) {
  for (let proj of projectiles) {
    // Check player collisions
    if (proj.owner === player1 && proj.checkCollision(player2)) {
      applyProjectileDamage(player2, proj, player1);
      
      // NEW: Start linger timer for judgment beam
      if (proj.type === "judgment" && !proj.isLingering) {
        proj.isLingering = true;
        proj.lingerTimer = 60; // 1 second (60 frames)
      }
    } else if (proj.owner === player2 && proj.checkCollision(player1)) {
      applyProjectileDamage(player1, proj, player2);
      
      // NEW: Start linger timer for judgment beam
      if (proj.type === "judgment" && !proj.isLingering) {
        proj.isLingering = true;
        proj.lingerTimer = 60; // 1 second (60 frames)
      }
    }
    
    // NEW: Check ground collision for judgment beam
    if (proj.type === "judgment" && !proj.isLingering) {
      // Get ground Y from matchMulti.js (needs to be accessible)
      let groundY = height - 100; // Default ground position
      
      if (proj.y + proj.h/2 >= groundY) {
        // Hit ground, start lingering
        proj.isLingering = true;
        proj.lingerTimer = 60; // 1 second
        proj.y = groundY - proj.h/2; // Stop at ground level
      }
    }
  }
}

// Apply projectile damage
function applyProjectileDamage(target, projectile, attacker) {
  let baseDmg = 15; // Default (Sword Qi Strike)
  let stunTime = 20;
  let knockback = 15;
  let ignoreModifiers = false; // NEW: Flag for fixed damage
  
  // Check projectile type for damage
  if (projectile.type === "judgment") {
    baseDmg = 350; // Sword God Judgment damage
    stunTime = 60; // Very long stun
    knockback = 80; // Massive knockback
    ignoreModifiers = true; // NEW: Fixed damage (no modifiers)
  }
  
  // NEW: Apply or ignore damage modifiers
  let finalDmg;
  if (ignoreModifiers) {
    finalDmg = baseDmg; // Fixed damage (350 exactly)
  } else {
    finalDmg = baseDmg * attacker.dmgMod; // Normal calculation
  }
  
  applyDamage(target, finalDmg, attacker, stunTime, knockback);
  
  if (typeof spawnDamageIndicator === 'function') {
    spawnDamageIndicator(target.x + target.w/2, target.y, Math.floor(finalDmg), target.isBlocking);
  }
}

// Spawn a projectile
function spawnProjectile(x, y, direction, owner, type) {
  projectiles.push(new Projectile(x, y, direction, owner, type));
}