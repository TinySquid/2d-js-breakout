import { ctx } from './Canvas.js'

export const drawText = (text, font, fontSize, color, position) => {
  ctx.font = `${fontSize} ${font}`;
  ctx.fillStyle = color;
  ctx.fillText(text, position.x, position.y);
}