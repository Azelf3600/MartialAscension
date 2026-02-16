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
    sequence: ["FW", "BW", "UP", "UP"], 
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
    sequence: ["FW", "BW", "LK", "HP", "HK"], 
    damageMult: 1.0, 
    type: "JUDGMENT",
    characterSpecific: "Ethan Li",
    requireFlying: true, // Must be in Sword Qi Fly
    requireLowHealth: true, // Must be 50% HP or below
    requireJudgmentAvailable: true, // Once per round
    hits: [
      { attack: "PROJECTILE", duration: 60 }
    ]
  }
];