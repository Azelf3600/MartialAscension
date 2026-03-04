const STANDARD_COMBOS = [
  { 
    name: "Launcher", 
    sequence: ["DW", "FW", "HP"], 
    damageMult: 1.0, 
    type: "LAUNCH",
    hits: [
      { attack: "DW", duration: 8 },   
      { attack: "FW", duration: 8 },   
      { attack: "HP", duration: 22 }  
    ]
  },
  { 
    name: "Punch Chain", 
    sequence: ["LP", "LP", "HP"], 
    damageMult: 1.1, 
    type: "KNOCKDOWN",
    hits: [
      { attack: "LP", duration: 12 },
      { attack: "LP", duration: 12 },
      { attack: "HP", duration: 22 }
    ]
  },
  { 
    name: "Kick Chain", 
    sequence: ["LK", "LK", "HK"], 
    damageMult: 1.1, 
    type: "KNOCKDOWN",
    hits: [
      { attack: "LK", duration: 12 },
      { attack: "LK", duration: 12 },
      { attack: "HK", duration: 22 }
    ]
  },
  { 
    name: "PK Chain 1", 
    sequence: ["LP", "HP", "HK"], 
    damageMult: 1.2, 
    type: "HEAVY",
    hits: [
      { attack: "LP", duration: 12 },
      { attack: "HP", duration: 22 },
      { attack: "HK", duration: 22 }
    ]
  },
  { 
    name: "PK Chain 2", 
    sequence: ["LP", "LK", "HK"], 
    damageMult: 1.2, 
    type: "HEAVY",
    hits: [
      { attack: "LP", duration: 12 },
      { attack: "LK", duration: 12 },
      { attack: "HK", duration: 22 }
    ]
  },
  { 
    name: "Diving Kick", 
    sequence: ["UP", "FW", "HK"], 
    damageMult: 1.0, 
    type: "DIVE",
    hits: [
      { attack: "UP", duration: 8 },   
      { attack: "FW", duration: 10 },  
      { attack: "HK", duration: 25 }   
    ]
  },
  //Ethan Li Unique combos
  { 
    name: "Sword Qi Strike", 
    sequence: ["BW", "DW", "FW", "LP"], 
    damageMult: 1.0, 
    type: "PROJECTILE",
    characterSpecific: "Ethan Li",
    cooldown: 120, 
    hits: [
      { attack: "PROJECTILE", duration: 30 }
    ]
  },
  { 
    name: "Sword Qi Lunge", 
    sequence: ["BW", "FW", "LP", "HP"], 
    damageMult: 1.0, 
    type: "LUNGE_MELEE",
    characterSpecific: "Ethan Li",
    cooldown: 60, 
    requireStanding: true, 
    hits: [
      { attack: "HP", duration: 35 } 
    ]
  },
  { 
    name: "Sword Qi Fly", 
    sequence: ["BW", "FW", "UP", "UP"], 
    damageMult: 0, 
    type: "MOVEMENT", 
    characterSpecific: "Ethan Li",
    cooldown: 300, 
    isFlightCondition: true, 
    hits: [] 
  },
  { 
    name: "Sword God Slash", 
    sequence: ["BW", "BW", "HP", "HK"], 
    damageMult: 1.0, 
    type: "AIR_SLASH",
    characterSpecific: "Ethan Li",
    cooldown: 240, 
    requireFlying: true, 
    hits: [
      { attack: "HK", duration: 40 } 
    ]
  },
  { 
    name: "Sword God Judgment", 
    sequence: ["BW", "FW", "LK", "HP", "HK"], 
    damageMult: 1.0, 
    type: "JUDGMENT",
    characterSpecific: "Ethan Li",
    requireFlying: true, 
    requireLowHealth: true, 
    requireJudgmentAvailable: true, 
    hits: [
      { attack: "PROJECTILE", duration: 60 }
    ]
  },
  //Lucas Tang Unique Combos
  { 
    name: "Poison Hands", 
    sequence: ["DW", "FW", "BW", "HP"], 
    damageMult: 0, 
    type: "POWERUP",
    characterSpecific: "Lucas Tang",
    cooldown: 120, 
    duration: 300, 
    hits: []
  },
  { 
    name: "Poison Qi Palm", 
    sequence: ["LP", "HP", "LP"], 
    damageMult: 1.0, 
    type: "PROJECTILE",
    characterSpecific: "Lucas Tang",
    cooldown: 180, 
    requirePoisonHands: true, 
    hits: [
      { attack: "PROJECTILE", duration: 30 }
    ]
  },
  { 
    name: "Flame Poison Needle", 
    sequence: ["DW", "FW", "LP"], 
    damageMult: 1.0, 
    type: "PROJECTILE",
    characterSpecific: "Lucas Tang",
    cooldown: 120, 
    hits: [
      { attack: "PROJECTILE", duration: 30 }
    ]
  },
  { 
    name: "Poison Flower Field", 
    sequence: ["HP", "HK", "DW", "DW"], 
    damageMult: 0, 
    type: "AOE",
    characterSpecific: "Lucas Tang",
    cooldown: 300, 
    duration: 360, 
    requirePoisonHands: true,
    hits: []
  },
  { 
    name: "Ten Thousand Poison Flower Rain", 
    sequence: ["BW", "FW", "LP", "HP", "HK"], 
    damageMult: 1.0, 
    type: "PROJECTILE",
    characterSpecific: "Lucas Tang",
    requirePoisonField: true,    
    requireLowHealth: true,      
    requireRainAvailable: true,  
    hits: [{ attack: "PROJECTILE", duration: 300 }] 
  },
  //Aaron Shu Unique Combo
  { 
    name: "Azure Dragon Scales", 
    sequence: ["HP", "DW", "DW"], 
    damageMult: 0, 
    type: "POWERUP",
    characterSpecific: "Aaron Shu",
    cooldown: 300, 
    duration: 300,
    hits: []
  },
  { 
    name: "Undying Tortoise Body", 
    sequence: ["HK", "DW", "DW"], 
    damageMult: 0, 
    type: "POWERUP",
    characterSpecific: "Aaron Shu",
    cooldown: 300, 
    duration: 300, 
    hits: []
  },
  { 
    name: "Ocean Mending Water", 
    sequence: ["HP", "BW", "DW", "FW"], 
    damageMult: 0, 
    type: "POWERUP",
    characterSpecific: "Aaron Shu",
    cooldown: 300, 
    requireAzureScalesOrTortoise: true, 
    hits: []
  },
  { 
    name: "Unstoppable Sea Dragon", 
    sequence: ["DW", "FW", "LK", "HK"], 
    damageMult: 1.0, 
    type: "SEA_DRAGON_CHARGE",
    characterSpecific: "Aaron Shu",
    cooldown: 300, 
    requireAzureScalesOrTortoise: true,
    hits: [
      { attack: "CHARGE", duration: 60 } 
    ]
  },
  { 
    name: "Azure Flowing Dragon", 
    sequence: ["DW", "BW", "FW", "LK", "HK"], 
    damageMult: 1.0, 
    type: "AZURE_DRAGON_LAUNCHER",
    characterSpecific: "Aaron Shu",
    requireAzureScalesOrTortoise: true, 
    requireLowHealth: true, 
    requireAzureDragonAvailable: true, 
    hits: [
      { attack: "DRAGON_LAUNCH", duration: 90 } 
    ]
  },
  //Damon Cheon Unique Combos
  { 
    name: "Demonic Heavens Awakening", 
    sequence: ["DW", "FW", "LK", "HP"], 
    damageMult: 0, 
    type: "POWERUP",
    characterSpecific: "Damon Cheon",
    cooldown: 300,
    duration: 300,
    hpCost: 100, 
    hits: []
  },
  { 
    name: "Demonic Heavens Steps Forward", 
    sequence: ["DW", "DW", "FW", "FW"], 
    damageMult: 0, 
    type: "MOVEMENT",
    characterSpecific: "Damon Cheon",
    cooldown: 300, 
    isDemonicSteps: true, 
    stepsDirection: "forward", 
    hits: []
  },
  { 
    name: "Demonic Heavens Steps Backward", 
    sequence: ["DW", "DW", "BW", "BW"], 
    damageMult: 0, 
    type: "MOVEMENT",
    characterSpecific: "Damon Cheon",
    cooldown: 300, 
    isDemonicSteps: true, 
    stepsDirection: "backward",
    hits: []
  },
  { 
    name: "Demonic Heavens Claw", 
    sequence: ["DW", "DW", "LP", "HP"], 
    damageMult: 1.0, 
    type: "PROJECTILE",
    characterSpecific: "Damon Cheon",
    cooldown: 300,
    hits: [{ attack: "PROJECTILE", duration: 90 }] 
  },
  { 
    name: "Demonic Heavens Abyss", 
    sequence: ["DW", "DW", "LK", "HK"], 
    damageMult: 0, 
    type: "AOE",
    characterSpecific: "Damon Cheon",
    cooldown: 600, 
    duration: 180, 
   hits: []
  },
  { 
    name: "Demonic Heaven Annihilation", 
    sequence: ["FW", "LK", "HP", "LP", "HK"], 
    damageMult: 0, 
    type: "DAMAGE",
    characterSpecific: "Damon Cheon",
    duration: 480, 
    requireLowHealth: true, 
    requireAnnihilationAvailable: true,
    hits: []
  }
];