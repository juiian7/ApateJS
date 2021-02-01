import {
    apate
} from "../../src/apate.js";
import Entity from "../../src/entity.js";
import SpriteMgr from "../../src/utility/spriteMgr.js";
import { enemySystem } from "./enemySystem.js";
import { destroyedEnemy } from "./main.js";

let spriteMgr = new SpriteMgr();

export var bulletSystem = new Entity();
bulletSystem.priority = 0;

bulletSystem.loadAttributes({
    bullets: [],
    speed: 0.5
});

bulletSystem.on('init', async () => {
    bulletSystem.bulletSprite = spriteMgr.imgToSprite(await spriteMgr.loadImgFromUrl('./images/bullet.png'));
    bulletSystem.bulletSprite = colorSprite(bulletSystem.bulletSprite, 0, 255, 0);
});

bulletSystem.on('update', (delta) => {
    for (let i = 0; i < bulletSystem.bullets.length; i++) {
        // update
        bulletSystem.bullets[i].y -= bulletSystem.speed * delta;
        if (bulletSystem.bullets[i].y < -10) { // clean far bullets
            bulletSystem.bullets.splice(i, 1);
            i--;
            continue;
        }

        // collision
        for (let j = 0; j < enemySystem.enemies.length; j++) {
            if (isCollision(bulletSystem.bullets[i], enemySystem.enemies[j])) {
                enemySystem.enemies.splice(j, 1); // hit enemy
                j--;
                let currentScore = destroyedEnemy();
                enemySystem.spawnRate = currentScore / 10 + 2;
            }
        }
    }
});

bulletSystem.on('shoot', (x, y) => {
    bulletSystem.bullets.push({
        x,
        y
    });
});

bulletSystem.on('clear', () => {
    bulletSystem.bullets = [];
})

bulletSystem.on('draw', () => {
    
    for (let i = 0; i < bulletSystem.bullets.length; i++) {
        apate.screen.sprite(bulletSystem.bullets[i].x, bulletSystem.bullets[i].y, bulletSystem.bulletSprite, 1);
    }
});

function colorSprite(sprite, r, g, b) {
    let coloredSprite = [];
    for (let i = 0; i < sprite.length; i++) {
        let c = sprite[i].c;
        c.r = (c.r + r) / 2;
        c.g = (c.g + g) / 2;
        c.b = (c.b + b) / 2;
        coloredSprite.push({
            x: sprite[i].x,
            y: sprite[i].y,
            c
        });
    }
    return coloredSprite;
}

function isCollision(obj1, obj2) {
    obj1.w = obj1.h = 8;
    obj2.w = obj2.h = 8;

    if (obj1.x + obj1.w <= obj2.x ||
        obj2.x + obj2.w <= obj1.x ||
        obj1.y + obj1.h <= obj2.y ||
        obj2.y + obj2.h <= obj1.y
    ) return false;
    return true;
}