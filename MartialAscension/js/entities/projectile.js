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
      this.w = 300;
      this.h = 100; 
      this.startX = x;
      this.startY = y;
      this.distanceTraveled = 0;
      this.maxDistance = 2000; 
      
      // Slow phase like Sword Qi Strike
      this.slowPhaseDistance = 100; 
      this.currentSpeed = 0;
      this.slowSpeed = 5; 
      this.burstSpeed = 35; 
      
      // Linger after hit
      this.lingerTimer = 0;
      this.isLingering = false;
    } 
    else if (type === "poison_qi") {
      // Poison Qi Palm - green projectile
      this.w = 80;  
      this.h = 80; 
      this.startX = x;
      this.distanceTraveled = 0;
      this.maxDistance = 1000; 
      this.slowPhaseDistance = 100; 
      this.currentSpeed = 0;
      this.slowSpeed = 3;
      this.burstSpeed = 25;
    }
    else if (type === "flame_needle") {
      // Flame Poison Needle
      this.w = 100;  
      this.h = 20; 
      this.startX = x;
      this.distanceTraveled = 0;
      this.maxDistance = 1000;      
      this.slowPhaseDistance = 100;
      this.currentSpeed = 0;
      this.slowSpeed = 3;           
      this.burstSpeed = 25;        
    }
    else if (type === "poison_rain") {
      // Ten Thousand Poison Flower Rain - vertical raindrop
      this.w = 40;    
      this.h = 100; 
      this.startX = x;
      this.startY = y;
      this.distanceTraveled = 0;
      this.maxDistance = 2000;      
      this.slowPhaseDistance = 150; 
      this.currentSpeed = 0;
      this.slowSpeed = 5;            
      this.burstSpeed = 35;         
    }
    else if (type === "demonic_claw") {
      // Demonic Heaven's Claw - ground launcher with full animation
      this.w = 150; 
      this.h = 0; 
      this.maxH = 200; 
      this.startX = x;
      this.startY = y;
      this.distanceTraveled = 0;
      this.maxDistance = 200; 
  
      // Phase timings with animation
      this.indicatorTimer = 60;
      this.riseTimer = 15; 
      this.lingerTimer = 30; 
      this.descendTimer = 15; 
      this.phase = "indicator"; 
  
      // Lock owner if not awakened
      if (owner && !owner.isDemonicAwakeningActive) {
          owner.demonicClawOwnerLocked = true;
      }
    }   
    else { // Sword Qi Strike
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
    // Vertical raindrop logic
    this.distanceTraveled = abs(this.y - this.startY);
    
    if (this.distanceTraveled < this.slowPhaseDistance) {
      this.currentSpeed = this.slowSpeed;
    } else {
      this.currentSpeed = this.burstSpeed;
    }
    
    this.y += this.currentSpeed; 
    
    // Trail points
    this.trailPoints.push({ x: this.x, y: this.y, alpha: 200 });
    if (this.trailPoints.length > 8) {
      this.trailPoints.shift();
    }
    
    if (this.distanceTraveled >= this.maxDistance) {
      this.active = false;
    }
  }
