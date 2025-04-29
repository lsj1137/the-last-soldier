import { bulletRatio, screenHeight, screenWidth } from "./constants.js";
import { canvas } from "./loop.js";
import { getBulletHit, getBullets, getBulletWidth, getPlayer, getPlayerWidth, setBullets } from "./properties.js";

let mouseX = 0;
let mouseY = 0;

const keys = {};

function setKeyEvents() {
    document.addEventListener("keydown", e => keys[e.key] = true);
    document.addEventListener("keyup", e => keys[e.key] = false);
    canvas.addEventListener("mousemove", function (event) {
        const rect = canvas.getBoundingClientRect();
        mouseX = event.clientX - rect.left;
        mouseY = event.clientY - rect.top;
    });
}

function movePlayer() {
    let player = getPlayer();
    let playerWidth = getPlayerWidth();
    if (keys["w"] || keys["ㅈ"] || keys["ArrowUp"]) player.y - player.speed > 0 ? player.y -= player.speed : 0;
    if (keys["s"] || keys["ㄴ"] || keys["ArrowDown"]) player.y + player.speed < screenHeight - playerWidth ? player.y += player.speed : screenHeight - playerWidth;
    if (keys["a"] || keys["ㅁ"] || keys["ArrowLeft"]) player.x - player.speed > 0 ? player.x -= player.speed : 0;
    if (keys["d"] || keys["ㄹ"] || keys["ArrowRight"]) player.x + player.speed < screenWidth - playerWidth ? player.x += player.speed : screenWidth - playerWidth;
}

function shoot() {
    let playerWidth = getPlayerWidth();
    let bulletWidth = getBulletWidth();
    let bulletHit = getBulletHit();
    let player = getPlayer();
    let bullets = getBullets();
    let dx = mouseX - (player.x + playerWidth/2);
    let dy = mouseY - (player.y + playerWidth/2);
    bullets.push({ x: player.x+playerWidth/2-bulletWidth/2, y: player.y+playerWidth/2-bulletWidth/2, dx: dx, dy: dy, width: bulletWidth, height: bulletWidth*bulletRatio, hit: bulletHit});
    setBullets(bullets);
}

export { movePlayer, setKeyEvents, shoot }