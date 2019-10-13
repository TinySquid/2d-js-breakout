import { canvas, ctx } from './modules/Canvas.js';
import Ball from './modules/Ball.js';

let gameIsActive = false;

let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

let brickRowCount = 5;
let brickColumnCount = 3;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

let brickColor = randomHexColor();

let score = 0;
let lives = 3;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  }
  else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
  else if (e.key == "Enter") {
    if (!gameIsActive) {
      draw();
    }
  }
}

drawStartText();

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  }
  else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status == 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
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

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        let brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
        let brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        // ctx.fillStyle = "#0095DD";
        ctx.fillStyle = brickColor;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function drawStartText() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Press ENTER to start the game!", canvas.width / 2 - 115, canvas.height / 2);
}

let ball = new Ball(canvas.width / 2, canvas.height - 30, 10, '#364167', 3);

let dx = ball.getSpeed();
let dy = -ball.getSpeed();

let ballX = ball.getPos().x;
let ballY = ball.getPos().y;

let ballSpeed = ball.getSpeed();

let resetPos = { x: canvas.width / 2, y: canvas.height - 30 };


//Sync to FPS code credit goes to Rishabh @ https://codetheory.in/controlling-the-frame-rate-with-requestanimationframe/
let fps = 60;
let now, delta;
let then = Date.now();
let interval = 1000 / fps;

function draw() {

  requestAnimationFrame(draw);

  now = Date.now();
  delta = now - then;

  if (delta > interval) {
    then = now - (delta % interval);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //drawBricks();
    ball.draw();
    drawPaddle();
    drawScore();
    drawLives();
    //collisionDetection();

    if (ballX + dx > canvas.width - ball.getSize()) { //Right wall detection
      dx = -ballSpeed;
    } else if (ballX + dx < ball.getSize()) { //Left wall detection
      dx = ballSpeed;
    }
    if (ballY + dy < ball.getSize()) { //Roof detection
      dy = ballSpeed;
    } else if (ballY + dy > canvas.height - ball.getSize()) { //Floor area detection
      if (ballX > paddleX && ballX < paddleX + paddleWidth) { //Paddle hit detection
        dy = -ballSpeed;
      } else {
        lives--; //Lose 1 life if ball hit floor and not paddle
        if (!lives) { //Game over detection
          alert("GAME OVER");
          document.location.reload();
        } else { //Reset ball position & paddle position
          ball.setPos(resetPos);
          ballX = ball.getPos().x;
          ballY = ball.getPos().y;
          dx = ball.getSpeed();
          dy = -ball.getSpeed();
          paddleX = (canvas.width - paddleWidth) / 2;
        }
      }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) { //Move paddle right on key
      paddleX += 7;
    }
    else if (leftPressed && paddleX > 0) { //Move paddle left on key
      paddleX -= 7;
    }

    ball.setPos({ x: ballX += dx, y: ballY += dy });

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