else if (this.type === "demonic_claw") {
  // Demonic Claw phases with full animation
  
  // Phase 1: Indicator (1 second)
  if (this.phase === "indicator") {
    this.indicatorTimer--;
    
    if (this.indicatorTimer <= 0) {
      this.phase = "rise";
      console.log("Demonic Claw rising!");
    }
  }
  
  // Phase 2: Rise (0.25 seconds)
  else if (this.phase === "rise") {
    this.riseTimer--;
    
    // Grow hitbox upward smoothly
    let riseProgress = (15 - this.riseTimer) / 15; 
    this.h = this.maxH * riseProgress;
    this.distanceTraveled = this.h;
    
    if (this.riseTimer <= 0) {
      this.phase = "linger";
      this.h = this.maxH; 
      console.log("Demonic Claw lingering at top!");
    }
  }
  
  // Phase 3: Linger (0.5 seconds)
  else if (this.phase === "linger") {
    this.lingerTimer--;
    this.h = this.maxH;
    
    if (this.lingerTimer <= 0) {
      this.phase = "descend";
      console.log("Demonic Claw descending!");
    }
  }
  
  // Phase 4: Descend (0.25 seconds)
  else if (this.phase === "descend") {
    this.descendTimer--;
    
    // Shrink hitbox downward smoothly
    let descendProgress = this.descendTimer / 15;
    this.h = this.maxH * descendProgress;
    
    if (this.descendTimer <= 0) {
      this.phase = "disappear";
        if (this.owner && this.owner.demonicClawOwnerLocked) {
        this.owner.attacking = null;
        this.owner.attackTimer = 0;
        this.owner.isPerformingCombo = false;
        this.owner.demonicClawOwnerLocked = false;
        console.log("Demonic Claw disappeared - owner unlocked!");
      }
      
      this.active = false;
    }
  }
}
  else {
    // All other projectiles use horizontal logic
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
    // Judgment beam visual
    rectMode(CORNER);
    let beamTopY = -200;
    let beamHeight = this.y - beamTopY + this.h/2;
    
    drawingContext.shadowBlur = 50;
    drawingContext.shadowColor = 'rgba(220, 240, 255, 0.8)';
    
    fill(150, 200, 255, 80);
    noStroke();
    rect(this.x - this.w * 0.6, beamTopY, this.w * 1.2, beamHeight, 20);
    
    fill(200, 230, 255, 150);
    rect(this.x - this.w * 0.5, beamTopY, this.w, beamHeight, 15);
    
    drawingContext.shadowBlur = 30;
    drawingContext.shadowColor = 'rgba(240, 250, 255, 1.0)';
    
    fill(240, 250, 255, 230);
    stroke(220, 240, 255, 200);
    strokeWeight(2);
    rect(this.x - this.w * 0.5, beamTopY, this.w, beamHeight, 12);
    
    fill(255, 255, 255, 255);
    noStroke();
    rect(this.x - this.w * 0.3, beamTopY, this.w * 0.6, beamHeight, 8);
    
    for (let i = 0; i < 15; i++) {
      let particleX = this.x + random(-this.w/2, this.w/2);
      let particleY = beamTopY + random(0, beamHeight);
      fill(200, 230, 255, random(100, 255));
      noStroke();
      ellipse(particleX, particleY, random(5, 15), random(5, 15));
    }
    
    if (this.isLingering || this.currentSpeed > 0) {
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
  } 
  
  else if (this.type === "poison_qi") {
    // Poison Qi Palm visual
    for (let i = 0; i < this.trailPoints.length; i++) {
      let point = this.trailPoints[i];
      let trailAlpha = map(i, 0, this.trailPoints.length, 50, 200);
      fill(0, 255, 100, trailAlpha);
      noStroke();
      ellipse(point.x, point.y, this.w * 0.6, this.h * 0.6);
    }
    
    rectMode(CENTER);
    drawingContext.shadowBlur = 25;
    drawingContext.shadowColor = 'rgba(0, 255, 0, 0.9)';
    
    fill(0, 255, 100, 100);
    noStroke();
    ellipse(this.x, this.y, this.w * 1.3, this.h * 1.3);
    
    fill(50, 255, 150, this.alpha);
    stroke(0, 200, 100);
    strokeWeight(2);
    ellipse(this.x, this.y, this.w, this.h);
    
    fill(150, 255, 200, 250);
    noStroke();
    ellipse(this.x, this.y, this.w * 0.5, this.h * 0.5);
    
    for (let i = 0; i < 4; i++) {
      let particleX = this.x + random(-this.w/3, this.w/3);
      let particleY = this.y + random(-this.h/3, this.h/3);
      fill(0, 255, 0, random(150, 255));
      noStroke();
      ellipse(particleX, particleY, random(3, 8), random(3, 8));
    }
  }
  
  else if (this.type === "flame_needle") {
    // Flame Poison Needle visual
    for (let i = 0; i < this.trailPoints.length; i++) {
      let point = this.trailPoints[i];
      let trailAlpha = map(i, 0, this.trailPoints.length, 50, 200);
      fill(255, 80, 0, trailAlpha);
      noStroke();
      ellipse(point.x, point.y, this.w * 0.6, this.h * 0.6);
    }
    
    rectMode(CENTER);
    drawingContext.shadowBlur = 25;
    drawingContext.shadowColor = 'rgba(255, 50, 0, 1.0)';
    
    fill(255, 50, 0, 80);
    noStroke();
    rect(this.x, this.y, this.w * 1.3, this.h * 1.3, 10);
    
    fill(255, 80, 30, this.alpha);
    stroke(255, 150, 0);
    strokeWeight(2);
    rect(this.x, this.y, this.w, this.h, 6);
    
    fill(255, 200, 100, 250);
    noStroke();
    rect(this.x, this.y, this.w * 0.5, this.h * 0.5, 4);
    
    for (let i = 0; i < 4; i++) {
      let particleX = this.x + random(-this.w/3, this.w/3);
      let particleY = this.y + random(-this.h/2, this.h/2);
      fill(255, random(50, 150), 0, random(150, 255));
      noStroke();
      ellipse(particleX, particleY, random(3, 8), random(3, 8));
    }
  }
  
  else if (this.type === "poison_rain") {
    // Poison Rain visual
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
    
    fill(0, 255, 100, 80);
    noStroke();
    ellipse(this.x, this.y, this.w * 1.3, this.h * 1.3);
    
    fill(50, 255, 150, this.alpha);
    stroke(0, 200, 100);
    strokeWeight(2);
    ellipse(this.x, this.y, this.w, this.h);
    
    fill(150, 255, 200, 250);
    noStroke();
    ellipse(this.x, this.y, this.w * 0.5, this.h * 0.4);
    
    for (let i = 0; i < 3; i++) {
      let particleX = this.x + random(-this.w/3, this.w/3);
      let particleY = this.y + random(-this.h/3, this.h/3);
      fill(0, 255, 0, random(150, 255));
      noStroke();
      ellipse(particleX, particleY, random(3, 8), random(3, 8));
    }
  }
  
  else if (this.type === "demonic_claw") {
  // Demonic Heaven's Claw visual with all phases
  
  // Indicator phase 
  if (this.phase === "indicator") {
    let pulseAlpha = 150 + sin(frameCount * 0.4) * 100;
    
    drawingContext.shadowBlur = 30;
    drawingContext.shadowColor = 'rgba(150, 0, 150, 0.8)';
    
    // Warning circle on ground
    noFill();
    stroke(200, 0, 150, pulseAlpha);
    strokeWeight(5);
    ellipse(this.x, this.startY, 60, 20);
    
    // Inner circle
    stroke(150, 0, 150, pulseAlpha * 1.2);
    strokeWeight(3);
    ellipse(this.x, this.startY, 40, 15);
    
    // Center danger marker
    fill(255, 0, 100, pulseAlpha);
    noStroke();
    ellipse(this.x, this.startY, 10, 5);
  }
  
  // Rise, Linger, and Descend phases 
  else if (this.phase === "rise" || this.phase === "linger" || this.phase === "descend") {
    rectMode(CORNER);
    
    drawingContext.shadowBlur = 35;
    drawingContext.shadowColor = 'rgba(150, 0, 150, 1.0)';
    
    // Demonic claw energy 
    fill(150, 0, 150, 200);
    noStroke();
    rect(this.x - this.w/2, this.startY - this.h, this.w, this.h, 5);
    
    // Claw edges
    stroke(200, 0, 100, 255);
    strokeWeight(3);
    noFill();
    rect(this.x - this.w/2, this.startY - this.h, this.w, this.h, 5);
    
    // Energy particles
    for (let i = 0; i < 6; i++) {
      let particleX = this.x + random(-this.w/2, this.w/2);
      let particleY = this.startY - random(0, this.h);
      fill(200, 0, 150, random(150, 255));
      noStroke();
      ellipse(particleX, particleY, random(4, 10), random(4, 10));
    }
    
    // Claw marks 
    for (let i = 0; i < 3; i++) {
      let slashX = this.x - this.w/2 + (i * this.w/3) + this.w/6;
      stroke(255, 0, 150, 200);
      strokeWeight(2);
      line(slashX, this.startY - this.h, slashX, this.startY);
    }
    
    // Extra visual feedback during linger
    if (this.phase === "linger") {
      // Pulsing intensity during linger
      let lingerPulse = 150 + sin(frameCount * 0.5) * 100;
      
      // Outer aura during linger
      noFill();
      stroke(200, 0, 150, lingerPulse);
      strokeWeight(4);
      rect(this.x - this.w/2 - 5, this.startY - this.h - 5, this.w + 10, this.h + 10, 5);
    }
  }
}
  
  else {
    // Default: Sword Qi Strike visual (horizontal)
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
 
  // ✅ Use hurtbox coordinates to match the new crouch system
  let hbX = target.x + target.hurtboxOffsetX;
  let hbY = target.y + target.hurtboxOffsetY;
  let hbW = target.hurtboxWidth;
  let hbH = target.hurtboxHeight;
 
  // Projectile left/right/top/bottom edges
  let projLeft   = this.x - this.w / 2;
  let projRight  = this.x + this.w / 2;
  let projTop    = this.y - this.h / 2;
  let projBottom = this.y + this.h / 2;
 
  // Demonic Claw uses CORNER-mode rect anchored at startY
  if (this.type === "demonic_claw") {
    // Only collide during rise / linger phases
    if (this.phase !== "rise" && this.phase !== "linger") return false;
 
    let clawLeft   = this.x - this.w / 2;
    let clawRight  = this.x + this.w / 2;
    let clawTop    = this.startY - this.h;
    let clawBottom = this.startY;
 
    return (
      clawLeft  < hbX + hbW &&
      clawRight > hbX       &&
      clawTop   < hbY + hbH &&
      clawBottom > hbY
    );
  }
 
  // All other projectiles
  let hit = (
    projLeft   < hbX + hbW &&
    projRight  > hbX       &&
    projTop    < hbY + hbH &&
    projBottom > hbY
  );
 
  if (hit) {
    this.hasHit = true;
 
    // Judgment lingers on hit instead of deactivating
    if (this.type !== "judgment") {
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
      if (proj.y + proj.h / 2 >= groundY) {
        proj.isLingering = true;
        proj.lingerTimer = 60;
        proj.y = groundY - proj.h / 2;
      }
    }
 
    // Ground collision for poison rain
    if (proj.type === "poison_rain" && proj.active) {
      let groundY = height - 100;
      if (proj.y + proj.h / 2 >= groundY) {
        proj.active = false;
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
  let ignoreBlock = false; 

  
  if (projectile.type === "judgment") {
    baseDmg = 350;
    stunTime = 60;
    knockback = 80;
    ignoreModifiers = true;
    ignoreBlock = true;
  } else if (projectile.type === "poison_qi") {
    baseDmg = 20;
    stunTime = 180;
    knockback = 20;
    ignoreModifiers = false;
    ignoreBlock = false;
  } else if (projectile.type === "flame_needle") {
    baseDmg = 20;
    stunTime = 20;
    knockback = 15;
    ignoreModifiers = false;
    ignoreBlock = false;
  
  if (!target.isOceanMendingActive) {
      target.isPoisoned = true;
      target.poisonDamage = 10;
      target.poisonTimer = 180;
      target.poisonTickInterval = 60;
      target.poisonTickTimer = 60;
      target.poisonAttacker = attacker;
      console.log("Flame Poison Needle hit! Poison applied for 3 seconds.");
      } else {
      console.log("Flame Poison Needle poison blocked by Ocean Mending Water!");
    }
  }
  else if (projectile.type === "poison_rain") {
    // Ten Thousand Poison Flower Rain - each drop
    baseDmg = 500 / 10; 
    stunTime = 30;
    knockback = 20;
    ignoreModifiers = false;
    ignoreBlock = true;
  }
  else if (projectile.type === "demonic_claw") {
    // Demonic Heaven's Claw
    baseDmg = 30;
    stunTime = 0; 
    knockback = 0; 
    ignoreModifiers = false; 
    ignoreBlock = false; 
    }

  
  let finalDmg;
  if (ignoreModifiers) {
    finalDmg = baseDmg;
  } else {
    finalDmg = baseDmg * attacker.dmgMod;
  }
  
  applyDamage(target, finalDmg, attacker, stunTime, knockback, ignoreBlock);
  
// Demonic Claw launcher effect
if (projectile.type === "demonic_claw") {
  if (target.isOceanMendingActive) {
    console.log("Demonic Claw launch blocked by Ocean Mending Water!");
  } else {
    target.velY = -target.jumpPower * 1.8;
    target.isGrounded = false;
    target.hitStun = 0;
    target.isBlocking = false;
    console.log("Demonic Claw launched enemy!");
  }
}

  if (typeof spawnDamageIndicator === 'function') {
    spawnDamageIndicator(target.x + target.w/2, target.y, Math.floor(finalDmg), target.isBlocking);
  }
}

// Spawn a projectile
function spawnProjectile(x, y, direction, owner, type) {
  projectiles.push(new Projectile(x, y, direction, owner, type));
}