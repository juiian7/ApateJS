import Color, {
    hexToRgb
} from "../utility/color.js";
import PixelScreen from "./pixel/pixelScreen.js";
import {
    apateConfig
} from "../apateConfig.js";
import AsciiScreen from "./ascii/asciiScreen.js";

export default class Screen {

    constructor(element) {

        this.element = element;

        this.pixelScreen = new PixelScreen(this.element);
        //this.asciiScreen = new AsciiScreen(element);

        this.tmpColor = new Color(0, 0, 0);
        this.clear({
            r: 0,
            g: 0,
            b: 0
        });
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
     * 
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
     * @param {number} x x-coord
     * @param {number} y y-coord
     * @param {any} spriteObj sprite format: [{x,y,hex},...]
     * @param {number} scale 
     */
    sprite(x, y, spriteObj, scale) {
        for (let i = 0; i < spriteObj.length; i++) {
            this.rect(x + (spriteObj[i].x * scale), y + (spriteObj[i].y * scale), scale, scale, hexToRgb(spriteObj[i].c));
        }
    }

    text(x, y, t, c) {
        /*this.asciiScreen.setColor(c.HEX);

        let xOffset = 0;
        let yOffset = 0;
        for (let i = 0; i < t.length; i++) {
            this.asciiScreen.putChar(x + xOffset, y + yOffset, t[i]);
            if (t[i] == '\n') {
                yOffset++;
                xOffset = x;
            }
            xOffset++;
        }*/
    }
}