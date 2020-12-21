//
/**
 * @typedef {import("../utility/color.js").IColor} IColor
 * @typedef {import("../utility/vector.js").IVector} IVector
 */
/*
import Vector from "../utility/vector.js";
import Color, {
    rgbToHex
} from "../utility/color.js";
*/

/**
 * @typedef ScreenConfig 
 * @property {string} selector
 * @property {number} width
 * @property {number} height
 * @property {number} scale
 * @property {number} numberOfLayers
 * @property {number} refreshSpeed used for engine
 * @property {bool} cleanUpScreen used for engine
 */

/**
 * @type {ScreenConfig}
 */
const defaultConfig = {
    selector: '#screen',
    width: 128,
    height: 128,
    scale: 4,
    numberOfLayers: 1,
    refreshSpeed: 30,
    cleanUpScreen: false
}

/**
 * @typedef {Object} Screen
 */
export default class PixelScreen {
    /**
     * @param {ScreenConfig?} screenConfig
     */
    constructor(screenConfig) {
        this.screenConfig = {
            ...defaultConfig,
            ...screenConfig
        };
        const parentElement = document.querySelector(this.screenConfig.selector);

        this.canvases = [];
        this.contexts = [];

        for (let l = 0; l < this.screenConfig.numberOfLayers; l++) {

            let canvas = document.createElement('canvas');
            canvas.width = this.screenConfig.width * this.screenConfig.scale;
            canvas.height = this.screenConfig.height * this.screenConfig.scale;
            canvas.style.zIndex = l;
            canvas.style.position = 'absolute';

            let context = canvas.getContext('2d');
            parentElement.appendChild(canvas);

            this.canvases.push(canvas);
            this.contexts.push(context);
        }


        this.clearScreen();
    }

    clearScreen() {
        for (let l = 0; l < this.contexts.length; l++) {
            this.contexts[l].clearRect(0, 0, this.canvases[l].width, this.canvases[l].height);
        }
    }

    flushLayer(layer, color) {
        this.contexts[layer].fillStyle = color;
        this.contexts[layer].fillRect(0, 0, this.canvases[layer].width, this.canvases[layer].height);
    }

    clearLayer(layer){
        this.contexts[layer].clearRect(0, 0, this.canvases[layer].width, this.canvases[layer].height);
    }

    /**
     * @param {number} x x-coord
     * @param {number} y y-coord
     * @param {string} c color as hex code 
     * @param {number?} layer which layer to draw 
     */
    pixel(x, y, c, layer) {
        this.contexts[layer].fillStyle = c;
        this.contexts[layer].fillRect(x * this.screenConfig.scale, y * this.screenConfig.scale, this.screenConfig.scale, this.screenConfig.scale);
    }

    /**
     * @param {number} x x-coord
     * @param {number} y y-coord
     * @param {number} scale scale of the sprite
     * @param {any} spriteObj sprite format: [{x,y,hex},...]
     * @param {number?} layer which layer to draw 
     */
    pixelSprite(x, y, scale, spriteObj, layer) {
        //scale *= this.screenConfig.scale
        for (let i = 0; i < spriteObj.length; i++) {
            this.contexts[layer].fillStyle = spriteObj[i].c;
            this.contexts[layer].fillRect(((x + spriteObj[i].x) * scale) * this.screenConfig.scale,(y + spriteObj[i].y) * ( scale * this.screenConfig.scale), scale * this.screenConfig.scale, scale * this.screenConfig.scale);
        }
    }
}