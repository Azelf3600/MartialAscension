function getHitboxData(character) {
  if (!character.attacking) return { shapes: [], col: color(0, 0) };
  
  if (character.attacking === "Sword Qi Fly") {
    return { shapes: [], col: color(0, 0) };
  }

  if (character.attacking === "Unstoppable Sea Dragon") {
    return getSeaDragonHitbox(character);
  }

  if (character.attacking === "Azure Flowing Dragon") {
    return getAzureDragonHitbox(character);
  }

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
  } else if (character.attacking === "Sword Qi Lunge" && actualAttack === "HP") {
    return getSwordQiLungeHitbox(character);
  } else if (character.attacking === "Sword God Slash" && actualAttack === "HK") {
    // Sword God Slash hitbox
    return getSwordGodSlashHitbox(character);
  } else {
    return getStandardHitbox(character, actualAttack);
  }
}

// SWORD GOD SLASH HITBOX - ✅ FIXED FOR CROUCH
function getSwordGodSlashHitbox(character) {
  let shapes = [];
  let col = color(255, 0, 0, 150);
  
  // Only show hitbox during slash phase (last 30 frames)
  if (character.godSlashTimer > 30 || character.godSlashPhase !== "slash") {
    return { shapes: [], col: col };
  }
  
  // Calculate slash progress (0 = start, 1 = end)
  let slashProgress = map(character.godSlashTimer, 30, 0, 0, 1);
  
  // ✅ FIX: Anchor from hurtbox center
  let hurtboxX = character.x + character.hurtboxOffsetX;
  let hurtboxY = character.y + character.hurtboxOffsetY;
  let anchorX = hurtboxX + character.hurtboxWidth / 2;
  let anchorY = hurtboxY + character.hurtboxHeight / 2;
  
  // Slash dimensions
  let slashLength = 200;
  let slashThickness = 40;
  let currentAngle;
  
  if (character.facing === 1) {
    currentAngle = map(slashProgress, 0, 1, -20, 60);
  } else {
    currentAngle = map(slashProgress, 0, 1, 210, 120);
  }
  
  let angleRad = radians(currentAngle);
  
  // Create hitbox segments along the slash path
  let numSegments = 5;
  
  for (let i = 0; i < numSegments; i++) {
    // Distance from anchor along slash
    let distance = (i / numSegments) * slashLength;
    
    // Calculate position using angle
    let segX = anchorX + cos(angleRad) * distance;
    let segY = anchorY + sin(angleRad) * distance;
    
    // Create square segment
    shapes.push({ 
      x: segX - slashThickness/2, 
      y: segY - slashThickness/2, 
      w: slashThickness, 
      h: slashThickness 
    });
  }

  return { shapes: shapes, col: col };
}

// SWORD QI LUNGE HITBOX - ✅ FIXED FOR CROUCH
function getSwordQiLungeHitbox(character) {
  let shapes = [];
  let col = color(255, 100, 100, 180); 
  let innerOverlap = 10;
  let atkW = 200;
  let atkH = 40;
  let offY = 30; 
  
  // ✅ FIX: Use hurtbox position
  let hurtboxY = character.y + character.hurtboxOffsetY;
  
  let atkX = (character.facing === 1) ? 
    (character.x + character.w - innerOverlap) : 
    (character.x - atkW + innerOverlap);
  
  let atkY = hurtboxY + offY; // ✅ From hurtbox
    
  shapes.push({ x: atkX, y: atkY, w: atkW, h: atkH });

  return { shapes: shapes, col: col };
}

// UNSTOPPABLE SEA DRAGON HITBOX - ✅ FIXED FOR CROUCH
function getSeaDragonHitbox(character) {
  let shapes = [];
  let col = color(0, 180, 255, 180);
  
  if (!character.isSeaDragonCharging) {
    return { shapes: [], col: col };
  }
  
  // ✅ FIX: Use hurtbox position
  let hurtboxY = character.y + character.hurtboxOffsetY;
  let hurtboxH = character.hurtboxHeight;
  
  // Vertical wall hitbox
  let wallW = 10; 
  let wallH = hurtboxH; // ✅ Match hurtbox height
  
  let wallX = (character.facing === 1) ? 
    (character.x + character.w) :
    (character.x - wallW); 
  
  let wallY = hurtboxY; // ✅ From hurtbox
  
  shapes.push({ x: wallX, y: wallY, w: wallW, h: wallH });
  
  return { shapes: shapes, col: col };
}

