import { canvas, ctx } from './modules/Canvas.js';
import { drawText } from './modules/Display.js';

import Paddle from './modules/Paddle.js';
import Ball from './modules/Ball.js';
import Brick from './modules/Brick.js'

let gameIsActive = false;
let frameReqHandle;
let score = 0;
let lives = 3;

let gameFont = "Arial";
let gameFontSize = "16px";
let gameFontColor = "#0095DD";

let paddle = new Paddle({ x: (canvas.width - 75) / 2, y: canvas.height - 10 }, 75, 10, '#0095DD');

let ball = new Ball({ x: canvas.width / 2, y: canvas.height - 30 }, 10, '#364167', 6);

let dx = ball.speed;
let dy = -ball.speed;

let brickRowCount = 7;
let brickColumnCount = 4;
let brickWidth = 75;
let brickHeight = 25;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    let brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
    let brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
    let brick = new Brick(
      { x: brickX, y: brickY },
      brickWidth,
      brickHeight,
      randomHexColor(),
      true
    );

    bricks[c][r] = brick;
  }
}

const drawBricks = () => {
  bricks.forEach(brickRow => {
    brickRow.forEach(brick => {
      brick.draw();
    });
  });
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.isActive === true) {
        if (ball.position.x > b.position.x && ball.position.x < b.position.x + brickWidth && ball.position.y > b.position.y && ball.position.y < b.position.y + brickHeight) {
          dy = -dy;
          b.isActive = false;
          score++;
          if (score == brickRowCount * brickColumnCount) {
            alert("YOU WIN, CONGRATS!");
            document.location.reload();
          }
        }
      }
    }
  }
}

let rightPressed = false;
let leftPressed = false;

const keyDownHandler = e => {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  }
  else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
  else if (e.key == "Enter") {
    if (!gameIsActive) {
      gameIsActive = true;
      draw();
    }
  } else if (e.key == "Escape") {
    if (gameIsActive) {
      cancelAnimationFrame(frameReqHandle);
      gameIsActive = false;
      drawText('GAME PAUSED',
        gameFont,
        gameFontSize,
        gameFontColor,
        { x: canvas.width / 2 - 60, y: canvas.height / 2 }
      )
      drawText('Press ESCAPE to unpause',
        gameFont,
        gameFontSize,
        gameFontColor,
        { x: canvas.width / 2 - 100, y: canvas.height / 2 + 20 }
      )
    } else {
      gameIsActive = true;
      draw();
    }
  }
}

const keyUpHandler = e => {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  }
  else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

const mouseMoveHandler = e => {
  let relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddle.position.x = relativeX - paddle.width / 2;
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

const drawScore = () => {
  drawText(`Score: ${score}`,
    gameFont,
    gameFontSize,
    gameFontColor,
    { x: 8, y: 20 }
  )
}

const drawLives = () => {
  drawText(`Lives: ${lives}`,
    gameFont,
    gameFontSize,
    gameFontColor,
    { x: canvas.width - 65, y: 20 }
  )
}

const drawStartText = () => {
  drawText("Press ENTER to start the game!",
    gameFont,
    gameFontSize,
    gameFontColor,
    { x: canvas.width / 2 - 115, y: canvas.height / 2 }
  );
  drawText("Press ESCAPE to pause.",
    gameFont,
    gameFontSize,
    gameFontColor,
    { x: canvas.width / 2 - 88, y: canvas.height / 2 + 20 }
  );
}

drawStartText();

//Sync to original FPS code credit goes to Rishabh @ https://codetheory.in/controlling-the-frame-rate-with-requestanimationframe/
let fps = 60;
let now, delta;
let then = performance.now();
let interval = 1000 / fps;

const draw = () => {
  if (gameIsActive) {
    frameReqHandle = requestAnimationFrame(draw);

    now = performance.now();
    delta = now - then;

    if (delta > interval) {
      then = now - (delta % interval);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawScore();
      drawLives();
      paddle.draw();
      ball.draw();
      drawBricks();
      collisionDetection();

      if (ball.position.x + dx > canvas.width - ball.size) { //Right wall detection
        dx = -ball.speed;
      } else if (ball.position.x + dx < ball.size) { //Left wall detection
        dx = ball.speed;
      }
      if (ball.position.y + dy < ball.size) { //Roof detection
        dy = ball.speed;
      } else if (ball.position.y + dy > canvas.height - ball.size) { //Floor area detection
        if (ball.position.x > paddle.position.x && ball.position.x < paddle.position.x + paddle.width) { //Paddle hit detection
          dy = -ball.speed;
        } else {
          lives--; //Lose 1 life if ball hit floor and not paddle
          if (!lives) { //Game over detection
            alert("GAME OVER");
            document.location.reload();
          } else { //Reset ball position & paddle position
            console.log(`Ball position: ${ball.position.x} ${ball.position.y}`)
            ball.position = { x: canvas.width / 2, y: canvas.height - 30 };
            console.log(`Ball position: ${ball.position.x} ${ball.position.y}`)
            paddle.position = { x: (canvas.width - 75) / 2, y: canvas.height - 10 };;

            //Reset delta movement
            dx = ball.speed;
            dy = -ball.speed;
          }
        }
      }

      if (rightPressed && paddle.position.x < canvas.width - paddle.width) { //Move paddle right on key
        paddle.position.x += 7;
      }
      else if (leftPressed && paddle.position.x > 0) { //Move paddle left on key
        paddle.position.x -= 7;
      }

      ball.position.x += dx;
      ball.position.y += dy;
    }
  }
}

//Code to get random hex color provided by user on stack overflow:
//https://stackoverflow.com/a/5092846
function randomHexColor() { return '#' + (Math.random() * 0xFFFFFF << 0).toString(16); }

/*
Original source
https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript
Contributors
JoeParrilla, mdnwebdocs-bot, wbamberg, jswisher, jolosan, cristianvnica, chrisdavidmills, Twoteka, Jeremie, end3r, fscholz, rabimba
*/
