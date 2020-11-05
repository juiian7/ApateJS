import Color from '../../src/utility/color.js';
import Screen from '../../src/screen/screen.js';


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

var screenconfig = {
    width: 16,
    height: 16,
    scale: 32
};


let params = new URLSearchParams(window.location.search);

let size = params.get('size');
if (size) {
    screenconfig.width = Number.parseInt(size.split('x')[0]);
    screenconfig.height = Number.parseInt(size.split('x')[1]);
}

var screen = new Screen('#view', screenconfig);

var sprite = [];


var currentColor = '#000000';


displayPalette(palette);

function displayPalette(palette) {
    var colors = document.querySelector('#colors');
    for (const color in palette) {
        var c = new Color(palette[color].r, palette[color].g, palette[color].b);
        let div = document.createElement('div');
        div.style.backgroundColor = c.HEX;
        div.style.height = '40px';
        div.style.width = '40px';
        //div.innerText = c.HEX;

        div.onclick = (ev) => {
            currentColor = rgb2hex(ev.currentTarget.style.backgroundColor);
        };

        colors.appendChild(div);
    }
}

let x = 0;
let y = 0;

document.querySelector('#view').onmousemove = (ev) => {
    x = Math.floor(ev.clientX / screenconfig.scale);
    y = Math.floor(ev.clientY / screenconfig.scale);
};

document.querySelector('#view').onmousedown = (ev) => {
    let s = sprite.find(p => p.x == x && p.y == y);
    if (!s) {
        sprite.push({
            x,
            y,
            c: currentColor
        });
    } else s.c = currentColor;

    console.log(currentColor, sprite);
    screen.pixelSprite(0, 0, 1, sprite);
};

var hexDigits = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");

//Function to convert rgb color to hex format
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function hex(x) {
    return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
}


function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element)
}

document.querySelector('#download').onclick = () => {
    download('sprite.json', JSON.stringify(sprite));
};