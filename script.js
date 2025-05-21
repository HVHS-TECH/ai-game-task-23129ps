const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const gameOverText = document.getElementById("gameOver");

let playerX = 280;
let bullets = [];
let enemyBullets = [];
let enemies = [];
let score = 0;
let lives = 3;
let gameRunning = true;

function movePlayer(e) {
  if (!gameRunning) return;
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

function fireEnemyBullet(enemyX, enemyY) {
  const bullet = document.createElement("div");
  bullet.className = "enemyBullet";
  bullet.style.left = enemyX + 18 + "px";
  bullet.style.top = enemyY + "px";
  gameArea.appendChild(bullet);
  enemyBullets.push(bullet);
}

function spawnEnemies(rows = 3, cols = 8) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const enemy = document.createElement("div");
      enemy.className = "enemy";
      enemy.style.left = c * 70 + "px";
      enemy.style.top = r * 40 + "px";
      enemy.dataset.dir = "right";
      gameArea.appendChild(enemy);
      enemies.push(enemy);
    }
  }
}

function detectCollision(a, b) {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();
  return !(
    aRect.top > bRect.bottom ||
    aRect.bottom < bRect.top ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  );
}

function updateGame() {
  if (!gameRunning) return;

  // Player bullets
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

  // Enemy bullets
  enemyBullets = enemyBullets.filter(bullet => {
    let top = parseInt(bullet.style.top);
    top += 6;
    bullet.style.top = top + "px";
    if (top > 400) {
      gameArea.removeChild(bullet);
      return false;
    }

    // Hit player
    if (detectCollision(bullet, player)) {
      gameArea.removeChild(bullet);
      lives -= 1;
      livesDisplay.textContent = lives;
      if (lives <= 0) endGame();
      return false;
    }

    return true;
  });

  // Enemy movement
  enemies.forEach(enemy => {
    let dir = enemy.dataset.dir;
    let left = parseInt(enemy.style.left);
    if (dir === "right") left += 1;
    else left -= 1;
    if (left > 560) {
      left = 560;
      enemy.dataset.dir = "left";
      enemy.style.top = parseInt(enemy.style.top) + 20 + "px";
    } else if (left < 0) {
      left = 0;
      enemy.dataset.dir = "right";
      enemy.style.top = parseInt(enemy.style.top) + 20 + "px";
    }
    enemy.style.left = left + "px";

    // Fire enemy bullet randomly
    if (Math.random() < 0.002) {
      fireEnemyBullet(left, parseInt(enemy.style.top));
    }
  });

  // Bullet hits enemy
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

  if (enemies.length === 0) {
    spawnEnemies();
  }

  requestAnimationFrame(updateGame);
}

function endGame() {
  gameRunning = false;
  gameOverText.style.display = "block";
  enemies.forEach(e => gameArea.removeChild(e));
  bullets.forEach(b => gameArea.removeChild(b));
  enemyBullets.forEach(b => gameArea.removeChild(b));
}

document.addEventListener("keydown", movePlayer);
spawnEnemies();
updateGame();
