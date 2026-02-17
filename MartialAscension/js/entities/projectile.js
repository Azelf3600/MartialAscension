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
      this.slowPhaseDistance = 100; // First 100px slow
      this.currentSpeed = 0;
      this.slowSpeed = 5; // Slow descent speed
      this.burstSpeed = 35; // Fast descent speed after 300px
      
      // NEW: Linger after hit
      this.lingerTimer = 0;
      this.isLingering = false;
    } 
    else if (type === "poison_qi") {
      // NEW: Poison Qi Palm - green projectile
      this.w = 80;  // Width - ADJUSTABLE
      this.h = 80;  // Height - ADJUSTABLE
      this.startX = x;
      this.distanceTraveled = 0;
      this.maxDistance = 1000; // Same as Sword Qi Strike
      this.slowPhaseDistance = 100; // Same as Sword Qi Strike
      this.currentSpeed = 0;
      this.slowSpeed = 3; // Same as Sword Qi Strike
      this.burstSpeed = 25; // Same as Sword Qi Strike
    }
    else if (type === "flame_needle") {
      // NEW: Flame Poison Needle
      this.w = 100;  // Same as Sword Qi Strike width
      this.h = 20;   // Same as Sword Qi Strike height
      this.startX = x;
      this.distanceTraveled = 0;
      this.maxDistance = 1000;      // Same as Sword Qi Strike
      this.slowPhaseDistance = 100; // Same as Sword Qi Strike
      this.currentSpeed = 0;
      this.slowSpeed = 3;           // Same as Sword Qi Strike
      this.burstSpeed = 25;         // Same as Sword Qi Strike
    }
    else if (type === "poison_rain") {
      // Ten Thousand Poison Flower Rain - vertical raindrop
      this.w = 40;    // Width (as specified)
      this.h = 100;   // Height (as specified)
      this.startX = x;
      this.startY = y;
      this.distanceTraveled = 0;
      this.maxDistance = 2000;       // Travel until ground
      this.slowPhaseDistance = 150;  // Slow for first 100px like judgment
      this.currentSpeed = 0;
      this.slowSpeed = 5;            // Slow phase speed
      this.burstSpeed = 35;          // Burst phase speed
    }
    else { // Sword Qi Strike - horizontal projectile
      this.w = 100;
      this.h = 20;
      this.startX = x;
      this.distanceTraveled = 0;
      this.maxDistance = 800;
      this.slowPhaseDistance = 100;
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
    // Vertical judgment beam logic
    if (this.isLingering) {
      this.lingerTimer--;
      if (this.lingerTimer <= 0) {
        this.active = false;
      }
      return;
    }
    
    this.distanceTraveled = abs(this.y - this.startY);
    
    if (this.distanceTraveled < this.slowPhaseDistance) {
      this.currentSpeed = this.slowSpeed;
    } else {
      this.currentSpeed = this.burstSpeed;
    }
    
    this.y += this.currentSpeed;
    
    this.trailPoints.push({ x: this.x, y: this.y, alpha: 200 });
    if (this.trailPoints.length > 12) {
      this.trailPoints.shift();
    }
    
    if (this.distanceTraveled >= this.maxDistance) {
      this.active = false;
    }
  } else if (this.type === "poison_rain") {
    // NEW: Vertical raindrop logic (like judgment but NOT a laser)
    this.distanceTraveled = abs(this.y - this.startY);
    
    if (this.distanceTraveled < this.slowPhaseDistance) {
      this.currentSpeed = this.slowSpeed;
    } else {
      this.currentSpeed = this.burstSpeed;
    }
    
    this.y += this.currentSpeed; // Move downward
    
    // Trail points
    this.trailPoints.push({ x: this.x, y: this.y, alpha: 200 });
    if (this.trailPoints.length > 8) {
      this.trailPoints.shift();
    }
    
    if (this.distanceTraveled >= this.maxDistance) {
      this.active = false;
    }
  } else {
    // ALL other projectiles use horizontal logic
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
    
  } else if (this.type === "poison_qi") {
      // NEW: Poison Qi Palm visual (GREEN)
      
      // Draw trail (green energy trail)
      for (let i = 0; i < this.trailPoints.length; i++) {
        let point = this.trailPoints[i];
        let trailAlpha = map(i, 0, this.trailPoints.length, 50, 200);
        fill(0, 255, 100, trailAlpha); // Green trail
        noStroke();
        ellipse(point.x, point.y, this.w * 0.6, this.h * 0.6);
      }
      
      rectMode(CENTER);
      drawingContext.shadowBlur = 25;
      drawingContext.shadowColor = 'rgba(0, 255, 0, 0.9)'; // Green glow
      
      // Outer glow
      fill(0, 255, 100, 100);
      noStroke();
      ellipse(this.x, this.y, this.w * 1.3, this.h * 1.3);
      
      // Main body
      fill(50, 255, 150, this.alpha);
      stroke(0, 200, 100);
      strokeWeight(2);
      ellipse(this.x, this.y, this.w, this.h);
      
      // Inner bright core
      fill(150, 255, 200, 250);
      noStroke();
      ellipse(this.x, this.y, this.w * 0.5, this.h * 0.5);
      
      // Toxic particles
      for (let i = 0; i < 4; i++) {
        let particleX = this.x + random(-this.w/3, this.w/3);
        let particleY = this.y + random(-this.h/3, this.h/3);
        fill(0, 255, 0, random(150, 255));
        noStroke();
        ellipse(particleX, particleY, random(3, 8), random(3, 8));
      }
      
    }

  else if (this.type === "flame_needle") {
  // Flame Poison Needle visual (RED/ORANGE glow)
  
  // Draw trail (red/orange energy trail)
  for (let i = 0; i < this.trailPoints.length; i++) {
    let point = this.trailPoints[i];
    let trailAlpha = map(i, 0, this.trailPoints.length, 50, 200);
    fill(255, 80, 0, trailAlpha); // Orange-red trail
    noStroke();
    ellipse(point.x, point.y, this.w * 0.6, this.h * 0.6);
    }
  
    rectMode(CENTER);
    drawingContext.shadowBlur = 25;
    drawingContext.shadowColor = 'rgba(255, 50, 0, 1.0)'; // Red glow
  
    // Outer glow
    fill(255, 50, 0, 80);
    noStroke();
    rect(this.x, this.y, this.w * 1.3, this.h * 1.3, 10);
  
    // Main body (red elongated needle)
    fill(255, 80, 30, this.alpha);
    stroke(255, 150, 0);
    strokeWeight(2);
    rect(this.x, this.y, this.w, this.h, 6);
  
    // Inner bright core (orange-white)
    fill(255, 200, 100, 250);
    noStroke();
    rect(this.x, this.y, this.w * 0.5, this.h * 0.5, 4);
  
    // Fire particles
    for (let i = 0; i < 4; i++) {
      let particleX = this.x + random(-this.w/3, this.w/3);
      let particleY = this.y + random(-this.h/2, this.h/2);
      fill(255, random(50, 150), 0, random(150, 255));
      noStroke();
      ellipse(particleX, particleY, random(3, 8), random(3, 8));
    }
  }
  else if (this.type === "poison_rain") {  
  // Draw trail (green energy trail going upward)
  for (let i = 0; i < this.trailPoints.length; i++) {
    let point = this.trailPoints[i];
    let trailAlpha = map(i, 0, this.trailPoints.length, 50, 200);
    fill(0, 255, 100, trailAlpha);
    noStroke();
    ellipse(point.x, point.y, this.w * 0.5, this.h * 0.3);
  }
  
  rectMode(CENTER);
    drawingContext.shadowBlur = 25;
    drawingContext.shadowColor = 'rgba(0, 255, 0, 0.9)';
  
    // Outer glow
    fill(0, 255, 100, 80);
    noStroke();
    ellipse(this.x, this.y, this.w * 1.3, this.h * 1.3);
  
    // Main raindrop body (elongated like a teardrop)
    fill(50, 255, 150, this.alpha);
    stroke(0, 200, 100);
    strokeWeight(2);
    ellipse(this.x, this.y, this.w, this.h);
  
    // Inner bright core
    fill(150, 255, 200, 250);
    noStroke();
    ellipse(this.x, this.y, this.w * 0.5, this.h * 0.4);
  
  // Toxic particles
  for (let i = 0; i < 3; i++) {
    let particleX = this.x + random(-this.w/3, this.w/3);
    let particleY = this.y + random(-this.h/3, this.h/3);
    fill(0, 255, 0, random(150, 255));
    noStroke();
    ellipse(particleX, particleY, random(3, 8), random(3, 8));
    }
  }
  else {
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
  
  if (this.x - this.w/2 < target.x + target.w &&
    this.x + this.w/2 > target.x &&
    this.y - this.h/2 < target.y + target.h &&
    this.y + this.h/2 > target.y) {
    
    this.hasHit = true;
    
      if (this.type === "judgment") {
        // Judgment lingers - handled in checkProjectileCollisions
      } else {
        // All others (including poison_rain) disappear on hit
        this.active = false;
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

//Check Projectile Collision
function checkProjectileCollisions(player1, player2) {
  for (let proj of projectiles) {
    if (proj.owner === player1 && proj.checkCollision(player2)) {
      applyProjectileDamage(player2, proj, player1);
      
      if (proj.type === "judgment" && !proj.isLingering) {
        proj.isLingering = true;
        proj.lingerTimer = 60;
      }
    } else if (proj.owner === player2 && proj.checkCollision(player1)) {
      applyProjectileDamage(player1, proj, player2);
      
      if (proj.type === "judgment" && !proj.isLingering) {
        proj.isLingering = true;
        proj.lingerTimer = 60;
      }
    }
    
    // Ground collision for judgment
    if (proj.type === "judgment" && !proj.isLingering) {
      let groundY = height - 100;
      if (proj.y + proj.h/2 >= groundY) {
        proj.isLingering = true;
        proj.lingerTimer = 60;
        proj.y = groundY - proj.h/2;
      }
    }
    
    // NEW: Ground collision for poison rain - just disappear
    if (proj.type === "poison_rain" && proj.active) {
      let groundY = height - 100;
      if (proj.y + proj.h/2 >= groundY) {
        proj.active = false; // Just disappear on ground hit
      }
    }
  }
}

// Apply projectile damage
function applyProjectileDamage(target, projectile, attacker) {
  let baseDmg = 15;
  let stunTime = 20;
  let knockback = 15;
  let ignoreModifiers = false;
  
  if (projectile.type === "judgment") {
    baseDmg = 350;
    stunTime = 60;
    knockback = 80;
    ignoreModifiers = true;
  } else if (projectile.type === "poison_qi") {
    baseDmg = 20;
    stunTime = 120;
    knockback = 20;
    ignoreModifiers = false;
  } else if (projectile.type === "flame_needle") {
    baseDmg = 20;        // Initial hit damage
    stunTime = 20;
    knockback = 15;
    ignoreModifiers = false;
    
    // Apply poison DOT (damage over time) to target
    target.isPoisoned = true;
    target.poisonDamage = 10;       // 10 damage per tick
    target.poisonTimer = 180;       // Damage Duration (180 frames = 3 seconds)
    target.poisonTickInterval = 60; // Tick every 1 second
    target.poisonTickTimer = 60;    // First tick after 1 second
    target.poisonAttacker = attacker; // Track who applied poison
    
    console.log("Flame Poison Needle hit! Poison applied for 3 seconds.");
  }
  else if (projectile.type === "poison_rain") {
    // NEW: Ten Thousand Poison Flower Rain - each drop
    baseDmg = 500 / 10; // 350 total / 5 drops = 70 per drop
    stunTime = 30;
    knockback = 20;
    ignoreModifiers = false; // Uses archetype modifiers
  }
  
  let finalDmg;
  if (ignoreModifiers) {
    finalDmg = baseDmg;
  } else {
    finalDmg = baseDmg * attacker.dmgMod;
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