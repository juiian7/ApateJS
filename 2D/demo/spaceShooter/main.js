import Engine, {
    spriteMgr
} from "../../src/engine.js";

let colors = {
    white: rgb(230, 230, 230),
};

let engine = new Engine();
engine.random.setSeed(6942007);

engine.useUI();
engine.ui.setTitle('Space Shooter');

let score = 0;
let highscore = 0;

let isAlive = true;

let shootsPerSec = 5;
let nextShoot = 1000 / shootsPerSec;

let bulletSpeed = 0.5;

let spawnsPerSec = 2;
let nextSpawn = 1000 / spawnsPerSec;

let nextAnimFrame = 1000 / 20;
let animFrame = 0;

let ship = {
    x: 128 / 2 - 4,
    y: 110,
    scale: 1,
    speed: 0.1
}
let shipSprite, enemySprite, bulletSprite, coloredBulletSprite

let currentEnemies = [];
let bullets = [];

let stars = [];
let starColors = [
    rgb(230, 230, 200),
    rgb(230, 230, 230),
    rgb(165, 165, 165),
    rgb(215, 210, 215)
];
createStars(100);

engine.on("start", async () => {
    shipSprite = spriteMgr.imgToSprite(await spriteMgr.loadImgFromUrl('./images/ship.png'));
    enemySprite = spriteMgr.imgToAnimatedSprite(await spriteMgr.loadImgFromUrl('./images/enemy.png'), 8);
    bulletSprite = spriteMgr.imgToSprite(await spriteMgr.loadImgFromUrl('./images/bullet.png'));

    engine.clearColor = rgb(0, 0, 55);
    colorBullet(0, 255, 0);
});

engine.on("update", (delta) => {
    if (isAlive) {
        // timing
        nextAnimFrame -= delta;
        if (nextAnimFrame <= 0) {
            nextAnimFrame = 1000 / 20;
            animFrame++;
            if (animFrame >= enemySprite.length) animFrame = 0;
        }
        nextSpawn -= delta;
        if (nextSpawn <= 0) {
            createEnemy(engine.random.between(0, 127 - 8), -10);
            nextSpawn = 1000 / spawnsPerSec;
        }
        nextShoot -= delta;
        if (engine.isButtonPressed('Action1') && nextShoot < 0) {
            bullets.push({
                x: ship.x,
                y: ship.y
            });
            nextShoot = 1000 / shootsPerSec;
        }

        // movement
        if (engine.isButtonPressed('Left')) ship.x -= delta * ship.speed;
        if (engine.isButtonPressed('Right')) ship.x += delta * ship.speed;

        if (ship.x  < -8) {
            ship.x = 128;
        } else if (ship.x > 128) {
            ship.x = -8;
        }

        for (let i = 0; i < bullets.length; i++) {
            // update
            bullets[i].y -= bulletSpeed * delta;
            if (bullets[i].y < -10) { // clean far bullets
                bullets.splice(i, 1);
                i--;
                continue;
            }

            // collision
            for (let j = 0; j < currentEnemies.length; j++) {
                if (isCollision(bullets[i], currentEnemies[j])) {
                    currentEnemies.splice(j, 1); // hit enemy
                    j--;
                    score++;
                    spawnsPerSec = score / 10 + 2;
                }
            }
        }

        // update enemies
        for (let i = 0; i < currentEnemies.length; i++) {
            currentEnemies[i].y += currentEnemies[i].speed * delta;

            if (currentEnemies[i].y > 120) { // lost
                isAlive = false;
                highscore = score > highscore ? score : highscore;
                engine.save();
            }
        }

        for (let i = 0; i < stars.length; i++) {

            stars[i].tmpY += 0.3;
            if (stars[i].y + stars[i].tmpY > 128) stars[i].tmpY = 0 - stars[i].y;
        }
    }
    if (!isAlive && engine.isButtonPressed('Action2')) {

        isAlive = true; // Restart
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
});

engine.on('draw', () => {

    if (isAlive) {
        drawBG(engine.screen);

        for (let i = 0; i < currentEnemies.length; i++) {
            engine.screen.animatedSprite(currentEnemies[i].x, currentEnemies[i].y, enemySprite, 1, animFrame);
        }
        // draw player
        for (let i = 0; i < bullets.length; i++) {
            engine.screen.sprite(bullets[i].x, bullets[i].y, coloredBulletSprite, 1);
        }

        // draw player
        engine.screen.sprite(ship.x, ship.y, shipSprite, ship.scale);

        engine.screen.text(0, 120, 'Score: ' + score + ' - Best: ' + highscore, colors.white);
    } else {
        engine.screen.text(20, 35, 'Game Over', colors.white, {
            scale: 2,
            leftSpace: 3
        });
        engine.screen.text(36, 100, 'Restart (X/V)', colors.white, 1);

        let msg = 'Score: ' + score + '\nHighscore: ' + highscore;
        engine.screen.text(36, 128 / 2, msg, colors.white, {
            topSpace: 4
        });
    }
});

engine.on('load', () => {
    let savefile = engine.loadObjFromBrowser('spaceShooter');
    if (savefile) highscore = savefile.score;
});

engine.on('save', () => {
    engine.saveObjToBrowser('spaceShooter', {
        score: highscore
    });
});


engine.run();

function createEnemy(x, y) {
    currentEnemies.push({
        x,
        y,
        speed: engine.random.between(0.01, 0.05)
    });
}


function colorBullet(r, g, b) {
    coloredBulletSprite = [];
    for (let i = 0; i < bulletSprite.length; i++) {
        let c = bulletSprite[i].c;
        c.r = (c.r + r) / 2;
        c.g = (c.g + g) / 2;
        c.b = (c.b + b) / 2;
        coloredBulletSprite.push({
            x: bulletSprite[i].x,
            y: bulletSprite[i].y,
            c
        });
    }
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

function createStars(amount) {
    for (let i = 0; i < amount; i++) {
        let x = Math.round(engine.random.between(0, 128));
        let y = Math.round(engine.random.between(0, 128));
        let c = starColors[Math.round(engine.random.between(0, 3))];
        let s = 1;
        stars.push({
            x,
            y,
            c,
            s,
            tmpY: 0
        });
    }
}

function drawBG() {
    for (let i = 0; i < stars.length; i++) {
        engine.screen.rect(stars[i].x, stars[i].y + Math.round(stars[i].tmpY), stars[i].s, stars[i].s, stars[i].c);
    }
}

function rgb(r, g, b) {
    return {
        r,
        g,
        b
    };
}