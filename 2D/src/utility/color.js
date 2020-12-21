//
/**
 * @typedef IColor
 * @property {number} r
 * @property {number} g
 * @property {number} b
 */

export default class Color {
    /**
     * @param {number} r 0-255
     * @param {number} g 0-255
     * @param {number} b 0-255
     */
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    get HEX() {
        return rgbToHex(this.r, this.g, this.b);
    }
    
    set HEX(hex) {
        this.RGB = hexToRgb(hex)
    }
    /**
     * @param {{r:number,g:number,b:number}}
     */
    set RGB({ r, g, b }) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}

/**
 * @param {string} c
 */
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
/**
 * @param {number} r
 * @param {number} g
 * @param {number} b
 */
export function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
/**
 * @param {string} hex
 */
export function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}