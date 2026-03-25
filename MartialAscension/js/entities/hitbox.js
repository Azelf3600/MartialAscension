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
  
  if (character.isPerformingCombo && character.comboHits.length > 0) {
    actualAttack = character.comboHits[character.currentComboHit].attack;
  }
  
  if (character.attacking === "Launcher" && actualAttack === "HP") {
    return getLauncherHitbox(character);
  } else if (character.attacking === "Diving Kick" && actualAttack === "HK") {
    return getDivingKickHitbox(character);
  } else if (character.attacking === "Sword Qi Lunge" && actualAttack === "HP") {
    return getSwordQiLungeHitbox(character);
  } else if (character.attacking === "Sword God Slash" && actualAttack === "HK") {
    return getSwordGodSlashHitbox(character);
  } else {
    return getStandardHitbox(character, actualAttack);
  }
}
 
function getSwordGodSlashHitbox(character) {
  let shapes = [];
  let col = color(0, 0); // ✅ Transparent
  
  if (character.godSlashTimer > 30 || character.godSlashPhase !== "slash") {
    return { shapes: [], col: col };
  }
  
  let slashProgress = map(character.godSlashTimer, 30, 0, 0, 1);
  
  let hurtboxX = character.x + character.hurtboxOffsetX;
  let hurtboxY = character.y + character.hurtboxOffsetY;
  let anchorX = hurtboxX + character.hurtboxWidth / 2;
  let anchorY = hurtboxY + character.hurtboxHeight / 2;
  
  let slashLength = 200;
  let slashThickness = 40;
  let currentAngle;
  
  if (character.facing === 1) {
    currentAngle = map(slashProgress, 0, 1, -20, 60);
  } else {
    currentAngle = map(slashProgress, 0, 1, 210, 120);
  }
  
  let angleRad = radians(currentAngle);
  let numSegments = 5;
  
  for (let i = 0; i < numSegments; i++) {
    let distance = (i / numSegments) * slashLength;
    let segX = anchorX + cos(angleRad) * distance;
    let segY = anchorY + sin(angleRad) * distance;
    shapes.push({ 
      x: segX - slashThickness/2, 
      y: segY - slashThickness/2, 
      w: slashThickness, 
      h: slashThickness 
    });
  }
 
  return { shapes: shapes, col: col };
}
 
function getSwordQiLungeHitbox(character) {
  let shapes = [];
  let col = color(0, 0); // ✅ Transparent
  let innerOverlap = 10;
  let atkW = 200;
  let atkH = 40;
  let offY = 30; 
  
  let hurtboxY = character.y + character.hurtboxOffsetY;
  
  let atkX = (character.facing === 1) ? 
    (character.x + character.w - innerOverlap) : 
    (character.x - atkW + innerOverlap);
  
  let atkY = hurtboxY + offY;
    
  shapes.push({ x: atkX, y: atkY, w: atkW, h: atkH });
 
  return { shapes: shapes, col: col };
}
 
function getSeaDragonHitbox(character) {
  let shapes = [];
  let col = color(0, 0); // ✅ Transparent
  
  if (!character.isSeaDragonCharging) {
    return { shapes: [], col: col };
  }
  
  let hurtboxY = character.y + character.hurtboxOffsetY;
  let hurtboxH = character.hurtboxHeight;
  
  let wallW = 10; 
  let wallH = hurtboxH;
  
  let wallX = (character.facing === 1) ? 
    (character.x + character.w) :
    (character.x - wallW); 
  
  let wallY = hurtboxY;
  
  shapes.push({ x: wallX, y: wallY, w: wallW, h: wallH });
  
  return { shapes: shapes, col: col };
}
 
