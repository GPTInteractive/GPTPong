const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Create the pong paddles and ball
const paddleWidth = 10, paddleHeight = 100;
const ballSize = 10;

let leftPaddle = { x: 0, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, speed: 0 };
let rightPaddle = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, speed: 0 };
let ball = { x: canvas.width / 2, y: canvas.height / 2, radius: ballSize, speedX: 5, speedY: 5 };

let leftScore = 0, rightScore = 0;

// Pause state
let paused = false;

// Timer state
let timer = 0; // in seconds

// Draw a rectangle (paddle)
function drawPaddle(x, y, width, height) {
  ctx.fillStyle = "white";
  ctx.fillRect(x, y, width, height);
}

// Draw the ball
function drawBall(x, y, radius) {
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

// Draw the score
function drawScore() {
  ctx.font = "32px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(leftScore, canvas.width / 4, 50);
  ctx.fillText(rightScore, (canvas.width / 4) * 3, 50);
}

// Draw the timer
function drawTimer() {
    let hours = Math.floor(timer / 3600);
    let minutes = Math.floor((timer % 3600) / 60);
    let seconds = timer % 60;
  
    // Format timer in 00:00:00 format
    let timeString = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
  
    ctx.font = "32px Arial";
    ctx.fillStyle = "white";
  
    // Calculate the width of the text and position it at the center
    let textWidth = ctx.measureText(timeString).width;
    let xPosition = (canvas.width - textWidth) / 2;  // Center the text horizontally
  
    // Draw the timer text at the calculated position
    ctx.fillText(timeString, xPosition, 50);
  }
  

// Helper function to pad single digits with zero
function padZero(number) {
  return number < 10 ? "0" + number : number;
}

// Move paddles based on player input
function movePaddle(paddle, upKey, downKey) {
  if (upKey) paddle.speed = -8;
  else if (downKey) paddle.speed = 8;
  else paddle.speed = 0;

  paddle.y += paddle.speed;
  
  // Prevent paddles from going out of bounds
  if (paddle.y < 0) paddle.y = 0;
  if (paddle.y + paddle.height > canvas.height) paddle.y = canvas.height - paddle.height;
}

// Update ball position and collision
function moveBall() {
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  // Ball collision with top and bottom
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.speedY = -ball.speedY;
  }

  // Ball collision with paddles
  if (ball.x - ball.radius < leftPaddle.x + leftPaddle.width && 
      ball.y > leftPaddle.y && 
      ball.y < leftPaddle.y + leftPaddle.height) {
    ball.speedX = -ball.speedX;
  }
  if (ball.x + ball.radius > rightPaddle.x && 
      ball.y > rightPaddle.y && 
      ball.y < rightPaddle.y + rightPaddle.height) {
    ball.speedX = -ball.speedX;
  }

  // Ball out of bounds (score)
  if (ball.x - ball.radius < 0) {
    // Right player gets a point, ball reset
    rightScore++;
    resetBall();
  }
  if (ball.x + ball.radius > canvas.width) {
    // Left player gets a point, ball reset
    leftScore++;
    resetBall();
  }
}

// Reset ball to the center
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speedX = ball.speedX > 0 ? 5 : -5; // Ball direction is based on previous direction
  ball.speedY = 5; // Reset Y speed
}

// Game loop
function gameLoop() {
  if (!paused) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    moveBall();
    movePaddle(leftPaddle, upPressedLeft, downPressedLeft);
    movePaddle(rightPaddle, upPressedRight, downPressedRight);

    drawPaddle(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    drawPaddle(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
    drawBall(ball.x, ball.y, ball.radius);
    drawScore();
    drawTimer();

    // Update the timer every second
    timer++;
  } else {
    // Draw a pause message if the game is paused
    ctx.font = "48px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("PAUSED", canvas.width / 2 - 100, canvas.height / 2);
  }

  requestAnimationFrame(gameLoop);
}

// Control paddles with keyboard
let upPressedLeft = false, downPressedLeft = false;
let upPressedRight = false, downPressedRight = false;

document.addEventListener("keydown", (event) => {
  // Toggle pause with P key
  if (event.key === "p" || event.key === "P") {
    paused = !paused;
  }

  // Left paddle: W and S keys
  if (event.key === "w") upPressedLeft = true;
  if (event.key === "s") downPressedLeft = true;
  
  // Right paddle: Arrow keys
  if (event.key === "ArrowUp") upPressedRight = true;
  if (event.key === "ArrowDown") downPressedRight = true;
});

document.addEventListener("keyup", (event) => {
  // Left paddle: W and S keys
  if (event.key === "w") upPressedLeft = false;
  if (event.key === "s") downPressedLeft = false;
  
  // Right paddle: Arrow keys
  if (event.key === "ArrowUp") upPressedRight = false;
  if (event.key === "ArrowDown") downPressedRight = false;
});

// Start game
gameLoop();
