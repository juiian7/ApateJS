import {
    apateConfig
} from "../src/apateConfig.js";
import Engine from "../src/engine.js";
import Random from "../src/utility/random.js";
import Color from "../src/utility/color.js";
import {
    imgToSprite,
    loadImgFromUrl
} from "../src/utility/spriteMgr.js";

apateConfig.useUI = true;

let random = new Random();
let sprite;

let engine = new Engine();
engine.ShowMouse = false;

engine.on("start", async () => {
    let img = await loadImgFromUrl('test.png');
    sprite = imgToSprite(img);
    console.log(sprite);

    engine.clearScreen = false;
    engine.screen.rect(0, 0, 10, 10, new Color(255, 0, 0));
    engine.screen.sprite(0, 0, sprite, 4);

    await sleep(1000);
});


function sleep(ms) {
    return new Promise(res =>{
        setTimeout(() => {
            res();
        }, ms);
    });
}

engine.on("update", (deltaTime) => {
    //console.log(deltaTime);
    let c = {
        r: 0,
        g: 0,
        b: 0
    }
    for (let i = 0; i < 128; i++) {
        for (let j = 0; j < 128; j++) {
            engine.screen.pixel(i, j, c);
            c.r = random.between(0,255);
            c.g = random.between(0,255);
            c.b = random.between(0,255);
        }
    }
    engine.screen.sprite(0, 0, sprite, 4);
});

engine.run();   
