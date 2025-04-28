import { allSkills } from "./skills.js";

const BASE_URL = "https://3jun.store"

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
const orbitImage = new Image();
orbitImage.src = "./assets/orbit.png"


const screenWidth = 1000;
const screenHeight = 700;
export const playerRatio = 429/305;
const enemyRatio = 427/289;
export const bulletRatio = 405/305;
export const orbitRatio = 319/284;

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
let orbits = [];

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
let orbitWidth = 20;
let orbitSpeed = 0.06;
let orbitRadius = playerWidth*1.5;

let player = {
    x: screenWidth/2 - playerWidth/2,
    y: screenHeight/2 - playerWidth/2,
    speed: playerSpeed,
    width: playerWidth,
    height: playerWidth*playerRatio
};

function initValues() {
    // 적, 탄환
    enemies = [];
    bullets = [];
    orbits = [];
    
    // 변수
    level = 1;
    isPaused = false;
    playerSpeed = 6;
    playerWidth = 40;
    life = 3;
    enemySpawnTime = 2000;
    enemyWidth = 32;
    enemySpeed = 1;
    shootTime = 1200;
    bulletWidth = 12;
    bulletSpeed = 5;
    bulletHit = 1;
    score = 0;
    levelUpStd = 50;
    levelUpGap = 50;
    stopZombies = false;
    orbitWidth = 20;
    orbitSpeed = 0.06;
    orbitRadius = playerWidth*1.5;

    // 플레이어
    player.x = screenWidth/2 - playerWidth/2,
    player.y = screenHeight/2 - playerWidth/2,
    player.speed = playerSpeed,
    player.width = playerWidth
    player.height = playerWidth*playerRatio
}

function spawnEnemy() {
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
    enemies.push({ x: enemyX, y: enemyY, dx: dx, dy: dy, width: enemyWidth, height: enemyWidth*enemyRatio });
}

function shoot() {
    let dx = mouseX - (player.x + playerWidth/2);
    let dy = mouseY - (player.y + playerWidth/2);
    bullets.push({ x: player.x+playerWidth/2-bulletWidth/2, y: player.y+playerWidth/2-bulletWidth/2, dx: dx, dy: dy, width: bulletWidth, height: bulletWidth*bulletRatio, hit: bulletHit});
}

function isColliding(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
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
    bullets.forEach(bullet => {
        let ratio = (bullet.dx**2 + bullet.dy**2) ** 0.5 / bulletSpeed
        bullet.x += bullet.dx / ratio
        bullet.y += bullet.dy / ratio
    })
    if (!stopZombies) {
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
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
    // 총알
    bullets.forEach(bullet => {
        ctx.drawImage(bulletImage, bullet.x, bullet.y, bullet.width, bullet.height);
    });
    // 적
    enemies.forEach(enemy => {
        ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
    });
    orbits.forEach(orbit => {
        ctx.drawImage(orbitImage, orbit.x - orbitWidth/2, orbit.y - orbitWidth/2, orbit.width, orbit.height);
    });
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
    showLevelUpOptions();
}

function enemyUpgrade() {
    if (enemyWidth > 20) {
        enemyWidth -= 2;
    }
    if (enemySpawnTime > 200) {
        enemySpawnTime -= 200;
    } else if (level>20 && enemySpawnTime > 20) {
        enemySpawnTime -= 20;
    }
    if (level%2==0 && enemySpeed < 2.5) {
        enemySpeed += 0.1
    }
}

function selectLevelUpOptions() {
    const shuffled = allSkills.sort(() => 0.5 - Math.random());
    let selected = [];
    let index = 0
    while (selected.length<3) {
        let option = shuffled[index];
        index += 1;
        if (level < option.openLevel) {
            continue
        }
        if (level%2==0 && option.eng==="orbitShield") {
            continue
        }
        if (option.eng==="accurateMove" && player.width<=16) {
            continue
        }
        if (option.eng==="orbitShield" && orbits.length>=3) {
            continue
        }
        selected.push(option);
    }
    return selected;
}

function showLevelUpOptions() {
    let selected = selectLevelUpOptions();
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
        case 'orbitShield':
            orbits = skill.fn(player, orbits);
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
    getScores();
    document.getElementById("gameOverUI").style.display = "flex";
}

function getScores() {
    const wrapper = document.getElementById("scores");
    wrapper.innerHTML = "";
    // 점수 불러오기
    const response = fetch(`${BASE_URL}/scoreboard`)
    .then(response => response.json())
    .then((scores)=>{
        console.log(scores);
        scores.forEach((score, index) => {
            const row = document.createElement("li");
            row.className = "rank-row";
            row.innerHTML = `
                <p class="ranking">${index+1}</p>
                <p class="name">${score.name}</p>
                <p class="score">${score.score}</p>
            `;
            wrapper.appendChild(row);
        })}
    );
}

function restart() {
    initValues();
    document.getElementById("finalScore").textContent = "최종 점수 : ";
    document.getElementById("gameOverUI").style.display = "none";
    isPaused = false;
    setIntervals()
}

function submitScore(event) {
    event.preventDefault();
    const name = document.getElementById("nameInput").value;
    const body = {name, score};
    const response = fetch(`${BASE_URL}/new-score`, {
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        method:"post",
    }).then(response => response.json()).then(()=>getScores());
}

window.restart = restart
window.submitScore = submitScore
gameLoop();
setIntervals();
