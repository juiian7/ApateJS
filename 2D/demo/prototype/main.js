import Engine, {
    spriteMgr
} from "../../src/engine.js";
import {
    drawBackground
} from "./bg.js";


let engine = new Engine();
engine.clearScreen = false;

engine.on('start', () => {

});

let scroll = 0;

engine.on('update', (delta) => {
    
    if (engine.isButtonPressed('Left')) {
        scroll+=0.1;
    }
    
});

engine.on('draw', () => {
    drawBackground(engine.screen, Math.round(scroll));
});

engine.run();



function rgb(r, g, b) {
    return {
        r,
        g,
        b
    };
}