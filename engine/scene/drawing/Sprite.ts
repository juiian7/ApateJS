import Obj from "../Obj.js";

import Tile from "../../core/Tile.js";
import Vec from "../../core/Vec.js";

import Context from "../../graphics/Context.js";
import { SpriteMaterial } from "../../graphics/Material.js";

export default class Sprite extends Obj {
    public material: SpriteMaterial = new SpriteMaterial();

    public get tile(): Tile {
        return this.material.tile;
    }

    public set tile(value: Tile) {
        this.material.tile = value;
    }

    constructor(tile?: Tile, parent?: Obj, name?: string) {
        super(parent, name);

        if (!tile) tile = Tile.fromColor(Vec.fromHex(0xff00ffff));
        this.tile = tile;
    }

    fromTexture() {}

    public draw(context: Context): void {
        context.drawTile(this.absolutTransform(), this.material.tile, this.material);
    }
}
