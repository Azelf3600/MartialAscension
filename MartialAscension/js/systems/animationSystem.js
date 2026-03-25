class AnimationSystem {
  constructor() {
    this.loadedAnimations = {};
  }

  // Convert character name to folder-safe format
  getFolderName(characterName) {
    // Remove spaces for folder names
    return characterName.replace(/\s+/g, ''); // "Ethan Li" → "EthanLi"
  }

  // Load character animations
  loadCharacterAnimations(characterName) {
    // Use folder-safe name for storage
    let folderName = this.getFolderName(characterName);
    
    if (!this.loadedAnimations[characterName]) {
      this.loadedAnimations[characterName] = {};
    }
    // Ethan Li Animations 
    if (folderName === "EthanLi") {
      this.loadedAnimations[characterName].idle = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/Idle/frame${frameNum}.png`;
        this.loadedAnimations[characterName].idle.push(loadImage(path));
      }
      this.loadedAnimations[characterName].walk = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/Walk/frame${frameNum}.png`;
        this.loadedAnimations[characterName].walk.push(loadImage(path));
      }
      this.loadedAnimations[characterName].jump = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/Jump/frame${frameNum}.png`;
        this.loadedAnimations[characterName].jump.push(loadImage(path));
      }
      this.loadedAnimations[characterName].fall = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/Fall/frame${frameNum}.png`;
        this.loadedAnimations[characterName].fall.push(loadImage(path));
      }
      this.loadedAnimations[characterName].crouch = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/Crouch/frame${frameNum}.png`;
        this.loadedAnimations[characterName].crouch.push(loadImage(path));
      }
      this.loadedAnimations[characterName].crouchwalk = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/CrouchWalk/frame${frameNum}.png`;
        this.loadedAnimations[characterName].crouchwalk.push(loadImage(path));
      }
      this.loadedAnimations[characterName].dash = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/Dash/frame${frameNum}.png`;
        this.loadedAnimations[characterName].dash.push(loadImage(path));
      }
      this.loadedAnimations[characterName].crouchdash = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/CrouchDash/frame${frameNum}.png`;
        this.loadedAnimations[characterName].crouchdash.push(loadImage(path));
      }
      this.loadedAnimations[characterName].backdash = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/BackDash/frame${frameNum}.png`;
        this.loadedAnimations[characterName].backdash.push(loadImage(path));
      }
      this.loadedAnimations[characterName].crouchbackdash = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/CrouchBackDash/frame${frameNum}.png`;
        this.loadedAnimations[characterName].crouchbackdash.push(loadImage(path));
      }
      this.loadedAnimations[characterName].lightpunch = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/LightPunch/frame${frameNum}.png`;
        this.loadedAnimations[characterName].lightpunch.push(loadImage(path));
      }
      this.loadedAnimations[characterName].heavypunch = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/HeavyPunch/frame${frameNum}.png`;
        this.loadedAnimations[characterName].heavypunch.push(loadImage(path));
      }
      this.loadedAnimations[characterName].lightkick = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/LightKick/frame${frameNum}.png`;
        this.loadedAnimations[characterName].lightkick.push(loadImage(path));
      }
      this.loadedAnimations[characterName].heavykick = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/HeavyKick/frame${frameNum}.png`;
        this.loadedAnimations[characterName].heavykick.push(loadImage(path));
      }
      this.loadedAnimations[characterName].crouchlightpunch = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/CrouchLightPunch/frame${frameNum}.png`;
        this.loadedAnimations[characterName].crouchlightpunch.push(loadImage(path));
      }
      this.loadedAnimations[characterName].crouchheavypunch = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/CrouchHeavyPunch/frame${frameNum}.png`;
        this.loadedAnimations[characterName].crouchheavypunch.push(loadImage(path));
      }
      this.loadedAnimations[characterName].crouchlightkick = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/CrouchLightKick/frame${frameNum}.png`;
        this.loadedAnimations[characterName].crouchlightkick.push(loadImage(path));
      }
      this.loadedAnimations[characterName].crouchheavykick = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/CrouchHeavyKick/frame${frameNum}.png`;
        this.loadedAnimations[characterName].crouchheavykick.push(loadImage(path));
      }
      this.loadedAnimations[characterName].launcher = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/Launcher/frame${frameNum}.png`;
        this.loadedAnimations[characterName].launcher.push(loadImage(path));
      }
      this.loadedAnimations[characterName].divingkick = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/DivingKick/frame${frameNum}.png`;
        this.loadedAnimations[characterName].divingkick.push(loadImage(path));
      }
      this.loadedAnimations[characterName].flight = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/Flight/frame${frameNum}.png`;
        this.loadedAnimations[characterName].flight.push(loadImage(path));
      }
      this.loadedAnimations[characterName].swordgodslash = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/SwordGodSlash/frame${frameNum}.png`;
        this.loadedAnimations[characterName].swordgodslash.push(loadImage(path));
      }
      this.loadedAnimations[characterName].hiteffect = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/HitEffect/frame${frameNum}.png`;
        this.loadedAnimations[characterName].hiteffect.push(loadImage(path));
      }
    }
    // Lucas Tang Animations
    if (folderName === "LucasTang") {
      this.loadedAnimations[characterName].idle = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/Idle/frame${frameNum}.png`;
        this.loadedAnimations[characterName].idle.push(loadImage(path));
      }
      this.loadedAnimations[characterName].walk = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/Walk/frame${frameNum}.png`;
        this.loadedAnimations[characterName].walk.push(loadImage(path));
      }
      this.loadedAnimations[characterName].crouch = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/Crouch/frame${frameNum}.png`;
        this.loadedAnimations[characterName].crouch.push(loadImage(path));
      }
      this.loadedAnimations[characterName].crouchwalk = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/CrouchWalk/frame${frameNum}.png`;
        this.loadedAnimations[characterName].crouchwalk.push(loadImage(path));
      }
      this.loadedAnimations[characterName].jump = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/Jump/frame${frameNum}.png`;
        this.loadedAnimations[characterName].jump.push(loadImage(path));
      }
      this.loadedAnimations[characterName].fall = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/Fall/frame${frameNum}.png`;
        this.loadedAnimations[characterName].fall.push(loadImage(path));
      }
      this.loadedAnimations[characterName].dash = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/Dash/frame${frameNum}.png`;
        this.loadedAnimations[characterName].dash.push(loadImage(path));
      }
      this.loadedAnimations[characterName].crouchdash = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/CrouchDash/frame${frameNum}.png`;
        this.loadedAnimations[characterName].crouchdash.push(loadImage(path));
      }
      this.loadedAnimations[characterName].backdash = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/BackDash/frame${frameNum}.png`;
        this.loadedAnimations[characterName].backdash.push(loadImage(path));
      }
      this.loadedAnimations[characterName].crouchbackdash = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/CrouchBackDash/frame${frameNum}.png`;
        this.loadedAnimations[characterName].crouchbackdash.push(loadImage(path));
      }
      this.loadedAnimations[characterName].heavypunch = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/HeavyPunch/frame${frameNum}.png`;
        this.loadedAnimations[characterName].heavypunch.push(loadImage(path));
      }
      this.loadedAnimations[characterName].lightpunch = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/LightPunch/frame${frameNum}.png`;
        this.loadedAnimations[characterName].lightpunch.push(loadImage(path));
      }
      this.loadedAnimations[characterName].lightkick = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/LightKick/frame${frameNum}.png`;
        this.loadedAnimations[characterName].lightkick.push(loadImage(path));
      }
      this.loadedAnimations[characterName].heavykick = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/HeavyKick/frame${frameNum}.png`;
        this.loadedAnimations[characterName].heavykick.push(loadImage(path));
      }
      this.loadedAnimations[characterName].crouchlightpunch = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/CrouchLightPunch/frame${frameNum}.png`;
        this.loadedAnimations[characterName].crouchlightpunch.push(loadImage(path));
      }
      this.loadedAnimations[characterName].crouchheavypunch = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/CrouchHeavyPunch/frame${frameNum}.png`;
        this.loadedAnimations[characterName].crouchheavypunch.push(loadImage(path));
      }
      this.loadedAnimations[characterName].crouchlightkick = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/CrouchLightKick/frame${frameNum}.png`;
        this.loadedAnimations[characterName].crouchlightkick.push(loadImage(path));
      }
      this.loadedAnimations[characterName].crouchheavykick = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/CrouchHeavyKick/frame${frameNum}.png`;
        this.loadedAnimations[characterName].crouchheavykick.push(loadImage(path));
      }
      this.loadedAnimations[characterName].launcher = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/Launcher/frame${frameNum}.png`;
        this.loadedAnimations[characterName].launcher.push(loadImage(path));
      }
      this.loadedAnimations[characterName].divingkick = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/DivingKick/frame${frameNum}.png`;
        this.loadedAnimations[characterName].divingkick.push(loadImage(path));
      }
      this.loadedAnimations[characterName].hiteffect = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/HitEffect/frame${frameNum}.png`;
        this.loadedAnimations[characterName].hiteffect.push(loadImage(path));
      }
    }
    if (folderName === "AaronShu") { 
      this.loadedAnimations[characterName].idle = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/Idle/frame${frameNum}.png`;
        this.loadedAnimations[characterName].idle.push(loadImage(path));
      }
      this.loadedAnimations[characterName].crouch = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/Crouch/frame${frameNum}.png`;
        this.loadedAnimations[characterName].crouch.push(loadImage(path));
      }
      this.loadedAnimations[characterName].walk = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/Walk/frame${frameNum}.png`;
        this.loadedAnimations[characterName].walk.push(loadImage(path));
      }
      this.loadedAnimations[characterName].crouchwalk = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/CrouchWalk/frame${frameNum}.png`;
        this.loadedAnimations[characterName].crouchwalk.push(loadImage(path));
      }
      this.loadedAnimations[characterName].jump = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/Jump/frame${frameNum}.png`;
        this.loadedAnimations[characterName].jump.push(loadImage(path));
      }
      this.loadedAnimations[characterName].fall = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/Fall/frame${frameNum}.png`;
        this.loadedAnimations[characterName].fall.push(loadImage(path));
      }
      this.loadedAnimations[characterName].dash = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/Dash/frame${frameNum}.png`;
        this.loadedAnimations[characterName].dash.push(loadImage(path));
      }
      this.loadedAnimations[characterName].crouchdash = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/Dash/frame${frameNum}.png`;
        this.loadedAnimations[characterName].crouchdash.push(loadImage(path));
      }
      this.loadedAnimations[characterName].backdash = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/BackDash/frame${frameNum}.png`;
        this.loadedAnimations[characterName].backdash.push(loadImage(path));
      }
      this.loadedAnimations[characterName].crouchbackdash = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/BackDash/frame${frameNum}.png`;
        this.loadedAnimations[characterName].crouchbackdash.push(loadImage(path));
      }
      this.loadedAnimations[characterName].lightpunch = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/LightPunch/frame${frameNum}.png`;
        this.loadedAnimations[characterName].lightpunch.push(loadImage(path));
      }
      this.loadedAnimations[characterName].crouchlightpunch = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/LightPunch/frame${frameNum}.png`;
        this.loadedAnimations[characterName].crouchlightpunch.push(loadImage(path));
      }
      this.loadedAnimations[characterName].heavypunch = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/HeavyPunch/frame${frameNum}.png`;
        this.loadedAnimations[characterName].heavypunch.push(loadImage(path));
      }
      this.loadedAnimations[characterName].crouchheavypunch = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/HeavyPunch/frame${frameNum}.png`;
        this.loadedAnimations[characterName].crouchheavypunch.push(loadImage(path));
      }
      this.loadedAnimations[characterName].lightkick = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/LightKick/frame${frameNum}.png`;
        this.loadedAnimations[characterName].lightkick.push(loadImage(path));
      }
      this.loadedAnimations[characterName].crouchlightkick = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/LightKick/frame${frameNum}.png`;
        this.loadedAnimations[characterName].crouchlightkick.push(loadImage(path));
      }
      this.loadedAnimations[characterName].heavykick = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/HeavyKick/frame${frameNum}.png`;
        this.loadedAnimations[characterName].heavykick.push(loadImage(path));
      }
      this.loadedAnimations[characterName].crouchheavykick = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/HeavyKick/frame${frameNum}.png`;
        this.loadedAnimations[characterName].crouchheavykick.push(loadImage(path));
      }
      this.loadedAnimations[characterName].launcher = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/Launcher/frame${frameNum}.png`;
        this.loadedAnimations[characterName].launcher.push(loadImage(path));
      }
      this.loadedAnimations[characterName].divingkick = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/DivingKick/frame${frameNum}.png`;
        this.loadedAnimations[characterName].divingkick.push(loadImage(path));
      }
      this.loadedAnimations[characterName].hiteffect = [];
      for (let i = 0; i <= 12; i++) {
        let frameNum = i.toString().padStart(4, '0');
        let path = `Assets/sprites/characters/${folderName}/HitEffect/frame${frameNum}.png`;
        this.loadedAnimations[characterName].hiteffect.push(loadImage(path));
      }
    }
    if (folderName === "DamonCheon") { }
  }

  // Get animation for a character
  getAnimation(characterName, animationName) {
    return this.loadedAnimations[characterName]?.[animationName] || [];
  }