function getAzureDragonHitbox(character) {
  let shapes = [];
  let col = color(0, 0); // ✅ Transparent
  
  if (character.azureDragonPhase !== "emerge") {
    return { shapes: [], col: col };
  }
  
  let hurtboxY = character.y + character.hurtboxOffsetY;
  let hurtboxW = character.hurtboxWidth;
  let hurtboxH = character.hurtboxHeight;
  
  let pillW = hurtboxW * 1.2; 
  let pillH = hurtboxH * 1.5; 
  
  let pillX = character.x - (pillW - hurtboxW) / 2; 
  let pillY = hurtboxY - (pillH - hurtboxH);
  
  shapes.push({ x: pillX, y: pillY, w: pillW, h: pillH });
  
  return { shapes: shapes, col: col };
}
 
function getLauncherHitbox(character) {
  let shapes = [];
  let col = color(0, 0); // ✅ Transparent
  let innerOverlap = 10;
  
  let hurtboxY = character.y + character.hurtboxOffsetY;
  let hurtboxH = character.hurtboxHeight;
  
  let baseW = 150;
  let baseH = 20;
  let baseY = hurtboxY + hurtboxH * 0.3;
  let baseX = (character.facing === 1) ? 
    (character.x + character.w - innerOverlap) : 
    (character.x - baseW + innerOverlap);
  shapes.push({ x: baseX, y: baseY, w: baseW, h: baseH });
 
  let pillW = 20;
  let pillH = 100;
  let pillX = (character.facing === 1) ? (baseX + baseW - pillW) : baseX;
  shapes.push({ x: pillX, y: baseY - (pillH - baseH), w: pillW, h: pillH });
  
  return { shapes: shapes, col: col };
}
 
function getDivingKickHitbox(character) {
  let shapes = [];
  let col = color(0, 0); // ✅ Transparent
  
  let hurtboxY = character.y + character.hurtboxOffsetY;
  let hurtboxH = character.hurtboxHeight;
  
  let boxW = 60;
  let boxH = 70;
  let dirX = character.facing === 1 ? 1 : -1;
  let startOffsetY = hurtboxH * 0.4;
  
  let box1X = character.facing === 1 ? 
    character.x + character.w : 
    character.x - boxW;
  let box1Y = hurtboxY + startOffsetY;
  shapes.push({ x: box1X, y: box1Y, w: boxW, h: boxH });
  
  let box2X = box1X + (dirX * boxW * 0.5);
  let box2Y = box1Y + boxH * 0.5;
  shapes.push({ x: box2X, y: box2Y, w: boxW, h: boxH });
  
  let box3X = box2X + (dirX * boxW * 0.5);
  let box3Y = box2Y + boxH * 0.5;
  shapes.push({ x: box3X, y: box3Y, w: boxW, h: boxH });
  
  let box4X = box3X + (dirX * boxW * 0.5);
  let box4Y = box3Y + boxH * 0.5;
  shapes.push({ x: box4X, y: box4Y, w: boxW, h: boxH });
  
  return { shapes: shapes, col: col };
}
 
function getStandardHitbox(character, actualAttack) {
  let shapes = [];
  let col = color(0, 0); // ✅ Transparent for all attack types
  let innerOverlap = 10;
  let atkW = 0, atkH = 0, offY = 0;
 
  switch(actualAttack) {
    case "LP":
      atkW = 200; atkH = 20; offY = 30;
      break;
    case "HP":
      atkW = 200; atkH = 20; offY = 30;
      break;
    case "LK":
      atkW = 200; atkH = 40; offY = 100;
      break;
    case "HK":
      atkW = 200; atkH = 40; offY = 100;
      break;
    case "DW":
      atkW = 50; atkH = 15; offY = 80;
      break;
    case "FW":
      atkW = 80; atkH = 20; offY = 60;
      break;
    case "UP":
      atkW = 60; atkH = 30; offY = 20;
      break;
    default:
      atkW = 150; atkH = 20; offY = 30;
  }
 
  let hurtboxY = character.y + character.hurtboxOffsetY;
  
  let atkX = (character.facing === 1) ? 
    (character.x + character.w - innerOverlap) : 
    (character.x - atkW + innerOverlap);
  
  let atkY = hurtboxY + offY;
  
  shapes.push({ x: atkX, y: atkY, w: atkW, h: atkH });
 
  return { shapes: shapes, col: col };
}