import Tilemap from '../utility/tilemap.js';
import { charSpriteMap } from './asciiSprites.js';
import PixelScreen from './pixelScreen.js';

export default class Screen {
    constructor(element) {
        this.element = element;

        this.pixelScreen = new PixelScreen(this.element);
        //this.asciiScreen = new AsciiScreen(element);

        //this.tmpColor = new Color(0, 0, 0);
        this.clear({ r: 0, g: 0, b: 0 });
    }

    clear(c) {
        this.pixelScreen.clear(c.r, c.g, c.b);
    }

    /**
     * @param {number} x x-coord
     * @param {number} y y-coord
     * @param {{r,g,b}} c color
     */
    pixel(x, y, c) {
        this.pixelScreen.setPixel(x, y, c.r, c.g, c.b);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {{r,g,b}} c
     */
    rect(x, y, w, h, c) {
        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                this.pixelScreen.setPixel(x + i, y + j, c.r, c.g, c.b);
            }
        }
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} x2
     * @param {number} y2
     * @param {{r,g,b}} c
     */
    line(x1, y1, x2, y2, c) {
        this.pixel(x1, y1, c);
        if (x1 == x2 && y1 == y2) {
            return;
        }
        let dx = x2 - x1;
        let dy = y2 - y1;
        let l = Math.sqrt(dx * dx + dy * dy);
        (dx /= l), (dy /= l);

        let x = x1;
        let y = y1;
        do {
            (x += dx), (y += dy);
            this.pixel(Math.round(x), Math.round(y), c);
        } while (!(Math.round(x) == x2 && Math.round(y) == y2));
    }

    /**
     * @param {number} x x-coord
     * @param {number} y y-coord
     * @param {any} spriteObj sprite format: [{x,y,hex},...]
     * @param {number} scale
     */
    sprite(x, y, spriteObj, scale) {
        x = Math.round(x);
        y = Math.round(y);
        for (let i = 0; i < spriteObj.length; i++) {
            this.rect(x + spriteObj[i].x * scale, y + spriteObj[i].y * scale, scale, scale, spriteObj[i].c);
        }
    }

    animatedSprite(x, y, animSpriteObj, scale, frame) {
        this.sprite(x, y, animSpriteObj[frame], scale);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {string} text
     * @param {{r,g,b}} c color of the text
     * @param {*} options
     */
    text(x, y, text, c, options) {
        options = {
            ...defaultTextOptions,
            ...options
        };
        options.leftSpace *= options.scale;
        options.topSpace *= options.scale;
        let xOffset = x;
        for (let i = 0; i < text.length; i++) {
            let char = text[i].toUpperCase();
            if (char == ' ') {
                xOffset += 4 + options.leftSpace;
                continue;
            }
            if (char == '\n') {
                xOffset = x;
                y += 5 + options.topSpace;
                continue;
            }
            let charSprite = charSpriteMap[char];

            for (let j = 0; j < charSprite.pixels.length; j++) {
                this.rect(charSprite.pixels[j].x * options.scale + xOffset, charSprite.pixels[j].y * options.scale + y, options.scale, options.scale, c);
            }
            xOffset += charSprite.len + options.leftSpace;
        }
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {Tilemap} tilemap
     */
    tilemap(x, y, tilemap) {
        for (let i = 0; i < tilemap.tiles.length; i++) {
            this.sprite(x + tilemap.tiles[i].x * tilemap.tileWidth, y + tilemap.tiles[i].y * tilemap.tileHeight, tilemap.tileMap[tilemap.tiles[i].name], 1);
        }
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {{r,g,b}} c
     * @param {string} func Function to draw (f(x) = Math.sin(x))
     * @param {number} start starting x
     * @param {number} end ending x
     */
    drawFunc(x, y, c, func, start, end) {
        if (func.includes('=')) {
            func = func.substring(func.indexOf('=') + 1);
        }

        let lastTy = eval(func.replaceAll('x', start)) + y;
        let ty = 0;

        for (let i = start + 1; i < end; i++) {
            ty = Math.round(eval(func.replaceAll('x', i)) + y);

            this.line(i - 1 + x, lastTy, x + i, ty, c);

            lastTy = ty;
        }
    }

    circle(x, y, r, c) {
        let d = (5 - r * 4) / 4;
        let px = 0;
        let py = r;

        do {
            // draw
            this.pixel(x + px, y + py, c);
            this.pixel(x - px, y + py, c);
            this.pixel(x + px, y - py, c);
            this.pixel(x - px, y - py, c);
            this.pixel(x + py, y + px, c);
            this.pixel(x - py, y + px, c);
            this.pixel(x + py, y - px, c);
            this.pixel(x - py, y - px, c);

            if (d < 0) {
                d += 2 * px + 1;
            } else {
                d += 2 * (px - py) + 1;
                py--;
            }
            px++;
        } while (px <= py);
    }

    fcircle(x, y, r, c) {
        let d = (5 - r * 4) / 4;
        let px = 0;
        let py = r;

        do {
            // draw
            this.line(x - px, y + py, x + px, y + py, c);
            this.line(x - px, y - py, x + px, y - py, c);
            this.line(x - py, y + px, x + py, y + px, c);
            this.line(x - py, y - px, x + py, y - px, c);

            if (d < 0) {
                d += 2 * px + 1;
            } else {
                d += 2 * (px - py) + 1;
                py--;
            }
            px++;
        } while (px <= py);
    }
}

const defaultTextOptions = {
    scale: 1,
    leftSpace: 1,
    topSpace: 1
    //align
    //autoNewLine
    //maxX
};
