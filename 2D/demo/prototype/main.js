import { apate } from "../../src/apate.js";
import Tilemap from "../../src/utility/tilemap.js";
import {
    drawBackground
} from "./bg.js";
import { loadScene } from "./level.js";



let mainTileMap;

apate.clearScreen = true;

apate.on('start', async () => {

    mainTileMap = await loadScene(0);


});

let scroll = 0;

apate.on('update', (delta) => {

    if (apate.isButtonPressed('Left')) {
        scroll += 0.1;
    }

});

let white = rgb(255, 255, 255);

apate.on('draw', () => {
    //drawBackground(engine.screen, Math.round(scroll));

    //engine.screen.line(64, 64, engine.mouseX, engine.mouseY, white);
    apate.screen.tilemap(0, 0, mainTileMap);
});

apate.run();



function rgb(r, g, b) {
    return {
        r,
        g,
        b
    };
}