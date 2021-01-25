import {
    apateConfig
} from "../../src/apateConfig.js";
import Engine from "../../src/engine.js";
import Random from "../../src/utility/random.js";
import {
    imgToSprite,
    loadImgFromUrl
} from "../../src/utility/spriteMgr.js";

apateConfig.useUI = true;

let rand = new Random(123456);
let engine = new Engine();

engine.registerButton('Left', 'KeyA');
engine.registerButton('Left', 'ArrowLeft');

engine.registerButton('Right', 'KeyD');
engine.registerButton('Right', 'ArrowRight');

engine.registerButton('Reset', 'KeyR');

engine.registerButton('Shoot', 'Space');


let currentEnemies = [];
let bullets = [];


let score = 0;
let highscore = 0;

engine.ui.setTitle('Space Shooter');
engine.on('load', () => {
    let savefile = engine.loadObjFromBrowser('spaceShooter');
    if (savefile) highscore = savefile.score;
});

engine.on('save', () => {
    engine.saveObjToBrowser('spaceShooter', {
        score: highscore
    });
});

let shipSprite, enemySprite, bulletSprite;
let ship = {
    x: 128 / 2 - 4,
    y: 110,
    scale: 1,
    speed: 0.1
}

engine.on("start", async () => {
    shipSprite = imgToSprite(await loadImgFromUrl('./images/ship.png'));
    enemySprite = imgToSprite(await loadImgFromUrl('./images/enemy.png'));
    bulletSprite = imgToSprite(await loadImgFromUrl('./images/bullet.png'));

    engine.clearColor = {
        r: 0,
        g: 55,
        b: 2
    };
});

let isAlive = true;

let shootsPerSec = 5;
let nextShoot = 1000 / shootsPerSec;

let bulletSpeed = 0.5;

let spawnsPerSec = 2;
let nextSpawn = 1000 / spawnsPerSec;

engine.on("update", (delta) => {
    if (!isAlive && engine.isButtonPressed('Reset')) {
        isAlive = true;
        currentEnemies = [];
        bullets = [];
        score = 0;
        ship = {
            x: 128 / 2 - 4,
            y: 110,
            scale: 1,
            speed: 0.1
        };
        spawnsPerSec = 2;
    }

    if (isAlive) {
        nextSpawn -= delta;
        if (nextSpawn < 0) {
            createEnemy(rand.between(0, 127 - 8), -10);
            nextSpawn = 1000 / spawnsPerSec;
        }

        nextShoot -= delta;
        if (engine.isButtonPressed('Shoot') && nextShoot < 0) {
            bullets.push({
                x: ship.x,
                y: ship.y
            });
            nextShoot = 1000 / shootsPerSec;
        }

        if (engine.isButtonPressed('Left')) ship.x -= delta * ship.speed;
        if (engine.isButtonPressed('Right')) ship.x += delta * ship.speed;


        for (let i = 0; i < bullets.length; i++) {
            // update
            bullets[i].y -= bulletSpeed * delta;
            if (bullets[i].y < -10) {
                bullets.splice(i, 1);
                i--;
                continue;
            }

            // collision
            for (let j = 0; j < currentEnemies.length; j++) {
                if (isCollision(bullets[i], currentEnemies[j])) {
                    currentEnemies.splice(j, 1);
                    j--;
                    score++;
                    spawnsPerSec = score / 10 + 2;
                    continue;
                }
            }

            // draw
            engine.screen.sprite(bullets[i].x, bullets[i].y, bulletSprite, 1);
        }
    }


    for (let i = 0; i < currentEnemies.length; i++) {
        if (isAlive) {
            currentEnemies[i].y += currentEnemies[i].speed * delta;

            if (currentEnemies[i].y > 120) {

                isAlive = false;
                highscore = score > highscore ? score : highscore;
                engine.save();
            }
        }
        engine.screen.sprite(currentEnemies[i].x, currentEnemies[i].y, enemySprite, 1);
    }
    // draw player
    engine.screen.sprite(ship.x, ship.y, shipSprite, ship.scale);
    // draw ground
    engine.screen.rect(0, 128 - 2, 128, 8, {
        r: 145,
        g: 193,
        b: 0
    });

    if (isAlive) engine.screen.text(0, 120, 'Score: ' + score + ' - Best: ' + highscore, {
        r: 129,
        g: 176,
        b: 0
    });
    else {
        engine.screen.rect(128 / 2 - 12 * 4, 128 / 2 - 4, 9 * 8, 10 * 3, {
            r: 0,
            g: 55,
            b: 2
        });

        let msg = 'Game Over\nScore: ' + score + '\nHighscore: ' + highscore +'\nR to Restart';
        engine.screen.text(128 / 2 - 9 * 4, 128 / 2 - 4, msg, {
            r: 129,
            g: 176,
            b: 0
        }, {
            topSpace: 4
        });
    }

});

engine.run();

function createEnemy(x, y) {
    currentEnemies.push({
        x,
        y,
        speed: rand.between(0.01, 0.05)
    });
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