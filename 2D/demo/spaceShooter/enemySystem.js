import { apate } from '../../src/apate.js';
import Entity from '../../src/entity.js';
import SpriteMgr from '../../src/utility/spriteMgr.js';
import { lost } from './main.js';

let spriteMgr = new SpriteMgr();

let nextAnimFrame = 1000 / 20;
let animFrame = 0;

export var enemySystem = new Entity();
enemySystem.priority = 5;

enemySystem.loadAttributes({
    enemies: [],
    spawnRate: 2
});

let nextSpawn = 1000 / enemySystem.spawnRate;

enemySystem.on('init', async () => {
    enemySystem.enemySprite = spriteMgr.imgToAnimatedSprite(await spriteMgr.loadImgFromUrl('./images/enemy.png'), 8);
});

enemySystem.on('update', (delta) => {
    nextAnimFrame -= delta;
    if (nextAnimFrame <= 0) {
        nextAnimFrame = 1000 / 20;
        animFrame++;
        if (animFrame >= enemySystem.enemySprite.length) animFrame = 0;
    }

    nextSpawn -= delta;
    if (nextSpawn <= 0) {
        enemySystem.spawn(apate.random.between(0, 127 - 8), -10, apate.random.between(0.01, 0.05));
        nextSpawn = 1000 / enemySystem.spawnRate;
    }

    // update enemies
    for (let i = 0; i < enemySystem.enemies.length; i++) {
        enemySystem.enemies[i].y += enemySystem.enemies[i].speed * delta;

        if (enemySystem.enemies[i].y > 120) {
            // lost
            lost();
        }
    }
});

enemySystem.on('spawn', (x, y, speed) => {
    enemySystem.enemies.push({
        x,
        y,
        speed
    });
});

enemySystem.on('clear', () => {
    enemySystem.enemies = [];
});

enemySystem.on('draw', () => {
    for (let i = 0; i < enemySystem.enemies.length; i++) {
        apate.screen.animatedSprite(enemySystem.enemies[i].x, enemySystem.enemies[i].y, enemySystem.enemySprite, 1, animFrame);
    }
});
