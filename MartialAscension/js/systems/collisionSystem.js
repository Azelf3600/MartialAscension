function checkHit(attacker, defender) {
  if (attacker.attacking && attacker.attackTimer > 0) {
    
    let currentHitIndex = attacker.isPerformingCombo ? attacker.currentComboHit : -1;
    
    if (currentHitIndex === attacker.lastHitIndex && attacker.hasHit) {
      return; 
    }
    
    if (!attacker.isPerformingCombo && attacker.hasHit) {
      return; 
    }
    
    let data = attacker.getHitboxData();
    
    for (let box of data.shapes) {
// ✅ Use hurtbox dimensions for collision detection
let defenderHurtboxX = defender.x + defender.hurtboxOffsetX;
let defenderHurtboxY = defender.y + defender.hurtboxOffsetY;

if (box.x < defenderHurtboxX + defender.hurtboxWidth &&
    box.x + box.w > defenderHurtboxX &&
    box.y < defenderHurtboxY + defender.hurtboxHeight &&
    box.y + box.h > defenderHurtboxY) {
        
        let baseDmg = 10;  
        let isSwordQiLunge = (attacker.attacking === "Sword Qi Lunge");
        let isSwordGodSlash = (attacker.attacking === "Sword God Slash"); 
        let isUnstoppableSeaDragon = (attacker.attacking === "Unstoppable Sea Dragon");
        let isAzureFlowingDragon = (attacker.attacking === "Azure Flowing Dragon");
        
        if (isSwordQiLunge) {
          baseDmg = 35; // Fixed damage
        } else if (isSwordGodSlash) {
          baseDmg = 100; // Fixed damage
        } else if (isUnstoppableSeaDragon){
          baseDmg = 50;
            // Grab enemy on first hit
            if (!attacker.hasHit && !attacker.seaDragonTarget) {
              attacker.seaDragonTarget = defender;
              console.log("Sea Dragon grabbed enemy!");
            }
        } else if(isAzureFlowingDragon) {
          baseDmg = 250
        } else if (attacker.isPerformingCombo && attacker.comboHits.length > 0) {
          // Normal combo damage calculations
          let actualAttack = attacker.comboHits[attacker.currentComboHit].attack;
          if (actualAttack === "LP") baseDmg = 10;
          else if (actualAttack === "HP") baseDmg = 20;
          else if (actualAttack === "LK") baseDmg = 15;
          else if (actualAttack === "HK") baseDmg = 25;
          else if (actualAttack === "DW") baseDmg = 5;
          else if (actualAttack === "FW") baseDmg = 5;
          else if (actualAttack === "UP") baseDmg = 5;
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
        } else if (attacker.attacking === "Diving Kick") {
          knockback = 30;
          stunTime = 30;
        } else if (isSwordQiLunge) {
          // Sword Qi Lunge knockback
          knockback = 40; 
          stunTime = 35;  
        } else if (isSwordGodSlash) {
          // Sword God Slash knockback
          knockback = 60; 
          stunTime = 50;  
        } else if (attacker.attacking === "Unstoppable Sea Dragon") {
          knockback = 0; 
          stunTime = 999; 
        } else if (attacker.attacking === "Azure Flowing Dragon") {
          knockback = 50;
          stunTime = 40;
        }

        let finalCalculatedDmg;
          if (isSwordQiLunge) {
          finalCalculatedDmg = 35;
        } else {
          let poisonBonus = 1.0;
  
        // Poison Hands bonus
        if (attacker.isPoisonHandsActive && !attacker.isPerformingCombo) {
          poisonBonus = 1.5;
        }
        // Poison Flower Field bonus
        else if (attacker.isPoisonFieldActive && !attacker.isPerformingCombo) {
          poisonBonus = 1.3;
        }

        // Apply archetype modifier first
        let effectiveDmgMod = attacker.dmgMod;
        let wasTortoiseActive = false;
        if (attacker.attacking === "Unstoppable Sea Dragon") {
        if (attacker.archetype === "Defensive") {
          wasTortoiseActive = true;
          effectiveDmgMod = 1.0; 
        } else {
          effectiveDmgMod = 0.6; 
        }
      }  
          // Normal Tortoise Body check
          else if (attacker.isTortoiseBodyActive && attacker.archetype === "Defensive") {
            effectiveDmgMod = 1.0; // Boost from 0.8 to 1.2
          }

          // Demonic Heaven's Awakening - 1.4x damage 
          if (attacker.isDemonicAwakeningActive && attacker.archetype === "Offensive") {
            effectiveDmgMod = 1.4; 
          }
  
          finalCalculatedDmg = baseDmg * effectiveDmgMod * attacker.comboDamageMod * poisonBonus;
        }
        
        let ignoreBlock = isSwordQiLunge || isSwordGodSlash || isUnstoppableSeaDragon || isAzureFlowingDragon;
        applyDamage(defender, finalCalculatedDmg, attacker, stunTime, knockback, ignoreBlock);
        
        attacker.hasHit = true;
        attacker.lastHitIndex = currentHitIndex;

        // Diving Kick special effect
        if (attacker.attacking === "Diving Kick" && !defender.isBlocking) {
          defender.velY = 8; 
          defender.isGrounded = false; 
          let diveDir = (defender.x > attacker.x) ? 40 : -40;
          defender.velX = diveDir;
        }

        // Launcher combo air juggle logic
        if (attacker.attacking === "Launcher" && !defender.isBlocking) {
        // Skip launcher if Ocean Mending is active
        if (defender.isOceanMendingActive) {
          console.log("Launcher blocked by Ocean Mending Water!");
        } else {
        if (defender.isGrounded) {
          defender.consecutiveAirHits = 1; 
          defender.velY = -defender.jumpPower * 1.6; 
          defender.isGrounded = false;
          defender.hitStun = 40; 
        } else {
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
  }

  // Azure Flowing Dragon - launcher juggle effect
if (attacker.attacking === "Azure Flowing Dragon") {
  // Skip if Ocean Mending is active
  if (defender.isOceanMendingActive) {
    console.log("Azure Dragon launch blocked by Ocean Mending Water!");
  } else {
    // First hit - big launch
    if (defender.isGrounded) {
      defender.consecutiveAirHits = 1;
      defender.velY = -defender.jumpPower * 2.0; 
      defender.isGrounded = false;
      defender.hitStun = 45;
      console.log("Azure Flowing Dragon launched enemy!");
    } 
    // Already airborne juggle
    else {
      defender.consecutiveAirHits++;
      
      if (defender.consecutiveAirHits === 2) {
        defender.velY = -defender.jumpPower * 1.0;
      } 
      else if (defender.consecutiveAirHits >= 3) {
        defender.velY = -defender.jumpPower * 0.8;
        let slamDir = (defender.x > attacker.x) ? 80 : -80;
        defender.velX = slamDir;
        defender.velY = 15;
      }
    }
  }
}
        break;
      }
    }
  }
}


function applyDamage(target, amount, attacker, stunTime, knockback,ignoreBlock = false) {
  let damageToApply = Number(amount);
  target.hitStun = target.isBlocking ? target.blockStun : stunTime;

    // Block hitstun if Ocean Mending is active
  if (target.isOceanMendingActive) {
    target.hitStun = 0; 
  } else {
    target.hitStun = target.isBlocking ? target.blockStun : stunTime;
  }

    // Undying Tortoise Body - 
  if (target.isTortoiseBodyActive) {
    damageToApply = damageToApply * 0.8; 
  }

  // Apply block reduction unless ignored
  if (target.isBlocking && !ignoreBlock) {
    damageToApply = damageToApply * (1 - target.blockMod);
  }

  // Azure Dragon Scales 
  if (target.isAzureScalesActive) {
    let reflectedDmg = damageToApply * 0.5;
    
    // Apply reflected damage to attacker
    attacker.hp -= reflectedDmg;
    if (attacker.hp < 0) attacker.hp = 0;
    
    // Show reflection indicator on attacker
    if (typeof spawnDamageIndicator === "function") {
      spawnDamageIndicator(
        attacker.x + attacker.w / 2,
        attacker.y - 30,
        Math.floor(reflectedDmg),
        false
      );
    }
    
    console.log(`Azure Scales reflected ${Math.floor(reflectedDmg)} damage!`);
  }

if (target.isAnnihilationMarked && target.annihilationCaster === attacker) {
  let trackedDamage = damageToApply * 0.5; 
  target.annihilationCumulativeDamage += trackedDamage;
  console.log(`Annihilation tracking: ${Math.floor(trackedDamage)} damage (Total: ${Math.floor(target.annihilationCumulativeDamage)})`);
}

  target.hp -= damageToApply;
  if (target.hp < 0) target.hp = 0;
  target.isHit = !target.isBlocking;

  // Demonic Heaven's Awakening 
if (attacker.isDemonicAwakeningActive) {
  let lifestealAmount = damageToApply * 0.4;
  
  // Heal attacker
  attacker.hp = Math.min(attacker.hp + lifestealAmount, attacker.maxHp);
  
  // Show lifesteal indicator on attacker
  if (typeof spawnDamageIndicator === 'function') {
    spawnDamageIndicator(
      attacker.x + attacker.w / 2,
      attacker.y - 50,
      Math.floor(lifestealAmount),
      false
    );
  }
  
  console.log(`Demonic Awakening lifesteal: +${Math.floor(lifestealAmount)} HP`);
}

// Block isHit flag if Ocean Mending is active
if (target.isOceanMendingActive) {
  target.isHit = false; 
} else {
  target.isHit = !target.isBlocking;
}

if (typeof spawnDamageIndicator === "function") {
  let displayVal = Math.floor(damageToApply);
  spawnDamageIndicator(target.x + target.w / 2, target.y, displayVal, target.isBlocking);
}

  // Block isHit flag if Ocean Mending is active
  if (target.isOceanMendingActive) {
    target.isHit = false; 
  } else {
    target.isHit = !target.isBlocking;
  }

  if (typeof spawnDamageIndicator === "function") {
    let displayVal = Math.floor(damageToApply);
    spawnDamageIndicator(target.x + target.w / 2, target.y, displayVal, target.isBlocking);
  }
  
  let finalPush = target.isBlocking ? knockback * 0.3 : knockback;
  let pushDir = (target.x > attacker.x) ? finalPush : -finalPush;
  target.x += pushDir;
}

function handleBodyCollision(p1, p2) {
  // ✅ Use hurtbox dimensions for body collision
  let p1HurtboxY = p1.y + p1.hurtboxOffsetY;
  let p2HurtboxY = p2.y + p2.hurtboxOffsetY;
  
  let isOverlappingY = 
    p1HurtboxY < p2HurtboxY + p2.hurtboxHeight && 
    p1HurtboxY + p1.hurtboxHeight > p2HurtboxY;

  if (isOverlappingY) {
    let p1HurtboxX = p1.x + p1.hurtboxOffsetX;
    let p2HurtboxX = p2.x + p2.hurtboxOffsetX;
    
    let p1Center = p1HurtboxX + p1.hurtboxWidth / 2;
    let p2Center = p2HurtboxX + p2.hurtboxWidth / 2;
    let dx = p1Center - p2Center;
    let minDistance = (p1.hurtboxWidth / 2) + (p2.hurtboxWidth / 2);

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

function spawnDamageIndicatorSingle(x, y, amount, isBlocked) {
  singleDamageIndicators.push({
    x: x,
    y: y,
    amount: amount,
    label: isBlocked ? "BLOCK " : "",
    life: 255,
    velY: -2
  });
}