// Determine which animation should play based on character state
getAnimationState(character) {
  // ── Hit stun always wins ─────────────────────────────────
  if (character.isHit && character.hitStun > 0) return "hiteffect";
 
  // ── Resolve actual attack type for combo hits ─────────────
  let actualAttack = character.attacking;
  if (character.isPerformingCombo && character.comboHits.length > 0) {
    actualAttack = character.comboHits[character.currentComboHit].attack;
  }
 
  // ── Special named attacks (highest priority after hitstun) ─
  if (character.attacking === "Launcher")              return "launcher";
  if (character.attacking === "Diving Kick")           return "divingkick";
  if (character.attacking === "Sword Qi Strike")       return character.isCrouching ? "crouchlightpunch" : "lightpunch";
  if (character.attacking === "Poison Qi Palm")        return character.isCrouching ? "crouchlightpunch" : "lightpunch";
  if (character.attacking === "Flame Poison Needle")   return character.isCrouching ? "crouchlightpunch" : "lightpunch";
  if (character.attacking === "Sword Qi Lunge")        return "heavykick";
  if (character.attacking === "Sword God Slash")       return "swordgodslash";
  if (character.attacking === "Sword God Judgment")    return "heavykick";
  if (character.attacking === "Unstoppable Sea Dragon") return "heavypunch";
  if (character.attacking === "Azure Flowing Dragon")  return "launcher";
 
  // ── Standard attack inputs (crouch variants first) ────────
  if (actualAttack === "LP" && character.isCrouching)  return "crouchlightpunch";
  if (actualAttack === "HP" && character.isCrouching)  return "crouchheavypunch";
  if (actualAttack === "LK" && character.isCrouching)  return "crouchlightkick";
  if (actualAttack === "HK" && character.isCrouching)  return "crouchheavykick";
  if (actualAttack === "LP")                           return "lightpunch";
  if (actualAttack === "HP")                           return "heavypunch";
  if (actualAttack === "LK")                           return "lightkick";
  if (actualAttack === "HK")                           return "heavykick";
 
  if (character.attackTimer > 0 || character.recoveryTimer > 0) {
  }
 
  // ── Air dash (overrides all ground movement) ──────────────
  if (character.isAirDashing) return "dash";
 
  // ── Ground movement — ordered most-specific to least ──────
  if (character.isCrouchBackDashing) return "crouchbackdash";
  if (character.isBackDashing)       return "backdash";
  if (character.isCrouchDashing)     return "crouchdash";
  if (character.isDashing)           return "dash";
 
  if (character.isCrouching && character.isWalking) return "crouchwalk";
  if (character.isCrouching)                        return "crouch";
 
  if (character.isFlying) return "flight";
 
  if (!character.isGrounded) {
    return character.velY < 0 ? "jump" : "fall";
  }
 
  if (character.isWalking) return "walk";
  return "idle";
}

  // Update character animation
  updateAnimation(character) {
    // Determine what animation should play
    let targetAnimation = this.getAnimationState(character);
    
    // Check if animation changed
    if (character.currentAnimation !== targetAnimation) {
      character.currentAnimation = targetAnimation;
      character.currentFrame = 0;
      character.frameTimer = 0;
    }

    // Advance frame timer
    character.frameTimer++;
    if (character.frameTimer >= character.frameDelay) {
      character.frameTimer = 0;
      
      // Get the actual animation frames
      let frames = this.getAnimation(character.name, character.currentAnimation);
      
      if (frames.length > 0) {
        character.currentFrame = (character.currentFrame + 1) % frames.length;
      }
    }
  }

