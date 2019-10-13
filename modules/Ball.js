import { ctx } from './Canvas.js'

export default class Ball {
  constructor(position, size, color, speed) {
    this.position = position;
    this.size = size;
    this.color = color;
    this.speed = speed;
    this.circle = Math.PI * 2;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size, 0, this.circle);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}