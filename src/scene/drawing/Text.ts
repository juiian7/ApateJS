import Apate from "../../Apate.js";
import Tile from "../../core/Tile.js";
import Transform from "../../core/Transform.js";
import Vec from "../../core/Vec.js";
import Texture from "../../graphics/Texture.js";
import Obj from "../Obj.js";
import SpriteBatch from "./SpriteBatch.js";

const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const chars = abc + abc.toLowerCase() + "1234567890" + ":!\"§$%&/()[]<>{}=?'";
const defaultFont = createBitFont(chars, "40px", "monospace");

export interface BitFont {
    [char: string]: Tile;
}

export default class Text<E extends Apate = Apate> extends Obj<E> {
    public async loadBitFont(path: string): Promise<BitFont> {
        return {};
    }

    public sprites: SpriteBatch;

    private _spaceWidth: number;
    private _font: BitFont;
    public set font(v: BitFont) {
        let tile = Object.values(v)[0];
        if (!tile) throw new Error("Can't use empty font");
        this.sprites.material.atlas = tile;
        this._font = v;
        this._spaceWidth = tile.clip.z;
    }
    public get font(): BitFont {
        return this._font;
    }
    constructor(font?: BitFont, parent?: Obj, name?: string) {
        super(parent, name);

        if (!font) font = defaultFont;

        this.sprites = new SpriteBatch(undefined, 256, this, name ? name + "-batch" : undefined);
        this.font = font;
    }

    text(t: string, spaceBetween: number = 1) {
        this.sprites.clear();

        let chars = t.split("");
        for (let i = 0; i < chars.length; i++) {
            if (chars[i] == " ") continue;

            if (this.font[chars[i]])
                this.sprites.batch(
                    this.font[chars[i]],
                    new Transform(i * spaceBetween, 0).size(1, this.font[chars[i]].clip.w / this.font[chars[i]].clip.z)
                );
        }
        return this;
    }

    center(pos: Vec) {
        let sortedX = this.sprites.transforms.map((t) => t.position).sort((a, b) => b.x - a.x);
        this.transform.position.x = pos.x - (sortedX[0].x * this.transform.scale.x) / 2;
        this.transform.position.y = pos.y - this.transform.scale.y / 2;
        return this;
    }
}

export function createBitFont(charset: string, size: string = "40px", family: string = "monospace"): BitFont {
    const cssFont = size + " " + family;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = cssFont;
    let metrics = ctx.measureText(chars);
    canvas.width = metrics.width;
    canvas.height = metrics.emHeightAscent + metrics.emHeightDescent;
    ctx.font = cssFont;
    ctx.fillStyle = "white";
    ctx.textBaseline = "hanging";
    ctx.fillText(chars, 0, metrics.emHeightDescent);

    const text = Texture.fromSource(canvas);
    const font = {};
    let x = 0;
    for (const c of chars) {
        let m = ctx.measureText(c);
        font[c] = new Tile(text, Vec.from(x, 0, m.width, canvas.height));
        x += m.width;
    }
    return font;
}
