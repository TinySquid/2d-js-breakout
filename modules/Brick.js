import { ctx } from './Canvas.js'

export default class Brick {
  constructor(position, width, height, color, isActive) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.color = color;
    this.isActive = isActive;
  }

  draw() {
    if (this.isActive) {
      ctx.beginPath();
      ctx.rect(this.position.x, this.position.y, this.width, this.height);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
    } else {
      return;
    }
  }
}