import { ctx } from './Canvas.js'

export default class Ball {
  constructor(x, y, size, color, speed) {
    this.position = { x: x, y: y };
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

  getPos() {
    return this.position;
  }

  setPos(position) {
    //New position object must only have two keys
    if (Object.keys(position).length === 2) {
      //Keys MUST be only x & y
      if (position.hasOwnProperty('x') && position.hasOwnProperty('y')) {
        this.position = position;
      } else {
        console.error(`Error: setPos expects format to be: '{x: value, y: value}'.`);
      }
    } else {
      console.error(`Error: setPos expects an object that has two keys (x, y).`);
    }
    return true;
  }

  getSpeed() {
    return this.speed;
  }

  setSpeed(speed) {
    this.speed = Number(speed);
  }

  getSize() {
    return this.size;
  }

  setSize(size) {
    this.size = Number(size);
  }

  // getColor(){
  //   return this.color;
  // }

  setColor(color) {
    this.color = color;
  }
}