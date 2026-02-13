function checkHit(attacker, defender) {
  if (attacker.attacking && attacker.attackTimer > 0) {
    
    // Enhanced hit-once-per-segment protection
    let currentHitIndex = attacker.isPerformingCombo ? attacker.currentComboHit : -1;
    
    // If this specific combo segment already hit, skip entirely
    if (currentHitIndex === attacker.lastHitIndex && attacker.hasHit) {
      return; // This hit already connected, skip
    }
    
    // For non-combo attacks, prevent re-hitting during same attack
    if (!attacker.isPerformingCombo && attacker.hasHit) {
      return; // Single attacks only hit once
    }
    
    let data = attacker.getHitboxData();
    
    // Loop through all shapes in the hitbox (supports L-shape, diagonal, etc.)
    for (let box of data.shapes) {
      if (box.x < defender.x + defender.w &&
          box.x + box.w > defender.x &&
          box.y < defender.y + defender.h &&
          box.y + box.h > defender.y) {
        
        let baseDmg = 10; 
        
        // Check if we're in a combo and use actual attack type
        if (attacker.isPerformingCombo && attacker.comboHits.length > 0) {
          let actualAttack = attacker.comboHits[attacker.currentComboHit].attack;
          if (actualAttack === "LP") baseDmg = 10;
          else if (actualAttack === "HP") baseDmg = 20;
          else if (actualAttack === "LK") baseDmg = 15;
          else if (actualAttack === "HK") baseDmg = 25;
          else if (actualAttack === "DW") baseDmg = 5;  // Launcher startup
          else if (actualAttack === "FW") baseDmg = 5;  // Launcher dash
          else if (actualAttack === "UP") baseDmg = 5;  // ✅ NEW: Diving Kick jump
        } else {
          // Standard single attacks
          if (attacker.attacking === "LP") baseDmg = 10;
          else if (attacker.attacking === "LK") baseDmg = 15;
          else if (attacker.attacking === "HP") baseDmg = 20;
          else if (attacker.attacking === "HK") baseDmg = 25;
        }

        let stunTime = (baseDmg <= 15) ? 15 : 25;
        let knockback = 10; 
        
        if (attacker.attacking === "LK" || attacker.attacking === "HP" || attacker.attacking === "Launcher") {
          knockback = 20; 
        } else if (attacker.attacking === "HK" || attacker.attacking.includes("Chain")) {
          knockback = 35;
        }
        // ✅ NEW: Diving Kick knockback
        else if (attacker.attacking === "Diving Kick") {
          knockback = 30; // Strong knockback
          stunTime = 30; // Longer stun for dive
        }

        let finalCalculatedDmg = baseDmg * attacker.dmgMod * attacker.comboDamageMod;
        applyDamage(defender, finalCalculatedDmg, attacker, stunTime, knockback);
        
        attacker.hasHit = true;
        attacker.lastHitIndex = currentHitIndex;

        // ✅ NEW: Diving Kick special effect
        if (attacker.attacking === "Diving Kick" && !defender.isBlocking) {
          // Push defender down slightly (anti-crouch punish)
          defender.velY = 8; // Downward push
          defender.isGrounded = false; // Pop them up briefly
          
          // Strong horizontal knockback
          let diveDir = (defender.x > attacker.x) ? 40 : -40;
          defender.velX = diveDir;
        }

        // Launcher combo air juggle logic
        if (attacker.attacking === "Launcher" && !defender.isBlocking) {
          if (defender.isGrounded) {
            // 1st Launch: Big power
            defender.consecutiveAirHits = 1; 
            defender.velY = -defender.jumpPower * 1.6; 
            defender.isGrounded = false;
            defender.hitStun = 40; 
          } else {
            // Follow-up hits in the air
            defender.consecutiveAirHits++;

            if (defender.consecutiveAirHits === 2) {
              defender.velY = -defender.jumpPower * 0.8; 
            } 
            else if (defender.consecutiveAirHits >= 3) {
              defender.velY = -defender.jumpPower * 0.8; 
              let slamDir = (defender.x > attacker.x) ? 80 : -80;
              defender.velX = slamDir; 
              defender.velY = 15;
            }
          }
        }
        
        break; // Stop checking once a hit is confirmed
      }
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
  target.isHit = !target.isBlocking;

  if (typeof spawnDamageIndicator === "function") {
    let displayVal = Math.floor(damageToApply);
    spawnDamageIndicator(target.x + target.w / 2, target.y, displayVal, target.isBlocking);
  }
  
  let finalPush = target.isBlocking ? knockback * 0.3 : knockback;
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