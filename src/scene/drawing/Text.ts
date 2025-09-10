import { Apate } from "../../Apate.js";
import { Tile } from "../../core/Tile.js";
import { Transform } from "../../core/Transform.js";
import { Vec4 } from "../../core/Vec4.js";
import { Texture } from "../../graphics/Texture.js";
import { Obj } from "../Obj.js";
import { SpriteBatch } from "./SpriteBatch.js";

const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const chars = abc + abc.toLowerCase() + "1234567890" + ":!\"§$%&/()[]<>{}=?'.,";
const defaultFont = createBitFont(chars, "2rem", "monospace");

export interface BitFont {
    [char: string]: Tile;
}

export class Text<E extends Apate = Apate> extends Obj<E> {
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
        let x = 0;
        let y = 0;
        for (let i = 0; i < chars.length; i++) {
            if (chars[i] == " ") {
                x++;
                continue;
            } else if (chars[i] == "\n") {
                y++;
                x = 0;
            } else if (this.font[chars[i]]) {
                this.sprites.batch(
                    this.font[chars[i]],
                    new Transform(this.transform, x * spaceBetween, -y * 2).scale(
                        1,
                        this.font[chars[i]].clip.w / this.font[chars[i]].clip.z
                    )
                );
                x++;
            }
        }
        return this;
    }

    center(pos: Vec4) {
        let sortedX = this.sprites.transforms.map((t) => t.position).sort((a, b) => b.x - a.x);
        this.transform.position.x = pos.x - (sortedX[0].x * this.transform.size.x) / 2;
        this.transform.position.y = pos.y - this.transform.size.y / 2;
        return this;
    }
}

export function createBitFont(charset: string, size: string, family: string): BitFont {
    const cssFont = size + " " + family;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = cssFont;
    let metrics = ctx.measureText(charset);
    const ratio = window.devicePixelRatio;
    canvas.width = metrics.width * ratio;
    canvas.height = (metrics.emHeightAscent + metrics.emHeightDescent) * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.font = cssFont;
    ctx.fillStyle = "white";
    ctx.textBaseline = "hanging";
    ctx.fillText(charset, 0, metrics.emHeightDescent);

    document.body.append(canvas);

    const text = Texture.fromSource(canvas);
    const font = {};
    let x = 0;
    for (const c of charset) {
        let m = ctx.measureText(c);
        font[c] = new Tile(text, Vec4.from(x, 0, m.width * ratio, canvas.height));
        x += m.width * ratio;
    }
    return font;
}
