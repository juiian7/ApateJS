import { Context, Tile, Transform, Vec, World } from "../engine/index.js";
import { SpriteBatch } from "../engine/scene/index.js";

export default class Tilemap extends World.SpriteBatch {
    private size: Vec;
    private tileSize: Vec;

    constructor(tile: Tile, size: Vec, tileSize: Vec, parent?: World.Obj, name?: string) {
        super(tile, size.x * size.y, parent, name);

        this.size = size;
        this.tileSize = tileSize;

        this.transform.scale.x = tileSize.x;
        this.transform.scale.y = tileSize.y;
    }

    tile(tile: Tile, offset: Vec) {
        if (tile.texture != this.material.atlas.texture) throw new Error("Tiles need to be on the same texture!");

        // check if offset inside width & height

        this.batch(tile, new Transform(offset.x * this.tileSize.x, offset.y * this.tileSize.y, offset.z));
    }
}
