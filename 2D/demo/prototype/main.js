import Engine from "../../src/engine.js";
import Tilemap from "../../src/utility/tilemap.js";
import {
    drawBackground
} from "./bg.js";
import { loadScene } from "./level.js";



let mainTileMap;

let engine = new Engine();
engine.clearScreen = true;

engine.on('start', async () => {

    mainTileMap = await loadScene(0);


});

let scroll = 0;

engine.on('update', (delta) => {

    if (engine.isButtonPressed('Left')) {
        scroll += 0.1;
    }

});

let white = rgb(255, 255, 255);

engine.on('draw', () => {
    //drawBackground(engine.screen, Math.round(scroll));

    //engine.screen.line(64, 64, engine.mouseX, engine.mouseY, white);
    engine.screen.tilemap(0, 0, mainTileMap);
});

engine.run();



function rgb(r, g, b) {
    return {
        r,
        g,
        b
    };
}