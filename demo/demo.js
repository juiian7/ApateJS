//




import Engine from "../src/engine.js";
import player from './playerSprite.js';

/**
 * @type {import("../screen/screen.js").ScreenConfig}
 */
const config = {
    scale: 4,
    numberOfLayers: 2
};

var engine = new Engine(config);

engine.reqisterButton('space', 'Space');

let eid = engine.ECS.createEntity();
engine.ECS.addComponent(eid, 'position', {
    x: 0,
    y: 0
});
engine.ECS.addSystem('position', (comp) => {
    //console.log(engine.getPressedKeys());
    if (engine.isButtonPressed('space')){
        comp.x++;
        comp.y++;
    }
});

engine.registerEvent("onStart",(self) => {
    self.screen.flushLayer(0, '#000000');
});

engine.registerEvent("update", (self) => {
    self.screen.clearLayer(1);
});

engine.registerEvent("lastUpdate",(self) => {
    let comp = self.ECS.getEntityComponent(eid, 'position');
    self.screen.pixelSprite(comp.x, comp.y, 4, player, 1);
});

engine.run();



/*
let y = 0, x = 0;
let scale = 1;
setInterval(() => {
    //screen.clearScreen();
    screen.clearLayer(1);
    screen.pixelSprite(x++, y++, scale, player, 1);
}, 1000/30); 

setInterval(() => {
    scale += 1;
    if (scale > 6) scale = 1;
}, 1000);

for (let i = 0; i < screen.screenConfig.width; i++) {
    for (let j = 0; j < screen.screenConfig.height; j++) {
        screen.pixelXYHEX(i, j, genHex(), 0);
    }
}*/


/*
let frames = 0;
let nextSec = new Date().getTime() + 1000;

function drawScreen() {
    for (let i = 0; i < screen.screenConfig.width; i++) {
        for (let j = 0; j < screen.screenConfig.height; j++) {
            screen.pixelXYHEX(i, j, genHex());
        }
    }
    frames++;
    if (new Date().getTime() > nextSec){
        nextSec = new Date().getTime() + 1000; 
        console.log(frames);
        frames = 0;
    }
}
setInterval(drawScreen, 0);
*/
/**
 * @param {number} begin
 * @param {number} end
 */
/*
function randomRange(begin,end){
    return Math.floor((Math.random() * end)+begin)
}
*/
function genHex() {
    return '#' + (Math.floor(Math.random() * 0xFFFFFF)).toString(16).padStart(6, '0');
}