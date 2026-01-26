// Controls.js
// P1: WASD + YUHJ for attacks
// P2: Arrow keys + placeholder attacks

const PLAYER_CONTROLS = {
  P1: {
    left: 65,        // 'A'
    right: 68,       // 'D'
    jump: 87,        // 'W'
    crouch: 83,      // 'S'
    lightPunch: 89,  // 'Y'
    heavyPunch: 85,  // 'U'
    lightKick: 72,   // 'H'
    heavyKick: 74    // 'J'
  },

  P2: {
    left: LEFT_ARROW,
    right: RIGHT_ARROW,
    jump: UP_ARROW,
    crouch: DOWN_ARROW,
    lightPunch: 73,  // 'I'
    heavyPunch: 79,  // 'O'
    lightKick: 75,   // 'K'
    heavyKick: 76    // 'L'
  }
};
