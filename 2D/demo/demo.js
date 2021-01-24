//

import Engine from '../src/engine.js';
import Color from '../src/utility/color.js';

var engine = new Engine();

engine.ShowMouse = true;

engine.registerButton('Up', 'KeyW');
engine.registerButton('Down', 'KeyS');
engine.registerButton('Left', 'KeyA');
engine.registerButton('Right', 'KeyD');

let eid = engine.ECS.createEntity();

engine.ECS.setSystem('movement', ['position'], (comps) => {
    if (comps['position'].eid == eid) {
        //console.log(engine.getPressedKeys());
        if (engine.isButtonPressed('Up')) comps['position'].y--;
        if (engine.isButtonPressed('Down')) comps['position'].y++;
        if (engine.isButtonPressed('Left')) comps['position'].x--;
        if (engine.isButtonPressed('Right')) comps['position'].x++;

        if (comps['position'].x >= 128) {
            engine.IsRunning = false;
        }
    }

});

let i = 0;
let c = new Color(255, 255, 0);

let lastmx = engine.mouseX;
let lastmy = engine.mouseY;

engine.on("update", () => {
    for (let i = 0; i < 128; i++) {
        for (let j = 0; j < 128; j++) {
            //e.screen.pixel(i, j, genColor(), 0);
        }
    }

    //engine.screen.text(0,0,i+'',c);
});

engine.on('start', async () => {
    let player = await engine.loadSprite('/demo/playerSprite.json');
    //engine.Title = 'Cool Demo Game';

    engine.ECS.addComponent(eid, 'sprite', {
        sprite: player,
        layer: 1,
        scale: 4
    });
    let rectEntityID = engine.ECS.createEntity();
    engine.ECS.addComponent(rectEntityID, 'rectangle', {
        w: 10,
        h: 10,
        c: new Color(0, 255, 255)
    });
    engine.ECS.setSystem('rectUpdate', ['position', 'rectangle'], (comps) => {
        if (comps['position'].eid == rectEntityID) {
            if (engine.IsMouseDown) {
                if (engine.mouseX > comps['position'].x && engine.mouseX < comps['position'].x + comps['rectangle'].w &&
                    engine.mouseY > comps['position'].y && engine.mouseY < comps['position'].y + comps['rectangle'].h) {
                    comps['position'].x += engine.mouseX - lastmx;
                    comps['position'].y += engine.mouseY - lastmy;
                }

            }

            lastmx = engine.mouseX;
            lastmy = engine.mouseY;
        }
    });
    engine.ECS.setSystem('rectRendererer', ['position', 'rectangle'], (comps) => {
        engine.screen.rect(comps['position'].x, comps['position'].y, comps['rectangle'].w, comps['rectangle'].h, comps['rectangle'].c);
    });
});

(async () => {
    engine.run();
})();

engine.on("exit", () => {
    console.log('exit');
});

engine.on('save', () => {

});

engine.on('load', () => {

});

function genHex() {
    return '#' + (Math.floor(Math.random() * 0xFFFFFF)).toString(16).padStart(6, '0');
}

function genColor() {
    let r = Math.random() * 255 + 1;
    let g = Math.random() * 255 + 1;
    let b = Math.random() * 255 + 1;
    return new Color(r, g, b);
}