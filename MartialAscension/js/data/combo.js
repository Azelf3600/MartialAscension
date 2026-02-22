const STANDARD_COMBOS = [
  { 
    name: "Launcher", 
    sequence: ["DW", "FW", "HP"], 
    damageMult: 1.0, 
    type: "LAUNCH",
    hits: [
      { attack: "DW", duration: 8 },   // Crouch startup
      { attack: "FW", duration: 8 },   // Forward dash
      { attack: "HP", duration: 22 }   // Heavy punch finisher
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
      { attack: "UP", duration: 8 },   // Jump startup
      { attack: "FW", duration: 10 },  // Forward momentum
      { attack: "HK", duration: 25 }   // Diving kick finisher
    ]
  },
  //Ethan Li Unique combos
  { 
    name: "Sword Qi Strike", 
    sequence: ["BW", "DW", "FW", "LP"], 
    damageMult: 1.0, 
    type: "PROJECTILE",
    characterSpecific: "Ethan Li",
    cooldown: 120, // NEW: 120 frames = 2 seconds (60 fps)
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
    cooldown: 60, // 1 second
    requireStanding: true, // NEW: Must be standing (not crouching)
    hits: [
      { attack: "HP", duration: 35 } // Total lunge duration (10 pullback + 25 burst)
    ]
  },
  { 
    name: "Sword Qi Fly", 
    sequence: ["BW", "FW", "UP", "UP"], 
    damageMult: 0, 
    type: "MOVEMENT", // NEW: Movement type
    characterSpecific: "Ethan Li",
    cooldown: 300, // 5 seconds
    isFlightCondition: true, // NEW: This enables flight state
    hits: [] // No damage hits
  },
  { 
    name: "Sword God Slash", 
    sequence: ["BW", "BW", "HP", "HK"], 
    damageMult: 1.0, 
    type: "AIR_SLASH",
    characterSpecific: "Ethan Li",
    cooldown: 240, // 4 seconds
    requireFlying: true, // NEW: Only works during Sword Qi Fly
    hits: [
      { attack: "HK", duration: 40 } // Teleport + slash animation
    ]
  },
  { 
    name: "Sword God Judgment", 
    sequence: ["BW", "FW", "LK", "HP", "HK"], 
    damageMult: 1.0, 
    type: "JUDGMENT",
    characterSpecific: "Ethan Li",
    requireFlying: true, // Must be in Sword Qi Fly
    requireLowHealth: true, // Must be 50% HP or below
    requireJudgmentAvailable: true, // Once per round
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
    cooldown: 120, // 2 seconds
    duration: 300, // 5 seconds
    hits: []
  },
  { 
    name: "Poison Qi Palm", 
    sequence: ["LP", "HP", "LP"], 
    damageMult: 1.0, 
    type: "PROJECTILE",
    characterSpecific: "Lucas Tang",
    cooldown: 180, // 3 seconds
    requirePoisonHands: true, // Must have Poison Hands active
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
    cooldown: 120, // 3 seconds
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
    cooldown: 300, // 5 seconds
    duration: 360, // 5 seconds
    requirePoisonHands: true,
    hits: []
  },
  { 
    name: "Ten Thousand Poison Flower Rain", 
    sequence: ["BW", "FW", "LP", "HP", "HK"], 
    damageMult: 1.0, 
    type: "PROJECTILE",
    characterSpecific: "Lucas Tang",
    requirePoisonField: true,    // Must have Poison Flower Field active
    requireLowHealth: true,      // Must be 50% HP or below
    requireRainAvailable: true,  // Once per round
    hits: [{ attack: "PROJECTILE", duration: 300 }] // 5 second duration
  },
  //Aaron Shu Unique Combo
  { 
    name: "Azure Dragon Scales", 
    sequence: ["HP", "DW", "DW"], 
    damageMult: 0, 
    type: "POWERUP",
    characterSpecific: "Aaron Shu",
    cooldown: 300, // 5 seconds
    duration: 300, // 5 seconds
    hits: []
  },
  { 
    name: "Undying Tortoise Body", 
    sequence: ["HK", "DW", "DW"], 
    damageMult: 0, 
    type: "POWERUP",
    characterSpecific: "Aaron Shu",
    cooldown: 300, // 5 seconds
    duration: 300, // 5 seconds
    hits: []
  },
  { 
    name: "Ocean Mending Water", 
    sequence: ["HP", "BW", "DW", "FW"], 
    damageMult: 0, 
    type: "POWERUP",
    characterSpecific: "Aaron Shu",
    cooldown: 300, // 3 seconds
    requireAzureScalesOrTortoise: true, // Must have either buff active
    hits: []
  },
  { 
    name: "Unstoppable Sea Dragon", 
    sequence: ["DW", "FW", "LK", "HK"], 
    damageMult: 1.0, 
    type: "SEA_DRAGON_CHARGE",
    characterSpecific: "Aaron Shu",
    cooldown: 300, // 5 seconds
    requireAzureScalesOrTortoise: true, // Must have either buff active
    hits: [
      { attack: "CHARGE", duration: 60 } // ~1 second charge duration
    ]
  },
  { 
    name: "Azure Flowing Dragon", 
    sequence: ["DW", "BW", "FW", "LK", "HK"], 
    damageMult: 1.0, 
    type: "AZURE_DRAGON_LAUNCHER",
    characterSpecific: "Aaron Shu",
    requireAzureScalesOrTortoise: true, // Must have either buff active
    requireLowHealth: true, // Must be 50% HP or below
    requireAzureDragonAvailable: true, // Once per round
    hits: [
      { attack: "DRAGON_LAUNCH", duration: 90 } // 2 seconds total (1s indicator + 1s emerge)
    ]
  },
  //Damon Cheon Unique Combos
  { 
    name: "Demonic Heavens Awakening", 
    sequence: ["DW", "FW", "LK", "HP"], 
    damageMult: 0, 
    type: "POWERUP",
    characterSpecific: "Damon Cheon",
    cooldown: 300, // 5 seconds
    duration: 300, // 5 seconds
    hpCost: 100, // NEW: HP cost to activate
    hits: []
  },
  { 
    name: "Demonic Heavens Steps Forward", 
    sequence: ["DW", "DW", "FW", "FW"], 
    damageMult: 0, 
    type: "MOVEMENT",
    characterSpecific: "Damon Cheon",
    cooldown: 300, // 5 seconds
    isDemonicSteps: true, // NEW: Flag for special behavior
    stepsDirection: "forward", // NEW: Which direction
    hits: []
  },
  { 
    name: "Demonic Heavens Steps Backward", 
    sequence: ["DW", "DW", "BW", "BW"], 
    damageMult: 0, 
    type: "MOVEMENT",
    characterSpecific: "Damon Cheon",
    cooldown: 300, // 5 seconds
    isDemonicSteps: true, // NEW: Flag for special behavior
    stepsDirection: "backward", // NEW: Which direction
    hits: []
  },
  { 
    name: "Demonic Heavens Claw", 
    sequence: ["DW", "DW", "LP", "HP"], 
    damageMult: 1.0, 
    type: "PROJECTILE",
    characterSpecific: "Damon Cheon",
    cooldown: 300, // 5 seconds
    hits: [{ attack: "PROJECTILE", duration: 90 }] // 1.5 seconds total (indicator + emerge)
  },
  { 
    name: "Demonic Heavens Abyss", 
    sequence: ["DW", "DW", "LK", "HK"], 
    damageMult: 0, 
    type: "AOE",
    characterSpecific: "Damon Cheon",
    cooldown: 300, // 5 seconds
    duration: 180, // 3 seconds
   hits: []
  },
  { 
    name: "Demonic Heaven Annihilation", 
    sequence: ["FW", "LK", "HP", "LP", "HK"], 
    damageMult: 0, 
    type: "DAMAGE",
    characterSpecific: "Damon Cheon",
    duration: 480, // 8 seconds
    requireLowHealth: true, // 50% HP or below
    requireAnnihilationAvailable: true, // Once per round
    hits: []
  }
];