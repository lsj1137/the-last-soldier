const allSkills = [
    { name: "빠른 재장전", icon: "./assets/skills/quick_reload.png", eng:"fasterShoot", dis:"발사 속도가 10% 증가합니다", fn: fasterShoot },
    { name: "커진 총알", icon: "./assets/skills/big_bullet.png", eng:"biggerBullet", dis:"총알의 크기가 2 증가합니다", fn: biggerBullet  },
    { name: "빨라진 총알", icon: "./assets/skills/faster_bullet.png", eng:"fasterBullet", dis:"총알의 이동 속도가 10% 증가합니다", fn: fasterBullet },
    { name: "정교한 움직임", icon: "./assets/skills/accurate_move.png", eng:"accurateMove", dis:"캐릭터가 3만큼 작아지고, 속도가 0.6만큼 줄어듭니다", fn:accurateMove  },
    { name: "꿰뚫는 총알", icon: "./assets/skills/penetrating_bullet.png", eng:"penetratingBullet", dis:"총알이 좀비를 뚫고 지나갑니다", fn: penetratingBullet  },
    { name: "완전한 치유", icon: "./assets/skills/heal.png", eng:"heal", dis:"체력이 전부 회복됩니다", fn: heal  },
    { name: "응급 처치", icon: "./assets/skills/medikit.png", eng:"medikit", dis:"체력이 1 회복됩니다", fn: medikit  },
    { name: "융단 폭격", icon: "./assets/skills/bomb_rain.png", eng:"bombRain", dis:"좀비가 전부 사라집니다", fn: bombRain   },
    { name: "정신 교란", icon: "./assets/skills/pause.png", eng:"pause", dis:"2.5초간 좀비들이 멈춥니다",  }
];

function fasterShoot(shootTime) {
    console.log(shootTime)
    shootTime *= 0.9
    return shootTime
}

function biggerBullet(bulletWidth) {
    console.log(bulletWidth)
    bulletWidth += 2
    return bulletWidth
}

function fasterBullet(bulletSpeed) {
    console.log(bulletSpeed)
    bulletSpeed *= 1.1
    return bulletSpeed
}

function accurateMove(player) {
    console.log(player)
    player.width -= 3
    player.speed -= 0.6
    return player
}

function penetratingBullet(powerBullet) {
    console.log(powerBullet)
    powerBullet = true
    return powerBullet
}

function heal(life) {
    console.log(life)
    life = 3;
    return life
}

function medikit(life) {
    console.log(life)
    life + 1 < 4 ? life += 1 : life = 3;
    return life
}

function bombRain(enemies) {
    console.log(enemies)
    enemies = [];
    return enemies
}

export { allSkills };