import {
    apate
} from "../../src/apate.js";
import Entity from "../../src/entity.js";
import ParticleSystem from "../../src/utility/particleSystem.js";

let width = 128;
let height = 128;

let cellsMgr = new Entity();

let start = `
 ..
. .
. .
 .
`;

let pulse = `
  ...   ...  

.    . .    .
.    . .    .
.    . .    .
  ...   ...

  ...   ...
.    . .    .
.    . .    .
.    . .    .

  ...   ...

`;

let acorn = `
  .
    .
 ..  ...`;


cellsMgr.on('init', () => {
    cellsMgr.isRunning = false;
    cellsMgr.state = 'create';
    cellsMgr.cells = new Uint8Array(width * height);
    cellsMgr.updateRate = 10;
    cellsMgr.nextUpdate = 1000 / cellsMgr.updateRate;

    //createPattern(64, 64, acorn);
/*    createPattern(30, 90, acorn);
    createPattern(90, 30, acorn);
    createPattern(90, 90, acorn);

    createPattern(56, 56, pulse);*/
});

cellsMgr.on('update', (delta) => {
    setCell(64,61,1);
    setCell(62,63,1);
    setCell(62,62,1);

    if (apate.isButtonPressed('Right')) {
        if (cellsMgr.updateRate < 100) cellsMgr.updateRate += 0.1;
    } else if (apate.isButtonPressed('Left')) {
        if (cellsMgr.updateRate > 2) cellsMgr.updateRate -= 0.1;
    }
    if (apate.IsMouseDown) {
        let index = (width * apate.mouseY + apate.mouseX);

        cellsMgr.cells[index] = cellsMgr.state == 'create' ? 1 : 0;
    }
    cellsMgr.nextUpdate -= delta;
    if (cellsMgr.nextUpdate < 0 && cellsMgr.isRunning) {

        cellsMgr.lastCells = new Uint8Array(cellsMgr.cells);

        // update cells
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let c = getCell(x,y)
                let sum = countNeighbours(x, y);

                if (c > 0) {
                    if (sum < 2) c = 0;
                    if (sum > 3) c = 0;
                } else {
                    if (sum == 3) c = 1;
                }

                setCell(x,y, c);
            }
        }
        cellsMgr.nextUpdate = 1000 / cellsMgr.updateRate;
    }
});

function createPattern(x, y, pattern) {
    let oX = 0;
    let oY = 0;
    for (let i = 0; i < pattern.length; i++) {

        if (pattern[i] == '.') {
            setCell(oX + x, oY + y, 1);
        }

        oX++;
        if (pattern[i] == '\n') {
            oY++;
            oX = 0;
        }
    }
}

function setCell(x, y, value) {
    if (x > 0 && x <= width && y > 0 && y <= height) {
        cellsMgr.cells[width * y + x] = value;
    }
}

function getCell(x, y) {
    if (x > 0 && x <= width && y > 0 && y <= height) {
        return cellsMgr.lastCells[width * y + x];
    }
    return null;
}

function countNeighbours(rx, ry) {
    let sum = 0;
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            if (!(x == 0 && y == 0)) {
                if (getCell(rx + x, ry + y) > 0) {
                    sum++;
                }
            }
        }
    }
    return sum;
}

let xOffset = 0;
let yOffset = 0;

let white = {
    r: 255,
    g: 255,
    b: 255
}

cellsMgr.on('draw', () => {
    for (let x = xOffset; x < 128 + xOffset; x++) {
        for (let y = yOffset; y < 128 + yOffset; y++) {
            let c = cellsMgr.cells[128 * y + x];
            if (c > 0) {
                apate.screen.pixel(x - xOffset, y - yOffset, white);
            }
        }
    }
});

apate.activeScene.init(cellsMgr);
apate.run();

apate.ShowMouse = true;

apate.ui.addControl('run', (control) => {
    cellsMgr.isRunning = !cellsMgr.isRunning;

    control.name = !cellsMgr.isRunning ? 'run' : 'pause';
});