import { playerRatio, orbitRatio } from "./constants.js";
import { hideLevelUpOptions } from "./ui.js";
import { getBulletDirection, getBulletHit, getBulletSpeed, getBulletWidth, getEnemies, getLevel, getLife, getOrbitRadius, getOrbits, getOrbitSpeed, getOrbitWidth, getPlayer, getScore, getShootTime, setBulletDirection, setBulletHit, setBulletSpeed, setBulletWidth, setEnemies, setIsPaused, setLife, setOrbits, setOrbitSpeed, setPlayer, setScore, setShootTime, setStopZombies } from "./properties.js";
import { setIntervals } from "./loop.js";

const allSkills = [
    { 
        name: "빠른 재장전", 
        icon: "./assets/skills/quick_reload.png", 
        eng:"fasterShoot",
        dis:"발사 속도가 증가합니다",
        fn: fasterShoot, 
        openLevel: 1 
    },
    {
        name: "커진 총알", 
        icon: "./assets/skills/big_bullet.png", 
        eng:"biggerBullet",
        dis:"총알의 크기가 증가합니다",
        fn: biggerBullet,
        openLevel: 1
    },
    {
        name: "총구 개조", 
        icon: "./assets/skills/modify_muzzle.png", 
        eng:"modifyMuzzle",
        dis:"총알이 나가는 방향이 추가됩니다",
        fn: modifyMuzzle,
        openLevel: 1
    },
    { 
        name: "빨라진 총알",
        icon: "./assets/skills/faster_bullet.png", 
        eng:"fasterBullet", 
        dis:"총알의 이동 속도가 증가합니다", 
        fn: fasterBullet,
        openLevel: 1 
    },
    { 
        name: "정교한 움직임", 
        icon: "./assets/skills/accurate_move.png", 
        eng:"accurateMove", 
        dis:"캐릭터가 작아지고, 이동 속도가 줄어듭니다",
        fn:accurateMove, 
        openLevel: 1
    },
    {
        name: "응급 처치",
        icon: "./assets/skills/medikit.png",
        eng:"medikit",
        dis:"체력이 1 회복됩니다",
        fn: medikit,
        openLevel: 5
    },
    {
        name: "정신 교란",
        icon: "./assets/skills/pause.png",
        eng:"pause",
        dis:"좀비들이 잠시 멈춥니다",
        fn: pause,
        openLevel: 5
    },
    {
        name: "자기장 실드",
        icon: "./assets/skills/orbitShield.png",
        eng:"orbitShield",
        dis:"주위를 떠도는 전자가 추가됩니다.",
        fn: orbitShield,
        openLevel: 1
    },
    {
        name: "자기장 가속",
        icon: "./assets/skills/faster_orbit.png",
        eng:"fasterOrbit",
        dis:"전자가 더 빨리 돕니다",
        fn: fasterOrbit,
        openLevel: 5
    },
    {
        name: "꿰뚫는 총알",
        icon: "./assets/skills/penetrating_bullet.png",
        eng:"penetratingBullet",
        dis:"총알이 좀비를 한 마리 더 뚫고 지나갑니다",
        fn: penetratingBullet,
        openLevel: 10
    },
    {
        name: "완전한 치유",
        icon: "./assets/skills/heal.png",
        eng:"heal",
        dis:"체력이 전부 회복됩니다",
        fn: heal,
        openLevel: 15
    },
    {
        name: "융단 폭격",
        icon: "./assets/skills/bomb_rain.png",
        eng:"bombRain",
        dis:"좀비가 전부 사라집니다",
        fn: bombRain,
        openLevel: 20
    },
];

function selectLevelUpOptions() {
    const shuffled = allSkills.sort(() => 0.5 - Math.random());
    let selected = [];
    let index = 0
    let orbits = getOrbits();
    let level = getLevel();
    while (selected.length<3) {
        let option = shuffled[index];
        index += 1;
        if (level < option.openLevel) {
            continue
        }
        if (level%2==0 && option.eng==="orbitShield") {
            continue
        }
        if (option.eng==="fasterOrbit") {
            if (getOrbitSpeed()>=0.1 || orbits.length===0) {
                continue;
            }
        }
        if (option.eng==="modifyMuzzle" && getBulletDirection()>3) continue;
        if (option.eng==="accurateMove" && getPlayer().width<=16) continue;
        if (option.eng==="orbitShield" && orbits.length>=3) continue;
        selected.push(option);
    }
    return selected;
}

function chooseSkill(skill) {
    skill.fn();
    hideLevelUpOptions();
    setIsPaused(false);
    setIntervals();
}

function fasterShoot() {
    setShootTime(getShootTime() * 0.8);
}

function biggerBullet() {
    setBulletWidth(getBulletWidth() + 3);
}

function modifyMuzzle() {
    setBulletDirection(getBulletDirection() + 1)
}

function fasterBullet() {
    setBulletSpeed(getBulletSpeed() * 1.1);
}

function accurateMove() {
    let player = getPlayer();
    if (player.width>16) {
        player.width -= 6;
        player.height = player.width*playerRatio;
    }
    player.speed -= 0.4;
    setPlayer(player);
}

function pause() {
    setStopZombies(true);
    setTimeout(()=>{
        setStopZombies(false);
    }, 2500)
}

function orbitShield() {
    let orbitRadius = getOrbitRadius();
    let orbitWidth = getOrbitWidth();
    let orbits = getOrbits();
    let count = orbits.length;
    let player = getPlayer();
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
    setOrbits(newOrbits);
}

function fasterOrbit() {
    setOrbitSpeed(getOrbitSpeed() + 0.01);
}

function penetratingBullet() {
    setBulletHit(getBulletHit() + 1);
}

function heal() {
    setLife(3);
}

function medikit() {
    setLife(getLife() + 1 < 4 ? getLife()+1 : 3);
}

function bombRain() {
    setScore(getScore() + getEnemies().length);
    setEnemies([]);
}

export { selectLevelUpOptions, chooseSkill };