// Draw the current animation frame
drawAnimation(character) {
  let frames = this.getAnimation(character.name, character.currentAnimation);
  
  if (frames.length > 0 && frames[character.currentFrame]) {
    let sprite = frames[character.currentFrame];
    
    push();
    
    // ✅ Calculate sprite dimensions using character's spriteScale
    let spriteAspect = sprite.width / sprite.height;
    let targetHeight = character.h * character.spriteScale; // ✅ Uses spriteScale property
    let targetWidth = targetHeight * spriteAspect;
    
    // ✅ Calculate sprite position with offsets
    let spriteCenterX = character.x + character.w/2 + character.spriteOffsetX;
    let spriteCenterY = character.y + character.h/2 + character.spriteOffsetY;
    
    translate(spriteCenterX, spriteCenterY);
    
    // Handle flipping based on facing direction
    if (character.facing === -1) {
      scale(-1, 1); // Flip horizontally
    }
    
    imageMode(CENTER);
    image(
      sprite,
      0, 0,
      targetWidth, targetHeight
    );
    
    pop();
} else {
  // ✅ Fallback to colored rectangle if no sprite - use hurtbox dimensions
  push();
  fill(character.color);
  let hurtboxX = character.x + character.hurtboxOffsetX;
  let hurtboxY = character.y + character.hurtboxOffsetY;
  rect(hurtboxX, hurtboxY, character.hurtboxWidth, character.hurtboxHeight, 5);
  pop();
}
  }
}

// Global animation system instance
let animationSystem;