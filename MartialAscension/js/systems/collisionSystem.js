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
    
    // Loop through all shapes in the hitbox (supports L-shape, diagonal, etc.)
    for (let box of data.shapes) {
      if (box.x < defender.x + defender.w &&
          box.x + box.w > defender.x &&
          box.y < defender.y + defender.h &&
          box.y + box.h > defender.y) {
        
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
          // NEW: Sword Qi Lunge knockback
          knockback = 40; // Heavy knockback
          stunTime = 35;  // Long stun
        } else if (isSwordGodSlash) {
          // NEW: Sword God Slash knockback
          knockback = 60; // Massive knockback
          stunTime = 50;  // Very long stun
        } else if (attacker.attacking === "Unstoppable Sea Dragon") {
          knockback = 0; // Enemy is dragged, not knocked back
          stunTime = 999; // Locked during drag (released in applyPhysics)
        } else if (attacker.attacking === "Azure Flowing Dragon") {
          knockback = 50;
          stunTime = 40;
        }

        let finalCalculatedDmg;
          if (isSwordQiLunge) {
          finalCalculatedDmg = 35;
        } else {
          let poisonBonus = 1.0;
  
        // Poison Hands bonus (+50%)
        if (attacker.isPoisonHandsActive && !attacker.isPerformingCombo) {
          poisonBonus = 1.5;
        }
        // NEW: Poison Flower Field bonus (+30%) - stacks check (field takes priority if both somehow active)
        else if (attacker.isPoisonFieldActive && !attacker.isPerformingCombo) {
          poisonBonus = 1.3;
        }

        // NEW: Apply archetype modifier first, THEN apply Tortoise Body override
        let effectiveDmgMod = attacker.dmgMod;
  
        // Undying Tortoise Body: Override dmgMod to 1.2 for Defensive archetype
        let wasTortoiseActive = false;
        if (attacker.attacking === "Unstoppable Sea Dragon") {
        if (attacker.archetype === "Defensive") {
          wasTortoiseActive = true;
          effectiveDmgMod = 1.0; // Boost from 0.8 to 1.2 (60 damage)
        } else {
          effectiveDmgMod = 0.6; // Keep base (40 damage with Azure Scales consumption)
        }
      }  
          // Normal Tortoise Body check
          else if (attacker.isTortoiseBodyActive && attacker.archetype === "Defensive") {
            effectiveDmgMod = 1.0; // Boost from 0.8 to 1.2
          }

          // ✅ NEW: Demonic Heaven's Awakening - 1.4x damage (40% boost)
          if (attacker.isDemonicAwakeningActive && attacker.archetype === "Offensive") {
            effectiveDmgMod = 1.4; // Boost from 1.2 to 1.4 (40% increase)
          }
  
          finalCalculatedDmg = baseDmg * effectiveDmgMod * attacker.comboDamageMod * poisonBonus;
        }
        
        let ignoreBlock = isSwordQiLunge || isSwordGodSlash || isUnstoppableSeaDragon || isAzureFlowingDragon;
        applyDamage(defender, finalCalculatedDmg, attacker, stunTime, knockback, ignoreBlock);
        
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
        // NEW: Skip launcher if Ocean Mending is active
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

  // ✅ NEW: Azure Flowing Dragon - launcher juggle effect
if (attacker.attacking === "Azure Flowing Dragon") {
  // Skip if Ocean Mending is active
  if (defender.isOceanMendingActive) {
    console.log("Azure Dragon launch blocked by Ocean Mending Water!");
  } else {
    // First hit - big launch
    if (defender.isGrounded) {
      defender.consecutiveAirHits = 1;
      defender.velY = -defender.jumpPower * 2.0; // Even bigger than normal launcher
      defender.isGrounded = false;
      defender.hitStun = 45; // Longer stun
      console.log("Azure Flowing Dragon launched enemy!");
    } 
    // Already airborne - juggle
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

    // NEW: Block hitstun if Ocean Mending is active
  if (target.isOceanMendingActive) {
    target.hitStun = 0; // Ignore stun completely
  } else {
    target.hitStun = target.isBlocking ? target.blockStun : stunTime;
  }

    // NEW: Undying Tortoise Body - 20% damage reduction (applied BEFORE block)
  if (target.isTortoiseBodyActive) {
    damageToApply = damageToApply * 0.8; // Reduce by 20%
  }

  // Apply block reduction unless ignored
  if (target.isBlocking && !ignoreBlock) {
    damageToApply = damageToApply * (1 - target.blockMod);
  }

  // NEW: Azure Dragon Scales - Reflect 50% damage back to attacker
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
  let trackedDamage = damageToApply * 0.5; // ✅ Only track 50% of damage dealt
  target.annihilationCumulativeDamage += trackedDamage;
  console.log(`Annihilation tracking: ${Math.floor(trackedDamage)} damage (Total: ${Math.floor(target.annihilationCumulativeDamage)})`);
}

  target.hp -= damageToApply;
  if (target.hp < 0) target.hp = 0;
  target.isHit = !target.isBlocking;

  // ✅ NEW: Demonic Heaven's Awakening - 40% lifesteal
if (attacker.isDemonicAwakeningActive) {
  let lifestealAmount = damageToApply * 0.4; // 40% of damage dealt
  
  // Heal attacker (cap at maxHp)
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

// NEW: Block isHit flag if Ocean Mending is active
if (target.isOceanMendingActive) {
  target.isHit = false; // No hit reaction
} else {
  target.isHit = !target.isBlocking;
}

if (typeof spawnDamageIndicator === "function") {
  let displayVal = Math.floor(damageToApply);
  spawnDamageIndicator(target.x + target.w / 2, target.y, displayVal, target.isBlocking);
}

  // NEW: Block isHit flag if Ocean Mending is active
  if (target.isOceanMendingActive) {
    target.isHit = false; // No hit reaction
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