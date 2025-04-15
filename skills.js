import { stopZombies } from "./game"

function fasterShoot() {
    shootTime *= 0.9
}

function biggerBullet() {
    bulletWidth += 2
}

function fasterBullet() {
    bulletSpeed *= 1.1
}

function smallerPlayer() {
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