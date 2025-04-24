import { playerRatio, orbitRatio } from "./game.js";

const allSkills = [
    { name: "빠른 재장전", icon: "./assets/skills/quick_reload.png", eng:"fasterShoot", dis:"발사 속도가 증가합니다", fn: fasterShoot, openLevel: 1 },
    { name: "커진 총알", icon: "./assets/skills/big_bullet.png", eng:"biggerBullet", dis:"총알의 크기가 증가합니다", fn: biggerBullet, openLevel: 1 },
    { name: "빨라진 총알", icon: "./assets/skills/faster_bullet.png", eng:"fasterBullet", dis:"총알의 이동 속도가 증가합니다", fn: fasterBullet, openLevel: 1 },
    { name: "정교한 움직임", icon: "./assets/skills/accurate_move.png", eng:"accurateMove", dis:"캐릭터가 작아지고, 이동 속도가 줄어듭니다", fn:accurateMove, openLevel: 1 },
    { name: "응급 처치", icon: "./assets/skills/medikit.png", eng:"medikit", dis:"체력이 1 회복됩니다", fn: medikit, openLevel: 5 },
    { name: "정신 교란", icon: "./assets/skills/pause.png", eng:"pause", dis:"좀비들이 잠시 멈춥니다", openLevel: 5 },
    { name: "자기장 실드", icon: "./assets/skills/orbitShield.png", eng:"orbitShield", dis:"주위를 떠도는 전자가 추가됩니다.", fn: orbitShield, openLevel: 1},
    { name: "꿰뚫는 총알", icon: "./assets/skills/penetrating_bullet.png", eng:"penetratingBullet", dis:"총알이 좀비를 한 마리 더 뚫고 지나갑니다", fn: penetratingBullet, openLevel: 10 },
    { name: "완전한 치유", icon: "./assets/skills/heal.png", eng:"heal", dis:"체력이 전부 회복됩니다", fn: heal, openLevel: 15 },
    { name: "융단 폭격", icon: "./assets/skills/bomb_rain.png", eng:"bombRain", dis:"좀비가 전부 사라집니다", fn: bombRain, openLevel: 20 },
];

function fasterShoot(shootTime) {
    shootTime *= 0.9;
    return shootTime;
}

function biggerBullet(bulletWidth) {
    bulletWidth += 2;
    return bulletWidth;
}

function fasterBullet(bulletSpeed) {
    bulletSpeed *= 1.1;
    return bulletSpeed;
}

function accurateMove(player) {
    if (player.width>16) {
        player.width -= 4;
        player.height = player.width*playerRatio;
    }
    player.speed -= 0.6;
    return player;
}

function orbitShield(player, orbits) {
    let orbitRadius = 40;
    let orbitWidth = 20;
    let count = orbits.length;
    let betweenAngle = 0;
    betweenAngle = 2 * Math.PI / (count + 1);
    let newOrbits = [];
    for (let i=0; i<count+1; i++) {
        newOrbits.push({
            x: player.x + player.width/2 + orbitRadius,
            y: player.y + player.width/2 + orbitRadius,
            angle: betweenAngle * i,
            width: orbitWidth,
            height: orbitWidth*orbitRatio
        })
    }
    return newOrbits
}

function penetratingBullet(bulletHit) {
    return bulletHit+1;
}

function heal(life) {
    life = 3;
    return life;
}

function medikit(life) {
    life + 1 < 4 ? life += 1 : life = 3;
    return life;
}

function bombRain(enemies) {
    enemies = [];   
    return enemies;
}

export { allSkills };