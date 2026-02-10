class InputBuffer {
  constructor() {
    this.history = []; 
    this.bufferWindow = 60; 
  }

  recordInput(inputLabel) {
    this.history.push({ 
      label: inputLabel, 
      frame: frameCount 
    });
  }

  update() {
    this.history = this.history.filter(i => frameCount - i.frame < this.bufferWindow);
  }

  static getDirectionalInput(keyCode, character) {
    if (keyCode === character.controls.left) return (character.facing === 1) ? "BW" : "FW";
    if (keyCode === character.controls.right) return (character.facing === 1) ? "FW" : "BW";
    if (keyCode === character.controls.crouch) return "DW";
    if (keyCode === character.controls.jump) return "UP";
    return null;
  }

  checkDoubleTap(dir) {
    if (this.history.length < 2) return false;
    
    let last = this.history[this.history.length - 1];
    let prev = this.history[this.history.length - 2];

    if (last.label === dir && prev.label === dir) {
        let frameDiff = last.frame - prev.frame;
        if (frameDiff > 2 && frameDiff < 15) {
            this.history = []; 
            return true;
        }
    }
    return false;
  }
}
// DO NOT PUT "let p1Buffer" HERE ANYMORE!