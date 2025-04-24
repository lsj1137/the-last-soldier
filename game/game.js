import { allSkills } from "./skills.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const backgroundImage = new Image();
backgroundImage.src = "./assets/background.png";
const playerImage = new Image();
playerImage.src = "./assets/character.png"
const enemyImage = new Image();
enemyImage.src = "./assets/zombie.png"
const bulletImage = new Image();
bulletImage.src = "./assets/bullet.png"
const heartImage = new Image();
heartImage.src = "./assets/heart_filled.png"
const heartBlackImage = new Image();
heartBlackImage.src = "./assets/heart_not_filled.png"

const screenWidth = 1000;
const screenHeight = 700;

let mouseX = 0;
let mouseY = 0;

const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);
canvas.addEventListener("mousemove", function (event) {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
});

// 적, 탄환
let enemies = [];
let spawnInterval = null;
let bullets = [];
let shootInterval = null;

// 변수
let level = 1;
let isPaused = false;
let playerSpeed = 6;
let playerWidth = 40;
let life = 3;
let enemySpawnTime = 2000;
let enemyWidth = 32;
let enemySpeed = 1;
let shootTime = 1200;
let bulletWidth = 12;
let bulletSpeed = 5;
let bulletHit = 1;
let score = 0;
let levelUpStd = 50;
let levelUpGap = 50;
export let stopZombies = false;

let player = {
    x: screenWidth/2 - playerWidth/2,
    y: screenHeight/2 - playerWidth/2,
    speed: playerSpeed,
    width: playerWidth
};

function initValues() {
    // 적, 탄환
    enemies = [];
    bullets = [];
    
    // 변수
    level = 1;
    isPaused = false;
    life = 3;
    enemySpawnTime = 2000;
    enemyWidth = 32;
    shootTime = 1200;
    bulletWidth = 12;
    bulletSpeed = 5;
    bulletHit = 1;
    score = 0;
    levelUpStd = 50;
    levelUpGap = 50;

    // 플레이어
    player.x = screenWidth/2 - playerWidth/2,
    player.y = screenHeight/2 - playerWidth/2,
    player.speed = playerSpeed,
    player.width = playerWidth
}

function spawnEnemy() {
    let enemyX = Math.random() * screenWidth
    let enemyY = Math.random() * screenHeight
    while (enemyX > player.x - playerWidth 
        && enemyX < player.x + playerWidth * 2 
        && enemyY > player.y - playerWidth
        && enemyY < player.y + playerWidth * 2) {
        enemyX = Math.random() * screenWidth
        enemyY = Math.random() * screenHeight
    }
    let dx = player.x - enemyX;
    let dy = player.y - enemyY;
    enemies.push({ x: enemyX, y: enemyY, dx: dx, dy: dy, width: enemyWidth });
}

function shoot() {
    let dx = mouseX - (player.x + playerWidth/2);
    let dy = mouseY - (player.y + playerWidth/2);
    bullets.push({ x: player.x+playerWidth/2-bulletWidth/2, y: player.y+playerWidth/2-bulletWidth/2, dx: dx, dy: dy, width: bulletWidth, hit: bulletHit});
}

function isColliding(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.width &&
        a.y + a.width > b.y
    );
}

function checkCollisions() {
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
    for (let j = enemies.length - 1; j >= 0; j--) {
        const enemy = enemies[j];
        if (isColliding(player, enemy)) {
            enemies.splice(j, 1);
            life -= 1;
            if (life == 0) {
                gameOver()
            }
            break;
        }
    } 
}

function update() {
    if (keys["w"] || keys["ㅈ"] || keys["ArrowUp"]) player.y - player.speed > 0 ? player.y -= player.speed : 0;
    if (keys["s"] || keys["ㄴ"] || keys["ArrowDown"]) player.y + player.speed < screenHeight - playerWidth ? player.y += player.speed : screenHeight - playerWidth;
    if (keys["a"] || keys["ㅁ"] || keys["ArrowLeft"]) player.x - player.speed > 0 ? player.x -= player.speed : 0;
    if (keys["d"] || keys["ㄹ"] || keys["ArrowRight"]) player.x + player.speed < screenWidth - playerWidth ? player.x += player.speed : screenWidth - playerWidth;
    for (let bullet of bullets) {
        let ratio = (bullet.dx**2 + bullet.dy**2) ** 0.5 / bulletSpeed
        bullet.x += bullet.dx / ratio
        bullet.y += bullet.dy / ratio
    }
    if (!stopZombies) {
        for (let enemy of enemies) {
            let ratio = (enemy.dx**2 + enemy.dy**2) ** 0.5
            enemy.x += enemy.dx / ratio * enemySpeed
            enemy.y += enemy.dy / ratio * enemySpeed
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    // 점수
    ctx.fillStyle = "black";
    // 플레이어
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.width*1.4);
    // 총알
    for (let bullet of bullets) {
        ctx.drawImage(bulletImage, bullet.x, bullet.y, bullet.width, bullet.width*1.2);
    }
    // 적
    for (let enemy of enemies) {
        ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.width*1.5);
    }
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.fillText("Level: " + level, 10, 30);
    ctx.fillText("Score: " + score, 10, 55);
    ctx.fillText("Next Level Up: " + levelUpStd, 10, 80);
    for (let i = 0; i<3; i++) {
        if (life<i+1) {
            ctx.drawImage(heartBlackImage, screenWidth - 70 - i*40, screenHeight - 70, 30, 30)
        } else {
            ctx.drawImage(heartImage, screenWidth - 70 - i*40, screenHeight - 70, 30, 30)
        }
    }
}

