import { apateConfig } from '../../src/apateConfig.js';
import Engine from '../../src/engine.js';
import Color, {
    hexToRgb
} from '../../src/utility/color.js';


apateConfig.parentSelector = '#view';

const palette = {
    black: {
        r: 0,
        g: 0,
        b: 0
    },
    dark_blue: {
        r: 29,
        g: 43,
        b: 83
    },
    dark_purple: {
        r: 126,
        g: 37,
        b: 83
    },
    dark_green: {
        r: 0,
        g: 135,
        b: 81
    },
    brown: {
        r: 171,
        g: 82,
        b: 54
    },
    dark_gray: {
        r: 95,
        g: 87,
        b: 79
    },
    light_gray: {
        r: 194,
        g: 195,
        b: 199
    },
    white: {
        r: 255,
        g: 241,
        b: 232
    },
    red: {
        r: 255,
        g: 0,
        b: 77
    },
    orange: {
        r: 255,
        g: 163,
        b: 0
    },
    yellow: {
        r: 255,
        g: 236,
        b: 39
    },
    green: {
        r: 0,
        g: 228,
        b: 54
    },
    blue: {
        r: 41,
        g: 173,
        b: 255
    },
    indigo: {
        r: 131,
        g: 118,
        b: 156
    },
    pink: {
        r: 255,
        g: 119,
        b: 168
    },
    peach: {
        r: 155,
        g: 104,
        b: 170
    }
}

let engine = new Engine();

var sprite = [];
let backgroundColor = {
    r: 100,
    g: 100,
    b: 100
};

engine.clearColor = backgroundColor;

//engine.registerButton('lighter', 'ArrowUp');
//engine.registerButton('darker', 'ArrowDown');

engine.registerButton('right', 'ArrowRight');
engine.registerButton('left', 'ArrowLeft');
engine.registerButton('space', 'Space');



let w = 16;
let h = 16;

let pw = Math.round((110 / w));
let ph = Math.round((110 / h));

let currentColor = palette['red'];
let doRemove = false;
let currentSelection = 8;
let colors = Object.keys(palette);

currentColor = palette[colors[currentSelection]];
let nextTime = new Date().getTime() + 300;

engine.on('update', () => {

    /*if (engine.isButtonPressed('lighter') && backgroundColor.r < 253) {
        backgroundColor.r += 2;
        backgroundColor.b = backgroundColor.g = backgroundColor.r;

        engine.clearColor = backgroundColor;

    } else if (engine.isButtonPressed('darker') && backgroundColor.r > 2) {
        backgroundColor.r -= 2;
        backgroundColor.b = backgroundColor.g = backgroundColor.r;

        engine.clearColor = backgroundColor;
    }*/

    if (engine.isButtonPressed('right') && nextTime < new Date().getTime()) {

        currentSelection++;
        if (currentSelection > colors.length - 1) currentSelection = 0;

        currentColor = palette[colors[currentSelection]];
        nextTime = new Date().getTime() + 300;

    } else if (engine.isButtonPressed('left') && nextTime < new Date().getTime()) {

        currentSelection--;
        if (currentSelection < 0) currentSelection = colors.length - 1;

        currentColor = palette[colors[currentSelection]];
        nextTime = new Date().getTime() + 300;
    }

    displayPalette(palette);
    renderGrid();
    renderSprite();

    if (engine.IsMouseDown) {
        if (engine.mouseY < h * ph && engine.mouseX < w * pw) {
            let {
                x,
                y
            } = screenToSprite(engine.mouseX, engine.mouseY);
            removePixelIfExists(x, y);
            if (!doRemove) sprite.push({
                x,
                y,
                c: currentColor
            });
        } else {
            handleClickedColor(engine.mouseX, engine.mouseY)
        }
    }
});

engine.on('save', () => {
    engine.saveObjToBrowser('sprite', sprite);
});

engine.on('load', () => {
    let s = engine.loadObjFromBrowser('sprite');
    if (s) sprite = s;
});


function removePixelIfExists(x, y) {
    let p = sprite.find(p => p.x == x && p.y == y);
    if (p) {
        let index = sprite.indexOf(p);
        sprite.splice(index, 1);
    }
}

function displayPalette(palette) {
    let i = 0;
    let dw = 128 / Object.keys(palette).length;
    for (const color in palette) {
        if (palette[color] == currentColor) {
            engine.screen.rect(i * dw, 128 - 8, dw, 7, palette[color]);
        } else engine.screen.rect(i * dw, 128 - 5, dw, 5, palette[color]);
        i++;
    }
}

function handleClickedColor(mx, my) {
    let i = 0;
    let dw = 128 / Object.keys(palette).length;
    for (const color in palette) {

        let x = i * dw;
        let w = dw;
        let y = 128 - 8;
        let h = 10;

        if (mx > x && mx < x + w && my > y && my < y + h) {
            currentColor = palette[color];
        }

        i++;
    }
}

function renderGrid() {
    for (let i = 0; i < w; i++) {
        engine.screen.rect(pw + (i * pw) - 1, 0, 1, h * ph, palette['black']);
    }
    for (let j = 0; j < h; j++) {
        engine.screen.rect(0, ph + (j * ph) - 1, w * pw, 1, palette['black']);
    }
}

function renderSprite() {
    for (const pixel of sprite) {
        engine.screen.rect(pixel.x * pw, pixel.y * ph, pw - 1, ph - 1, pixel.c);
    }
}

function screenToSprite(mouseX, mouseY) {
    return {
        x: Math.floor(mouseX / pw),
        y: Math.floor(mouseY / ph)
    }
}

let x = 0;
let y = 0;

var hexDigits = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");

engine.setTitle('ApateJS Sprite Editor');
engine.addControl('Download', () => {
    download('sprite.json', JSON.stringify(sprite));
});

engine.addControl('Clear', () => {
    sprite = [];
});

let tmpColor;

function toggleMode() {
    doRemove = !doRemove;
    let name = 'Erase';
    if (doRemove) {
        name = 'Draw';
        tmpColor = currentColor;
        currentColor = null;
    } else {
        currentColor = tmpColor;
    }
    return {
        name
    };
}

engine.addControl('Erase', toggleMode, 'space');


engine.run();

engine.setDescription(`#ApateJS Sprite Editor

test:
- 12as
- de34`);

// ##############################################################################

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element)
}