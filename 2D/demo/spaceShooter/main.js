import {
    apate
} from "../../src/apate.js";
import Entity from "../../src/entity.js";
import SpriteMgr from "../../src/utility/spriteMgr.js";
import { bulletSystem } from "./bulletSystem.js";
import { enemySystem } from "./enemySystem.js";
import {
    spaceShip
} from "./spaceShip.js";
import {
    starMap
} from "./starMap.js";

let spriteMgr = new SpriteMgr();


let colors = {
    white: rgb(230, 230, 230),
};

//let apate = new apate();
apate.random.setSeed(6942007);

//apate.useUI();
//apate.ui.setTitle('Space Shooter');

let score = 0;
let highscore = 0;

let isAlive = true;


apate.on("start", async () => {
    spaceShip.shipSprite = spriteMgr.imgToSprite(await spriteMgr.loadImgFromUrl('./images/ship.png'));

    apate.clearColor = rgb(0, 0, 55);
});

apate.on("update", (delta) => {
    if (!isAlive && apate.isButtonPressed('Action2')) {

        isAlive = true; // Restart
        
        spaceShip.reset();
        bulletSystem.clear();
        enemySystem.clear();
        enemySystem.spawnRate = 2;

        score = 0;
    }
});

apate.on('draw', () => {
    if (isAlive) {
        apate.screen.text(2, 120, 'Score: ' + score + ' - Best: ' + highscore, colors.white);
    } else {
        apate.screen.text(20, 35, 'Game Over', colors.white, {
            scale: 2,
            leftSpace: 3
        });
        apate.screen.text(36, 100, 'Restart (X/V)', colors.white, 1);

        let msg = 'Score: ' + score + '\nHighscore: ' + highscore;
        apate.screen.text(36, 128 / 2, msg, colors.white, {
            topSpace: 4
        });
    }
});

apate.on('load', () => {
    let savefile = apate.loadObjFromBrowser('spaceShooter');
    if (savefile) highscore = savefile.score;
});

apate.on('save', () => {
    apate.saveObjToBrowser('spaceShooter', {
        score: highscore
    });
});

apate.activeScene.init(spaceShip);
apate.activeScene.init(starMap);
apate.activeScene.init(bulletSystem);
apate.activeScene.init(enemySystem);

console.log(apate.activeScene.entities);

apate.run();

export function lost() {
    isAlive = false;
    spaceShip.isActive = false;
    highscore = score > highscore ? score : highscore;
    apate.save();
}

export function destroyedEnemy() {
    return ++score;
}

function rgb(r, g, b) {
    return {
        r,
        g,
        b
    };
}