function gc() {
    bullets = bullets.filter(b => b.x >= 0 && b.x <= canvas.width && b.y >= 0 && b.y <= canvas.height);
    enemies = enemies.filter(b => b.x >= 0 && b.x <= canvas.width && b.y >= 0 && b.y <= canvas.height);
}

function levelUp() {
    isPaused = true;
    clearIntervals();
    level += 1;
    levelUpGap += 10;
    levelUpStd += levelUpGap;
    enemyUpgrade();
    showLevelUpChoices();
}

function enemyUpgrade() {
    if (enemyWidth > 14) {
        enemyWidth -= 2;
    }
    if (enemySpawnTime > 200) {
        enemySpawnTime -= 200;
    } else if (level>30 && enemySpawnTime > 150) {
        enemySpawnTime -= 10;
    }
    if (level%2==0 && enemySpeed < 2.5) {
        enemySpeed += 0.1
    }
}

function showLevelUpChoices() {
    const shuffled = allSkills.sort(() => 0.5 - Math.random());
    let selected = [];
    let index = 0
    while (selected.length<3) {
        let option = shuffled[index];
        index += 1;
        if (level >= option.openLevel) {
            selected.push(option);
        }
    }
    const wrapper = document.getElementById("skillCards");
    wrapper.innerHTML = "";
    selected.forEach(skill => {
        const card = document.createElement("div");
        card.className = "skill-card";
        card.innerHTML = `
            <img class="skill-icon" src="${skill.icon}" width="64" height="64" /><br />
            <p class="skill-dis">${skill.dis}</p>
            <strong class="skill-name">${skill.name}</strong>
        `;
        card.onclick = () => chooseSkill(skill);
        wrapper.appendChild(card);
    });

    document.getElementById("levelUpUI").style.display = "block";
}

function chooseSkill(skill) {
    switch (skill.eng) {
        case 'fasterShoot':
            shootTime = skill.fn(shootTime)
            break
        case 'biggerBullet':
            bulletWidth = skill.fn(bulletWidth)
            break
        case 'fasterBullet':
            bulletSpeed = skill.fn(bulletSpeed)
            break
        case 'accurateMove':
            player = skill.fn(player)
            break
        case 'penetratingBullet':
            bulletHit = skill.fn(bulletHit)
            break
        case 'heal':
            life = skill.fn(life)
            break
        case 'medikit':
            life = skill.fn(life)
            break
        case 'bombRain':
            enemies = skill.fn(enemies)
            break
        case 'pause':        
            stopZombies = true;
            setTimeout(()=>{
                stopZombies = false;
            }, 2500)
            break
    }

    document.getElementById("levelUpUI").style.display = "none";
    isPaused = false;
    setIntervals()
}

function gameLoop() {
    if (!isPaused) {
        update();
        checkCollisions();
        draw();
        gc();
    }
    requestAnimationFrame(gameLoop);
}

function setIntervals() {
    spawnInterval = setInterval(spawnEnemy, enemySpawnTime);
    shootInterval = setInterval(shoot, shootTime);
}

function clearIntervals() {
    clearInterval(spawnInterval);
    clearInterval(shootInterval);
}

function gameOver() {
    isPaused = true;
    clearIntervals();
    showGameOverScreen()
}

function showGameOverScreen() {
    document.getElementById("finalScore").textContent += score.toString();
    document.getElementById("gameOverUI").style.display = "flex";
}

function restart() {
    initValues();
    document.getElementById("finalScore").textContent = "최종 점수 : ";
    document.getElementById("gameOverUI").style.display = "none";
    isPaused = false;
    setIntervals()
}

window.restart = restart
gameLoop();
setIntervals();
