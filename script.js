const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");

let playerX = 280;
let bullets = [];
let enemies = [];
let score = 0;

function movePlayer(e) {
  if (e.key === "ArrowLeft" && playerX > 0) {
    playerX -= 10;
  }
  if (e.key === "ArrowRight" && playerX < 560) {
    playerX += 10;
  }
  if (e.key === " ") {
    fireBullet();
  }
  player.style.left = playerX + "px";
}

function fireBullet() {
  const bullet = document.createElement("div");
  bullet.className = "bullet";
  bullet.style.left = playerX + 18 + "px";
  bullet.style.bottom = "30px";
  gameArea.appendChild(bullet);
  bullets.push(bullet);
}

function spawnEnemy() {
  const enemy = document.createElement("div");
  enemy.className = "enemy";
  enemy.style.left = Math.floor(Math.random() * 560) + "px";
  enemy.style.top = "0px";
  gameArea.appendChild(enemy);
  enemies.push(enemy);
}

function detectCollision(bullet, enemy) {
  const bRect = bullet.getBoundingClientRect();
  const eRect = enemy.getBoundingClientRect();
  return !(
    bRect.top > eRect.bottom ||
    bRect.bottom < eRect.top ||
    bRect.right < eRect.left ||
    bRect.left > eRect.right
  );
}

function updateGame() {
  // Update bullets
  bullets = bullets.filter(bullet => {
    let bottom = parseInt(bullet.style.bottom);
    bottom += 8;
    bullet.style.bottom = bottom + "px";
    if (bottom > 400) {
      gameArea.removeChild(bullet);
      return false;
    }
    return true;
  });

  // Update enemies
  enemies.forEach(enemy => {
    let top = parseInt(enemy.style.top);
    enemy.style.top = top + 2 + "px";
  });

  // Check for collisions
  enemies = enemies.filter(enemy => {
    for (let bullet of bullets) {
      if (detectCollision(bullet, enemy)) {
        gameArea.removeChild(enemy);
        gameArea.removeChild(bullet);
        bullets.splice(bullets.indexOf(bullet), 1);
        score += 10;
        scoreDisplay.textContent = score;
        return false;
      }
    }
    return true;
  });
}

function gameLoop() {
  updateGame();
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", movePlayer);
setInterval(spawnEnemy, 1000);
gameLoop();
