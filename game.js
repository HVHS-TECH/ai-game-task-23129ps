// Get the canvas element and its context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Define the player, invaders, and bullets
const player = {
  width: 50,
  height: 20,
  x: canvas.width / 2 - 25,
  y: canvas.height - 30,
  speed: 5,
  dx: 0
};

const invaders = [];
const invaderRowCount = 3;
const invaderColumnCount = 7;
const invaderWidth = 40;
const invaderHeight = 30;
const invaderPadding = 10;
const invaderOffsetTop = 30;
const invaderOffsetLeft = 30;

const bullets = [];
const bulletSpeed = 4;

// Draw the player
function drawPlayer() {
  ctx.fillStyle = "white";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw the invaders
function drawInvaders() {
  for (let c = 0; c < invaderColumnCount; c++) {
    for (let r = 0; r < invaderRowCount; r++) {
      const invaderX = c * (invaderWidth + invaderPadding) + invaderOffsetLeft;
      const invaderY = r * (invaderHeight + invaderPadding) + invaderOffsetTop;
      ctx.fillStyle = "green";
      ctx.fillRect(invaderX, invaderY, invaderWidth, invaderHeight);
    }
  }
}

// Draw the bullets
function drawBullets() {
  bullets.forEach((bullet, index) => {
    ctx.fillStyle = "red";
    ctx.fillRect(bullet.x, bullet.y, 5, 10);
    bullet.y -= bulletSpeed;
    
    // Remove bullet if out of canvas
    if (bullet.y < 0) {
      bullets.splice(index, 1);
    }
  });
}

// Move the player based on user input
function movePlayer() {
  player.x += player.dx;
  if (player.x < 0) {
    player.x = 0;
  }
  if (player.x + player.width > canvas.width) {
    player.x = canvas.width - player.width;
  }
}

// Handle keydown and keyup events
function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    player.dx = player.speed;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    player.dx = -player.speed;
  } else if (e.key === "Space") {
    shootBullet();
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight" || e.key === "Left" || e.key === "ArrowLeft") {
    player.dx = 0;
  }
}

// Shoot a bullet from the player
function shootBullet() {
  const bullet = {
    x: player.x + player.width / 2 - 2.5,
    y: player.y
  };
  bullets.push(bullet);
}

// Update the game elements
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawInvaders();
  drawBullets();
  movePlayer();
  requestAnimationFrame(update);
}

// Set up event listeners
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Initialize the game
function init() {
  update();
}

init();
