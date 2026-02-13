// ========================================
// HITBOX SYSTEM
// Centralized hitbox generation for all attacks
// ========================================

/**
 * Main hitbox dispatcher
 * @param {Character} character - The attacking character
 * @returns {Object} - { shapes: [], col: color() }
 */
function getHitboxData(character) {
  if (!character.attacking) return { shapes: [], col: color(0, 0) };
  
  let actualAttack = character.attacking;
  
  // If performing combo, use current hit's attack type
  if (character.isPerformingCombo && character.comboHits.length > 0) {
    actualAttack = character.comboHits[character.currentComboHit].attack;
  }
  
  // Route to specialized hitbox functions
  if (character.attacking === "Launcher" && actualAttack === "HP") {
    return getLauncherHitbox(character);
  } else if (character.attacking === "Diving Kick" && actualAttack === "HK") {
    return getDivingKickHitbox(character);
  } else {
    return getStandardHitbox(character, actualAttack);
  }
}

// ========================================
// LAUNCHER COMBO HITBOX (L-SHAPE)
// ========================================
function getLauncherHitbox(character) {
  let shapes = [];
  let col = color(255, 165, 0, 150);
  let innerOverlap = 10;
  
  // Horizontal Base (The sweep)
  let baseW = 150;
  let baseH = 20;
  let baseY = character.y + character.h * 0.3;
  let baseX = (character.facing === 1) ? 
    (character.x + character.w - innerOverlap) : 
    (character.x - baseW + innerOverlap);
  shapes.push({ x: baseX, y: baseY, w: baseW, h: baseH });

  // Vertical Pillar (The "Up" part)
  let pillW = 20;
  let pillH = 100;
  let pillX = (character.facing === 1) ? (baseX + baseW - pillW) : baseX;
  shapes.push({ x: pillX, y: baseY - (pillH - baseH), w: pillW, h: pillH });
  
  return { shapes: shapes, col: col };
}

// ========================================
// DIVING KICK HITBOX (DIAGONAL STAIRCASE)
// ========================================
function getDivingKickHitbox(character) {
  let shapes = [];
  let col = color(255, 100, 0, 180);
  
  // Hitbox configuration
  let boxW = 60;
  let boxH = 70;
  let dirX = character.facing === 1 ? 1 : -1;
  let startOffsetY = character.h * 0.4; // Start at hip level
  
  // Box 1: Top (chest/hip area)
  let box1X = character.facing === 1 ? 
    character.x + character.w : 
    character.x - boxW;
  let box1Y = character.y + startOffsetY;
  shapes.push({ x: box1X, y: box1Y, w: boxW, h: boxH });
  
  // Box 2: Step down and forward
  let box2X = box1X + (dirX * boxW * 0.5);
  let box2Y = box1Y + boxH * 0.5;
  shapes.push({ x: box2X, y: box2Y, w: boxW, h: boxH });
  
  // Box 3: Step down and forward
  let box3X = box2X + (dirX * boxW * 0.5);
  let box3Y = box2Y + boxH * 0.5;
  shapes.push({ x: box3X, y: box3Y, w: boxW, h: boxH });
  
  // Box 4: Bottom (leg extension)
  let box4X = box3X + (dirX * boxW * 0.5);
  let box4Y = box3Y + boxH * 0.5;
  shapes.push({ x: box4X, y: box4Y, w: boxW, h: boxH });
  
  return { shapes: shapes, col: col };
}

// ========================================
// STANDARD HITBOXES (LP, HP, LK, HK, etc.)
// ========================================
function getStandardHitbox(character, actualAttack) {
  let shapes = [];
  let col = color(255, 150);
  let innerOverlap = 10;
  let atkW = 0, atkH = 0, offY = 0;

  // Define hitbox dimensions based on attack type
  switch(actualAttack) {
    case "LP":
      atkW = 150; atkH = 20; offY = 50;
      col = color(255, 255, 0, 150);
      break;
    case "HP":
      atkW = 150; atkH = 20; offY = 30;
      col = color(255, 165, 0, 150);
      break;
    case "LK":
      atkW = 200; atkH = 40; offY = 100;
      col = color(0, 255, 0, 150);
      break;
    case "HK":
      atkW = 200; atkH = 40; offY = 100;
      col = color(255, 0, 0, 150);
      break;
    case "DW":
      atkW = 50; atkH = 15; offY = 80;
      col = color(150, 150, 255, 150);
      break;
    case "FW":
      atkW = 80; atkH = 20; offY = 60;
      col = color(100, 200, 255, 150);
      break;
    case "UP":
      atkW = 60; atkH = 30; offY = 20;
      col = color(200, 100, 255, 150);
      break;
    default:
      atkW = 150; atkH = 20; offY = 30;
      col = color(255, 0, 255, 150);
  }

  let atkX = (character.facing === 1) ? 
    (character.x + character.w - innerOverlap) : 
    (character.x - atkW + innerOverlap);
  shapes.push({ x: atkX, y: character.y + offY, w: atkW, h: atkH });

  return { shapes: shapes, col: col };
}