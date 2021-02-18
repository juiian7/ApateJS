import {
    apate
} from "../../src/apate.js";
import ParticleSystem from "../../src/utility/particleSystem.js";
import {
    loadScene
} from "./level.js";

let mainTileMap;

apate.clearScreen = true;

let blood = {
    amount: 20,
    origin: {
        x: 64,
        y: 64
    },
    lifetime: 200,
    velocity: {
        randomMinX: -50,
        randomMaxX: 50,
        randomMinY: -50,
        randomMaxY: 50
    },
    emitDelay: 0,
    gravity: {
        x: 0,
        y: .6
    },
    colors: [{
        r: 255,
        g: 0,
        b: 0
    },{
        r: 0,
        g: 64,
        b: 255
    }]
};

let rain = {
    amount: Infinity,
    
    gravity: {
        y: .3
    },
    velocity: {
        randomMinX: 0.4,
        randomMaxX: 2,
        y: 0
    },
    emitDelay: 20,
    colors: [{
        r: 0,
        g: 64,
        b: 255
    }],
    lifetime: 500
}

let ps = new ParticleSystem(blood);
apate.activeScene.init(ps);

apate.on('start', async () => {

    mainTileMap = await loadScene(0);
    
    ps.start();
});

let scroll = 0;

apate.on('update', (delta) => {

    if (apate.isButtonPressed('Left')) {
        scroll += 0.1;
    }

});

let white = rgb(255, 255, 255);

let red = rgb(255, 0, 0);

apate.on('draw', () => {
    //drawBackground(engine.screen, Math.round(scroll));

    //engine.screen.line(64, 64, engine.mouseX, engine.mouseY, white);
    //apate.screen.tilemap(0, 0, mainTileMap);

});

apate.run();



function rgb(r, g, b) {
    return {
        r,
        g,
        b
    };
}