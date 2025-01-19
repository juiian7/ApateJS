import Obj from "../Obj.js";

import Tile from "../../core/Tile.js";
import Vec from "../../core/Vec.js";

import Context from "../../graphics/Context.js";

export default class Sprite extends Obj {
    public tile: Tile;

    constructor(tile?: Tile, parent?: Obj, name?: string) {
        super(parent, name);

        if (!tile) tile = Tile.fromColor(Vec.from(0xff00ffff));
        this.tile = tile;
    }

    fromTexture() {}

    public render(context: Context): void {
        // sprite rendering
        context.drawTile(this.tile);
    }
}
