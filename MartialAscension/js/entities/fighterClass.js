class Character {
  constructor(x, y, w, h, color, controls, name = "Fighter") {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
    this.name = name;

    this.speed = 5;
    this.isJumping = false;
    this.jumpHeight = 100;
    this.groundY = y; // store original ground position

    this.controls = controls; // pass PLAYER_CONTROLS.P1 / P2

    this.attacking = null; // current attack
  }

  draw() {
    fill(this.color);
    rect(this.x, this.y, this.w, this.h);

    if (this.attacking) {
      this.drawAttack(this.attacking);
    }
  }

  move() {
    if (keyIsDown(this.controls.left)) this.x -= this.speed;
    if (keyIsDown(this.controls.right)) this.x += this.speed;

    if (keyIsDown(this.controls.jump) && !this.isJumping) {
      this.isJumping = true;
      this.y -= this.jumpHeight;
      setTimeout(() => {
        this.y = this.groundY;
        this.isJumping = false;
      }, 300);
    }

    if (keyIsDown(this.controls.crouch)) this.h = 50;
    else this.h = 100;
  }

  handleAttack() {
    if (keyIsDown(this.controls.lightPunch)) this.attacking = "lightPunch";
    else if (keyIsDown(this.controls.heavyPunch)) this.attacking = "heavyPunch";
    else if (keyIsDown(this.controls.lightKick)) this.attacking = "lightKick";
    else if (keyIsDown(this.controls.heavyKick)) this.attacking = "heavyKick";
    else this.attacking = null;
  }

  drawAttack(type) {
    let atkX = this.x + this.w;
    let atkY = this.y;
    let atkW, atkH, col;

    switch (type) {
      case "lightPunch": atkW = 20; atkH = 10; atkY += 20; col = "yellow"; break;
      case "heavyPunch": atkW = 30; atkH = 15; atkY += 10; col = "orange"; break;
      case "lightKick": atkW = 25; atkH = 10; atkY += 70; col = "green"; break;
      case "heavyKick": atkW = 35; atkH = 15; atkY += 60; col = "red"; break;
    }

    fill(col);
    rect(atkX, atkY, atkW, atkH);
  }
}
