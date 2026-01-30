function checkHit(attacker, defender) {
  if (attacker.attacking && attacker.attackTimer > 0 && !defender.isHit && !attacker.hasHit) {
    let box = attacker.getHitboxData();

    if (box.x < defender.x + defender.w &&
        box.x + box.w > defender.x &&
        box.y < defender.y + defender.h &&
        box.y + box.h > defender.y) {
      
      let baseDmg = (attacker.attacking === "LP") ? 30 : (attacker.attacking === "LK") ? 45 : (attacker.attacking === "HP") ? 60 : 90;
      let stunTime = (attacker.attacking === "LP" || attacker.attacking === "LK") ? 15 : 25;

      // --- NEW KNOCKBACK LOGIC ---
      let knockback = 5; // Default for LP
      if (attacker.attacking === "LK" || attacker.attacking === "HP") {
        knockback = 12; // Medium
      } else if (attacker.attacking === "HK") {
        knockback = 25; // Heavy
      }

      // Pass knockback as a new 5th argument
      applyDamage(defender, baseDmg * attacker.dmgMod, attacker, stunTime, knockback);
      
      attacker.hasHit = true; 
    }
  }
}

function applyDamage(target, amount, attacker, stunTime, knockback) {
  let damageToApply = Number(amount);

  target.hitStun = target.isBlocking ? target.blockStun : stunTime;

  if (target.isBlocking) {
    damageToApply = damageToApply * (1 - target.blockMod);
  }

  target.hp -= damageToApply;
  if (target.hp < 0) target.hp = 0;
  target.isHit = true;

  if (typeof spawnDamageIndicator === "function") {
    let displayVal = Math.floor(damageToApply);
    spawnDamageIndicator(target.x + target.w / 2, target.y, displayVal, target.isBlocking);
  }
  
  // --- USE THE PASSED KNOCKBACK ---
  // If they block, we'll cut the knockback in half so they don't slide across the screen
  let finalPush = target.isBlocking ? knockback * 0.5 : knockback;
  
  let pushDir = (target.x > attacker.x) ? finalPush : -finalPush;
  target.x += pushDir;
}

function handleBodyCollision(p1, p2) {
  let isOverlappingY = p1.y < p2.y + p2.h && p1.y + p1.h > p2.y;

  if (isOverlappingY) {
    let p1Center = p1.x + p1.w / 2;
    let p2Center = p2.x + p2.w / 2;
    let dx = p1Center - p2Center;
    let minDistance = (p1.w / 2) + (p2.w / 2);

    if (Math.abs(dx) < minDistance) {
      let overlap = minDistance - Math.abs(dx);
      let pushAmount = (overlap / 2) * 0.5; 

      if (dx > 0) {
        p1.x += pushAmount;
        p2.x -= pushAmount;
      } else {
        p1.x -= pushAmount;
        p2.x += pushAmount;
      }
    }
  }
}