// AZURE FLOWING DRAGON HITBOX - ✅ FIXED FOR CROUCH
function getAzureDragonHitbox(character) {
  let shapes = [];
  let col = color(0, 220, 255, 180);
  
  if (character.azureDragonPhase !== "emerge") {
    return { shapes: [], col: col };
  }
  
  // ✅ FIX: Use hurtbox dimensions
  let hurtboxY = character.y + character.hurtboxOffsetY;
  let hurtboxW = character.hurtboxWidth;
  let hurtboxH = character.hurtboxHeight;
  
  // Rising pillar hitbox
  let pillW = hurtboxW * 1.2; 
  let pillH = hurtboxH * 1.5; 
  
  let pillX = character.x - (pillW - hurtboxW) / 2; 
  let pillY = hurtboxY - (pillH - hurtboxH); // ✅ From hurtbox
  
  shapes.push({ x: pillX, y: pillY, w: pillW, h: pillH });
  
  return { shapes: shapes, col: col };
}

// LAUNCHER COMBO HITBOX (L-SHAPE) - ✅ FIXED FOR CROUCH
function getLauncherHitbox(character) {
  let shapes = [];
  let col = color(255, 165, 0, 150);
  let innerOverlap = 10;
  
  // ✅ FIX: Use hurtbox position
  let hurtboxY = character.y + character.hurtboxOffsetY;
  let hurtboxH = character.hurtboxHeight;
  
  // Horizontal Base (The sweep)
  let baseW = 150;
  let baseH = 20;
  let baseY = hurtboxY + hurtboxH * 0.3; // ✅ Relative to hurtbox
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

// DIVING KICK HITBOX (DIAGONAL STAIRCASE) - ✅ FIXED FOR CROUCH
function getDivingKickHitbox(character) {
  let shapes = [];
  let col = color(255, 100, 0, 180);
  
  // ✅ FIX: Use hurtbox position
  let hurtboxY = character.y + character.hurtboxOffsetY;
  let hurtboxH = character.hurtboxHeight;
  
  // Hitbox configuration
  let boxW = 60;
  let boxH = 70;
  let dirX = character.facing === 1 ? 1 : -1;
  let startOffsetY = hurtboxH * 0.4; // ✅ Relative to hurtbox height
  
  // Box 1: Top (chest/hip area)
  let box1X = character.facing === 1 ? 
    character.x + character.w : 
    character.x - boxW;
  let box1Y = hurtboxY + startOffsetY; // ✅ From hurtbox
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

// STANDARD HITBOXES (LP, HP, LK, HK, etc.) - ✅ FIXED FOR CROUCH
function getStandardHitbox(character, actualAttack) {
  let shapes = [];
  let col = color(255, 150);
  let innerOverlap = 10;
  let atkW = 0, atkH = 0, offY = 0;

  // Define hitbox dimensions based on attack type
  switch(actualAttack) {
    case "LP":
      atkW = 200; atkH = 20; offY = 30;
      col = color(255, 255, 0, 150);
      break;
    case "HP":
      atkW = 200; atkH = 20; offY = 30;
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

  // ✅ FIX: Use hurtbox position instead of character.y
  let hurtboxY = character.y + character.hurtboxOffsetY;
  
  let atkX = (character.facing === 1) ? 
    (character.x + character.w - innerOverlap) : 
    (character.x - atkW + innerOverlap);
  
  // ✅ FIX: Calculate attack Y from hurtbox position
  let atkY = hurtboxY + offY;
  
  shapes.push({ x: atkX, y: atkY, w: atkW, h: atkH });

  return { shapes: shapes, col: col };
}