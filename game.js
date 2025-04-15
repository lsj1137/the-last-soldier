// import { fasterShoot, biggerBullet, bombRain, fasterBullet, heal, medikit, penetratingBullet, smallerPlayer } from "./skills";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const backgroundImage = new Image();
backgroundImage.src = "assets/background.png";
const playerImage = new Image();
playerImage.src = "assets/character.png"
const enemyImage = new Image();
enemyImage.src = "assets/zombie.png"
const bulletImage = new Image();
bulletImage.src = "assets/bullet.png"
const heartImage = new Image();
heartImage.src = "assets/heart_filled.png"
const heartBlackImage = new Image();
heartBlackImage.src = "assets/heart_not_filled.png"

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
let shootTime = 1200;
let bulletWidth = 12;
let bulletSpeed = 5;
let score = 0;
let levelUpStd = 50;
let levelUpGap = 50;
let powerBullet = false;
let stopZombies = false;

let player = {
    x: screenWidth/2 - playerWidth/2,
    y: screenHeight/2 - playerWidth/2,
    speed: playerSpeed,
    width: playerWidth
};

const allSkills = [
    { name: "빠른 재장전", icon: "assets/skills/quick_reload.png", eng:"fasterShoot", dis:"발사 속도가 10% 증가합니다" },
    { name: "커진 총알", icon: "assets/skills/big_bullet.png", eng:"biggerBullet", dis:"총알의 크기가 2 증가합니다"  },
    { name: "빨라진 총알", icon: "assets/skills/faster_bullet.png", eng:"fasterBullet", dis:"총알의 이동 속도가 10% 증가합니다"  },
    { name: "정교한 움직임", icon: "assets/skills/accurate_move.png", eng:"accurateMove", dis:"캐릭터가 3만큼 작아지고, 속도가 0.6만큼 줄어듭니다"  },
    { name: "꿰뚫는 총알", icon: "assets/skills/penetrating_bullet.png", eng:"penetratingBullet", dis:"총알이 좀비를 뚫고 지나갑니다"  },
    { name: "완전한 치유", icon: "assets/skills/heal.png", eng:"heal", dis:"체력이 전부 회복됩니다"  },
    { name: "응급 처치", icon: "assets/skills/medikit.png", eng:"medikit", dis:"체력이 1 회복됩니다"  },
    { name: "융단 폭격", icon: "assets/skills/bomb_rain.png", eng:"bombRain", dis:"좀비가 전부 사라집니다"  },
    { name: "정신 교란", icon: "assets/skills/pause.png", eng:"pause", dis:"2.5초간 좀비들이 멈춥니다"  }
];

function fasterShoot() {
    shootTime *= 0.9
}

function biggerBullet() {
    bulletWidth += 2
}

function fasterBullet() {
    bulletSpeed *= 1.1
}

function accurateMove() {
    player.width -= 3
    player.speed -= 0.6
}

function penetratingBullet() {
    powerBullet = true
}

function heal() {
    life = 3;
}

function medikit() {
    life + 1 < 4 ? life += 1 : life = 3;
}

function bombRain() {
    enemies = [];
}

function pause() {
    stopZombies = true;
    setTimeout(()=>{
        stopZombies = false;
    }, 2500)
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
    bullets.push({ x: player.x+playerWidth/2-bulletWidth/2, y: player.y+playerWidth/2-bulletWidth/2, dx: dx, dy: dy, width: bulletWidth});
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
                if (!powerBullet) {
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
    if (keys["w"]) player.y - player.speed > 0 ? player.y -= player.speed : 0;
    if (keys["s"]) player.y + player.speed < screenHeight - playerWidth ? player.y += player.speed : screenHeight - playerWidth;
    if (keys["a"]) player.x - player.speed > 0 ? player.x -= player.speed : 0;
    if (keys["d"]) player.x + player.speed < screenWidth - playerWidth ? player.x += player.speed : screenWidth - playerWidth;
    for (bullet of bullets) {
        let ratio = (bullet.dx**2 + bullet.dy**2) ** 0.5 / bulletSpeed
        bullet.x += bullet.dx / ratio
        bullet.y += bullet.dy / ratio
    }
    if (!stopZombies) {
        for (enemy of enemies) {
            let ratio = (enemy.dx**2 + enemy.dy**2) ** 0.5
            enemy.x += enemy.dx / ratio
            enemy.y += enemy.dy / ratio
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
    for (bullet of bullets) {
        ctx.drawImage(bulletImage, bullet.x, bullet.y, bullet.width, bullet.width*1.2);
    }
    // 적
    for (enemy of enemies) {
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
    isLevelUp = true;
    clearIntervals();
    level += 1;
    levelUpGap += 10;
    levelUpStd += levelUpGap;
    if (enemyWidth > 10) {
        enemyWidth -= 2;
    }
    if (enemySpawnTime > 200) {
        enemySpawnTime -= 200;
    }
    showLevelUpChoices();
}

function showLevelUpChoices() {
    const shuffled = allSkills.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
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
        card.onclick = () => chooseSkill(skill.eng);
        wrapper.appendChild(card);
    });

    document.getElementById("levelUpUI").style.display = "block";
}

function chooseSkill(skillName) {
    switch (skillName) {
        case 'fasterShoot':
            fasterShoot()
            break
        case 'biggerBullet':
            biggerBullet()
            break
        case 'fasterBullet':
            fasterBullet()
            break
        case 'smallerPlayer':
            accurateMove()
            break
        case 'penetratingBullet':
            penetratingBullet()
            break
        case 'heal':
            heal()
            break
        case 'medikit':
            medikit()
            break
        case 'bombRain':
            bombRain()
            break
        case 'pause':
            pause()
            break
    }

    document.getElementById("levelUpUI").style.display = "none";
    isPaused = false;
    isLevelUp = false;
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
    isLevelUp = true;
    clearIntervals();
    showGameOverScreen()
}

function showGameOverScreen() {
    document.getElementById("finalScore").textContent += score.toString();
    document.getElementById("gameOverUI").style.display = "flex";
}

function restart() {
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
    score = 0;
    levelUpStd = 50;
    levelUpGap = 50;
    powerBullet = false;

    // 플레이어
    player.x = screenWidth/2 - playerWidth/2,
    player.y = screenHeight/2 - playerWidth/2,
    player.speed = playerSpeed,
    player.width = playerWidth

    document.getElementById("finalScore").textContent = "최종 점수 : ";
    document.getElementById("gameOverUI").style.display = "none";
    isPaused = false;
    isLevelUp = false;
    setIntervals()
}

gameLoop();
setIntervals();