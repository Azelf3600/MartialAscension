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
  }
];