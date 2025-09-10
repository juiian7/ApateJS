import { Obj } from "../Obj.js";
import { Apate } from "../../Apate.js";
import { SpriteBatch } from "./SpriteBatch.js";

import { Tile } from "../../core/Tile.js";
import { Transform } from "../../core/Transform.js";
import { Vec4 } from "../../core/Vec4.js";

class TileGroup<E extends Apate = Apate> extends Obj<E> {
    public batches: SpriteBatch[] = [];

    constructor(parent?: Obj, name?: string) {
        super(parent, name);
    }

    tile(tile: Tile, transform: Transform, batchSize?: number): Transform;
    tile(tile: Tile, translation: Vec4, batchSize?: number): Transform;
    tile(...args: any[]): Transform {
        let sprites = this.batches.find((b) => b.material.atlas.texture == args[0].texture);
        if (!sprites) {
            sprites = new SpriteBatch(args[0], args[2] || 32, this);
            this.batches.push(sprites);
        }
        if (args[1] instanceof Vec4) args[1] = new Transform(sprites.transform, args[1].x, args[1].y, args[1].z);

        return sprites.batch(args[0], args[1]);
    }
}

export { TileGroup };
