class CameraSystem {
  constructor() {
    this.pos = { x: 0, y: 0 }; 
    this.zoom = 1;
    this.minZoom = 0.5; 
    this.maxZoom = 1.0;
    this.lerpSpeed = 0.08; 
    this.padding = 200; 
  }

  update(p1, p2) {
    if (!p1 || !p2) return;

    //Target Midpoint
    let targetX = (p1.x + p1.w / 2 + p2.x + p2.w / 2) / 2;
    let targetY = (p1.y + p1.h / 2 + p2.y + p2.h / 2) / 2;

    //Zoom based on distance
    let dist = abs(p1.x - p2.x);
    let targetZoom = map(dist, 200, width - this.padding, this.maxZoom, this.minZoom);
    this.zoom = lerp(this.zoom, constrain(targetZoom, this.minZoom, this.maxZoom), this.lerpSpeed);

    //Smoothly follow
    this.pos.x = lerp(this.pos.x, targetX, this.lerpSpeed);
    this.pos.y = lerp(this.pos.y, targetY, this.lerpSpeed);
  }

  apply() {
    translate(width / 2, height / 2);
    scale(this.zoom);
    translate(-this.pos.x, -this.pos.y);
  }
}