import { playerRatio, screenHeight, screenWidth } from "./constants.js";

// 적, 탄환
let enemies = [];
let bullets = [];
let orbits = [];

// 변수
let level = 1;
let levelUpStd = 50;
let levelUpGap = 50;
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
let bulletDirection = 1;
let bulletHit = 1;
let score = 0;
let stopZombies = false;
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
    enemies = [];
    bullets = [];
    orbits = [];
    
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
    bulletDirection = 1;
    score = 0;
    levelUpStd = 50;
    levelUpGap = 50;
    stopZombies = false;
    orbitWidth = 20;
    orbitSpeed = 0.06;
    orbitRadius = playerWidth*1.5;

    // 플레이어
    player = {
        x: screenWidth/2 - playerWidth/2,
        y: screenHeight/2 - playerWidth/2,
        speed: playerSpeed,
        width: playerWidth,
        height: playerWidth*playerRatio
    };
}

function getEnemies () {
    return enemies;
}
function setEnemies (newEnemies) {
    enemies = [...newEnemies];
}

function getBullets () {
    return bullets;
}
function setBullets (newBullets) {
    bullets = [...newBullets];
}

function getOrbits () {
    return orbits;
}
function setOrbits (newOrbits) {
    orbits = [...newOrbits];
}

function getLevel () {
    return level;
}
function setLevel (newLevel) {
    level = newLevel;
}

function getLevelUpStd() {
    return levelUpStd;
}
function setLevelUpStd(newLevelUpStd){
    levelUpStd = newLevelUpStd;
}

function getLevelUpGap() {
    return levelUpGap;
}
function setLevelUpGap(newLevelUpGap){
    levelUpGap = newLevelUpGap;
}

function getIsPaused() {
    return isPaused;
}
function setIsPaused (newIsPaused) {
    isPaused = newIsPaused;
}

function getPlayerSpeed() {
    return playerSpeed;
}
function setPlayerSpeed (newPlayerSpeed) {
    playerSpeed = newPlayerSpeed;
}

function getPlayerWidth() {
    return playerWidth;
}
function setPlayerWidth (newPlayerWidth) {
    playerWidth = newPlayerWidth;
}

function getLife() {
    return life;
}
function setLife (newLife) {
    life = newLife;
}

function getEnemySpawnTime() {
    return enemySpawnTime;
}
function setEnemySpawnTime(newEnemySpawnTime){
    enemySpawnTime = newEnemySpawnTime;
}

function getEnemyWidth () {
    return enemyWidth;
}
function setEnemyWidth (newEnemyWidth) {
    enemyWidth = newEnemyWidth;
}

function getEnemySpeed() {
    return enemySpeed;
}
function setEnemySpeed(newEnemySpeed){
    enemySpeed = newEnemySpeed;
}

function getShootTime () {
    return shootTime;
}
function setShootTime (newShootTime) {
    shootTime = newShootTime;
}

function getBulletWidth() {
    return bulletWidth;
}
function setBulletWidth(newBulletWidth){
    bulletWidth = newBulletWidth;
}

function getBulletSpeed() {
    return bulletSpeed;
}
function setBulletSpeed(newBulletSpeed){
    bulletSpeed = newBulletSpeed;
}

function getBulletDirection() {
    return bulletDirection;
}
function setBulletDirection(newBulletDirection){
    bulletDirection = newBulletDirection;
}

function getBulletHit() {
    return bulletHit;
}
function setBulletHit(newBulletHit){
    bulletHit = newBulletHit;
}

function getScore(){
    return score;
}
function setScore(newScore){
    score = newScore;
}

function getStopZombies() {
    return stopZombies;
}
function setStopZombies(newStopZombies){
    stopZombies = newStopZombies;
}

function getOrbitWidth() {
    return orbitWidth;
}
function setOrbitWidth (newOrbitWidth) {
    orbitWidth = newOrbitWidth;
}

function getOrbitSpeed () {
    return orbitSpeed;
}
function setOrbitSpeed (newOrbitSpeed) {
    orbitSpeed = newOrbitSpeed;
}

function getOrbitRadius() {
    return orbitRadius;
}
function setOrbitRadius(newOrbitRadius){
    orbitRadius = newOrbitRadius;
}

function getPlayer(){
    return player;
}
function setPlayer (newPlayer) {
    player = {...newPlayer};
}

export {
    initValues,
    getEnemies,
    getBullets,
    getOrbits,
    getLevel,
    getLevelUpStd,
    getLevelUpGap,
    getIsPaused,
    getPlayerSpeed,
    getPlayerWidth,
    getLife,
    getEnemySpawnTime,
    getEnemyWidth,
    getEnemySpeed,
    getShootTime,
    getBulletWidth,
    getBulletSpeed,
    getBulletDirection,
    getBulletHit,
    getScore,
    getStopZombies,
    getOrbitWidth,
    getOrbitSpeed,
    getOrbitRadius,
    getPlayer,
    setEnemies,
    setBullets,
    setOrbits,
    setLevel,
    setLevelUpStd,
    setLevelUpGap,
    setIsPaused,
    setPlayerSpeed,
    setPlayerWidth,
    setLife,
    setEnemySpawnTime,
    setEnemyWidth,
    setEnemySpeed,
    setShootTime,
    setBulletWidth,
    setBulletSpeed,
    setBulletDirection,
    setBulletHit,
    setScore,
    setStopZombies,
    setOrbitWidth,
    setOrbitSpeed,
    setOrbitRadius,
    setPlayer
};