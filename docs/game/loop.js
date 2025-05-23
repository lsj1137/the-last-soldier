import { initValues, getEnemies, getBullets, getOrbits, getLevel, getLevelUpStd, getLevelUpGap, getIsPaused, getPlayerWidth, getLife, getEnemySpawnTime, getEnemySpeed, getShootTime, getBulletSpeed, getScore, getStopZombies, getOrbitWidth, getOrbitSpeed, getOrbitRadius, getPlayer, setEnemies, setBullets, setOrbits, setLevel, setLevelUpStd, setLevelUpGap, setIsPaused, setLife, setScore
} from "./properties.js";
import { backgroundImage, playerImage, enemyImage, bulletImage, heartImage, heartBlackImage, orbitImage } from "./images.js"
import { screenWidth, screenHeight } from "./constants.js";
import { enemyUpgrade, spawnEnemy } from "./enemy.js";
import { showGameOverScreen, showLevelUpOptions, submitScore } from "./ui.js";
import { movePlayer, setKeyEvents, shoot } from "./player.js";

export const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let spawnInterval = null;
let shootInterval = null;

function isColliding(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

function checkCollisions() {
    let bullets = getBullets();
    let enemies = getEnemies();
    let orbits = getOrbits();
    let player = getPlayer();
    const levelUpStd = getLevelUpStd();
    let score = getScore();
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            if (isColliding(bullet, enemy)) {
                enemies.splice(j, 1);
                bullet.hit -= 1;
                if (bullet.hit===0) {
                    bullets.splice(i, 1);
                }
                score += 10;
                if (score >= levelUpStd) {
                    levelUp()
                }
                break;
            }
        } 
    }
    for (let i = orbits.length - 1; i >= 0; i--) {
        const orbit = orbits[i];
        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            if (isColliding(orbit, enemy)) {
                enemies.splice(j, 1);
                score += 10;
                if (score >= levelUpStd) {
                    levelUp()
                }
                break;
            }
        }
    }
    for (let j = enemies.length - 1; j >= 0; j--) {
        const enemy = enemies[j];
        if (isColliding(player, enemy)) {
            enemies.splice(j, 1);
            setLife(getLife()-1);
            if (getLife() === 0) {
                gameOver()
            }
            break;
        }
    }
    setScore(score);
}

function update() {
    let player = getPlayer();
    let playerWidth = getPlayerWidth();
    let bulletSpeed = getBulletSpeed();
    let bullets = getBullets();
    let enemies = getEnemies();
    let orbits = getOrbits();
    let enemySpeed = getEnemySpeed();
    let orbitSpeed = getOrbitSpeed();
    let orbitRadius = getOrbitRadius();
    movePlayer();
    bullets.forEach(bullet => {
        let ratio = (bullet.dx**2 + bullet.dy**2) ** 0.5 / bulletSpeed
        bullet.x += bullet.dx / ratio
        bullet.y += bullet.dy / ratio
    })
    if (!getStopZombies()) {
        enemies.forEach(enemy => {
            let ratio = (enemy.dx**2 + enemy.dy**2) ** 0.5
            enemy.x += enemy.dx / ratio * enemySpeed
            enemy.y += enemy.dy / ratio * enemySpeed
        })
    }
    orbits.forEach(orbit => {
        orbit.angle += orbitSpeed;
        orbit.x = player.x + playerWidth/2  + orbitRadius * Math.cos(orbit.angle);
        orbit.y = player.y + playerWidth/2  + orbitRadius * Math.sin(orbit.angle);
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    // 점수
    ctx.fillStyle = "black";
    // 플레이어
    let player = getPlayer();
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
    // 총알
    let bullets = getBullets();
    bullets.forEach(bullet => {
        ctx.drawImage(bulletImage, bullet.x, bullet.y, bullet.width, bullet.height);
    });
    // 적
    let enemies = getEnemies();
    enemies.forEach(enemy => {
        ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
    });
    let orbits = getOrbits();
    let orbitWidth = getOrbitWidth();
    orbits.forEach(orbit => {
        ctx.drawImage(orbitImage, orbit.x - orbitWidth/2, orbit.y - orbitWidth/2, orbit.width, orbit.height);
    });
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.fillText("Level: " + getLevel(), 10, 30);
    ctx.fillText("Score: " + getScore(), 10, 55);
    ctx.fillText("Next Level Up: " + getLevelUpStd(), 10, 80);
    for (let i = 0; i<3; i++) {
        if (getLife()<i+1) {
            ctx.drawImage(heartBlackImage, screenWidth - 70 - i*40, screenHeight - 70, 30, 30)
        } else {
            ctx.drawImage(heartImage, screenWidth - 70 - i*40, screenHeight - 70, 30, 30)
        }
    }
}

function gc() {
    setBullets(getBullets().filter(b => b.x >= 0 && b.x <= canvas.width && b.y >= 0 && b.y <= canvas.height));
    setEnemies(getEnemies().filter(b => b.x >= 0 && b.x <= canvas.width && b.y >= 0 && b.y <= canvas.height));
}

function levelUp() {
    setIsPaused(true);
    clearIntervals();
    setLevel(getLevel()+1);
    setLevelUpGap(getLevelUpGap()+10*getLevel()/2);
    setLevelUpStd(getLevelUpStd()+getLevelUpGap());
    enemyUpgrade();
    showLevelUpOptions();
}

function gameLoop() {
    if (!getIsPaused()) {
        update();
        checkCollisions();
        draw();
        gc();
    }
    requestAnimationFrame(gameLoop);
}

export function setIntervals() {
    spawnInterval = setInterval(spawnEnemy, getEnemySpawnTime());
    shootInterval = setInterval(shoot, getShootTime());
}

function clearIntervals() {
    clearInterval(spawnInterval);
    clearInterval(shootInterval);
}

function gameOver() {
    setIsPaused(true);
    clearIntervals();
    showGameOverScreen()
}

function restart() {
    initValues();
    document.getElementById("finalScore").textContent = "최종 점수 : ";
    document.getElementById("gameOverUI").style.display = "none";
    setIsPaused(false);
    setIntervals()
}

window.restart = restart
window.submitScore = submitScore
setKeyEvents();
gameLoop();
setIntervals();