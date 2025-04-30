import { screenWidth, screenHeight, enemyRatio } from "./constants.js";
import { getPlayer, getPlayerWidth, getEnemies, getEnemyWidth, setEnemies, getEnemySpawnTime, getLevel, setEnemySpawnTime, getEnemySpeed, setEnemySpeed, setEnemyWidth } from "./properties.js";

function spawnEnemy() {
    let player = getPlayer();
    let playerWidth = getPlayerWidth();
    let enemyX = Math.random() * screenWidth
    let enemyY = Math.random() * screenHeight
    while (enemyX > player.x - playerWidth*2 
        && enemyX < player.x + playerWidth*3 
        && enemyY > player.y - playerWidth*2
        && enemyY < player.y + playerWidth*3) {
        enemyX = Math.random() * screenWidth
        enemyY = Math.random() * screenHeight
    }
    let dx = player.x - enemyX;
    let dy = player.y - enemyY;
    let enemies = getEnemies();
    let enemyWidth = getEnemyWidth();
    enemies.push({ x: enemyX, y: enemyY, dx: dx, dy: dy, width: enemyWidth, height: enemyWidth*enemyRatio });
    setEnemies(enemies);
}

function enemyUpgrade() {
    let enemyWidth = getEnemyWidth();
    let enemySpawnTime = getEnemySpawnTime();
    let level = getLevel();
    let enemySpeed = getEnemySpeed();
    if (enemyWidth > 20) {
        setEnemyWidth(enemyWidth - 2);
    }
    if (enemySpawnTime > 200) {
        setEnemySpawnTime(enemySpawnTime - 200);
    } else if (level>20 && enemySpawnTime > 20) {
        setEnemySpawnTime(enemySpawnTime - 20);
    }
    if (level%2==0 && enemySpeed < 2.5) {
        setEnemySpeed(enemySpeed + 0.1);
    }
}

export { spawnEnemy, enemyUpgrade }