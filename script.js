const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const gameOverText = document.getElementById("gameOver");
const restartBtn = document.getElementById("restartBtn");

let gameState;

function initGame() {
  gameState = {
    playerX: 280,
    bullets: [],
    enemyBullets: [],
    enemies: [],
    score: 0,
    lives: 3,
    level: 1,
    running: true,
    frame: 0,
  };

  player.style.left = gameState.playerX + "px";
  scoreDisplay.textContent = gameState.score;
  livesDisplay.textContent = gameState.lives;
  gameOverText.style.display = "none";
  gameArea.innerHTML = '';
  gameArea.appendChild(player);
  spawnEnemies();
  gameLoop();
}

function spawnEnemies(rows = 3, cols = 8) {
  gameState.enemies = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const enemy = document.createElement("div");
      enemy.className = "enemy";

      const x = c * 70;
      const y = r * 40;

      enemy.style.left = x + "px";
      enemy.style.top = y + "px";

      const speedX = (Math.random() * 1.5 + 0.5).toFixed(2); // 0.5–2
      const speedY = (Math.random() * 1.5).toFixed(2);       // 0–1.5
      const dirX = Math.random() < 0.5 ? -1 : 1;
      const dirY = Math.random() < 0.5 ? -1 : 1;

      enemy.dataset.speedX = speedX;
      enemy.dataset.speedY = speedY;
      enemy.dataset.dirX = dirX;
      enemy.dataset.dirY = dirY;

      gameArea.appendChild(enemy);
      gameState.enemies.push(enemy);
    }
  }
}

function fireBullet() {
  const bullet = document.createElement("div");
  bullet.className = "bullet";
  bullet.style.left = gameState.playerX + 18 + "px";
  bullet.style.bottom = "30px";
  gameArea.appendChild(bullet);
  gameState.bullets.push(bullet);
}

function fireEnemyBullet(enemyX, enemyY) {
  const bullet = document.createElement("div");
  bullet.className = "enemyBullet";
  bullet.style.left = enemyX + 18 + "px";
  bullet.style.top = enemyY + "px";
  gameArea.appendChild(bullet);
  gameState.enemyBullets.push(bullet);
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

function updateBullets() {
  // Player bullets
  gameState.bullets = gameState.bullets.filter(bullet => {
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
  gameState.enemyBullets = gameState.enemyBullets.filter(bullet => {
    let top = parseInt(bullet.style.top);
    top += 6;
    bullet.style.top = top + "px";

    if (top > 400) {
      gameArea.removeChild(bullet);
      return false;
    }

    if (detectCollision(bullet, player)) {
      gameArea.removeChild(bullet);
      gameState.lives -= 1;
      livesDisplay.textContent = gameState.lives;
      if (gameState.lives <= 0) endGame();
      return false;
    }

    return true;
  });
}

function updateEnemies() {
  gameState.enemies.forEach(enemy => {
    let left = parseFloat(enemy.style.left);
    let top = parseFloat(enemy.style.top);

    let speedX = parseFloat(enemy.dataset.speedX);
    let speedY = parseFloat(enemy.dataset.speedY);
    let dirX = parseInt(enemy.dataset.dirX);
    let dirY = parseInt(enemy.dataset.dirY);

    left += speedX * dirX;
    top += speedY * dirY;

    // Bounce on edge
    if (left <= 0 || left >= 560) {
      dirX *= -1;
      enemy.dataset.dirX = dirX;
    }
    if (top <= 0 || top >= 300) {
      dirY *= -1;
      enemy.dataset.dirY = dirY;
    }

    enemy.style.left = left + "px";
    enemy.style.top = top + "px";

    if (Math.random() < 0.001 + gameState.level * 0.0005) {
      fireEnemyBullet(left, top);
    }
  });

  // Collision detection
  gameState.enemies = gameState.enemies.filter(enemy => {
    for (let bullet of gameState.bullets) {
      if (detectCollision(bullet, enemy)) {
        gameArea.removeChild(enemy);
        gameArea.removeChild(bullet);
        gameState.bullets.splice(gameState.bullets.indexOf(bullet), 1);
        gameState.score += 10;
        scoreDisplay.textContent = gameState.score;
        return false;
      }
    }
    return true;
  });

  // Level up
  if (gameState.enemies.length === 0) {
    gameState.level += 1;
    spawnEnemies();
  }
}

function gameLoop() {
  if (!gameState.running) return;
  gameState.frame++;
  updateBullets();
  updateEnemies();
  requestAnimationFrame(gameLoop);
}

function movePlayer(e) {
  if (!gameState.running) return;

  if (e.key === "ArrowLeft" && gameState.playerX > 0) {
    gameState.playerX -= 10;
  }
  if (e.key === "ArrowRight" && gameState.playerX < 560) {
    gameState.playerX += 10;
  }
  if (e.key === " ") {
    fireBullet();
  }

  player.style.left = gameState.playerX + "px";
}

function endGame() {
  gameState.running = false;
  gameOverText.style.display = "block";
}

restartBtn.addEventListener("click", initGame);
document.addEventListener("keydown", movePlayer);

initGame();
