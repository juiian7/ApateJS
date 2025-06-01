import { Vec4 } from "./Vec4.js";

/**
 *
 */
class Color {
    private data: number[];

    public constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 255) {
        this.data = [r, g, b, a];
    }

    public static fromRGBA(r: number = 0, g: number = 0, b: number = 0, a: number = 255) {
        return new Color(r, g, b, a);
    }

    /**
     * Creates a Vec4 object from a given css hex string. Typically used for specifying hex colors.
     *
     * @static
     * @param {string} hex - The value of the vector, formatted like a css hex string
     * @returns {Core.Vec4} - The created vector
     */
    public static fromHexStr(hex: string): Color {
        return hexToRgba(hex);
    }

    /**
     * Creates a Vec4 object from a given number. Typically used for specifying hex colors.
     *
     * @param {number} num - The value of the vector, formatted in a single number (see hex colors -> 0xff00ff)
     * @param {number} bit - The number of bits per component
     * @returns {Core.Vec4} - The created vector
     *
     */
    public static fromHex(hex: number, bit: number = 8): Color {
        const c = Vec4.fromNum(hex, bit).vec();
        return new Color(c[0], c[1], c[2], c[3]);
    }

    /**
     * Gets the array of components behind the vector after normalizing colors bigger than 1 by dividing them with 255.
     *
     * @returns {number[]} The normalized array of components
     */
    public color(): number[] {
        if (this.r > 1 || this.g > 1 || this.b > 1 || this.a > 1) {
            (this.data[0] /= 255), (this.data[1] /= 255), (this.data[2] /= 255), (this.data[3] /= 255);
        }
        return this.data;
    }

    /**
     * The "r" channel value of the color.
     * @type {number}
     */
    public get r(): number {
        return this.data[0];
    }
    /**
     * The "g" channel value of the color.
     * @type {number}
     */
    public get g(): number {
        return this.data[1];
    }
    /**
     * The "b" channel value of the color.
     * @type {number}
     */
    public get b(): number {
        return this.data[2];
    }
    /**
     * The "a" channel value of the color.
     * @type {number}
     */
    public get a(): number {
        return this.data[3];
    }

    public set r(v: number) {
        this.data[0] = v;
    }
    public set g(v: number) {
        this.data[1] = v;
    }
    public set b(v: number) {
        this.data[2] = v;
    }
    public set a(v: number) {
        this.data[3] = v;
    }
}
export { Color };

function hexToRgba(hex: string): Color {
    if (!hex.startsWith("#")) throw new Error("Hex strings need to start with a leading #");
    hex = hex.substring(1);

    let v = new Color();
    v.a = 255;

    if (hex.length === 3) {
        // #f0f-
        v.r = parseInt(hex[0], 16) * 32;
        v.g = parseInt(hex[1], 16) * 32;
        v.b = parseInt(hex[2], 16) * 32;
    } else if (hex.length === 4) {
        // #f0ff
        v.r = parseInt(hex[0], 16) * 32;
        v.g = parseInt(hex[1], 16) * 32;
        v.b = parseInt(hex[2], 16) * 32;
        v.a = parseInt(hex[3], 16) * 32;
    } else if (hex.length === 6) {
        // #ff00ff--
        v.r = parseInt(hex.slice(0, 2), 16);
        v.g = parseInt(hex.slice(2, 4), 16);
        v.b = parseInt(hex.slice(4, 6), 16);
    } else if (hex.length === 8) {
        // #ff00ffff
        v.r = parseInt(hex.slice(0, 2), 16);
        v.g = parseInt(hex.slice(2, 4), 16);
        v.b = parseInt(hex.slice(4, 6), 16);
        v.a = parseInt(hex.slice(6, 8), 16);
    } else {
        throw new Error("Invalid hex color format");
    }
    return v;
}
