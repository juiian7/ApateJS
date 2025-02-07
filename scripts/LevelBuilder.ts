import Apate, { Tile, Transform, Vec, World } from "../engine/index.js";
import { Sprite, SpriteBatch } from "../engine/scene/index.js";

const cursor = Tile.fromImage(document.querySelector("#cursor"));
const tiles = Tile.fromImage(document.querySelector("#tiles")).grid(8, 8);

export default class LevelBuilder extends World.Obj {
    private cursor: Sprite;

    private select: TileSelect;

    constructor() {
        super(undefined, "Level Builder");

        this.select = new TileSelect(tiles.flat(), this);

        this.cursor = new Sprite(cursor, this, "Cursor");
        this.cursor.transform.position.z = -10;

        //this.cursor.layer = 10;

        this.cursor.transform.scale.x = 4;
        this.cursor.transform.scale.y = 4;
    }

    public update(engine: Apate): void {
        // engine.input
        let m = engine.input.mouse();

        let x = ((2 * (m.x / engine.renderer.canvas.clientWidth) - 1) * 320) / 2;
        let y = ((1 - 2 * (m.y / engine.renderer.canvas.clientHeight)) * 180) / 2;

        x = Math.round(x);
        y = Math.round(y);

        /* x = Math.floor(x / 8) * 8;
        y = Math.floor(y / 8) * 8; */

        this.cursor.transform.position.x = x;
        this.cursor.transform.position.y = y - this.cursor.transform.scale.y;

        if (engine.input.key("Space")) {
            // draw tile select
        }
    }
}

class TileSelect extends World.Obj {
    private batches: World.SpriteBatch[] = [];

    constructor(tiles: Tile[], parent: World.Obj) {
        super(parent, "Tile Select");

        let overlay = new Sprite(Tile.fromColor(Vec.fromHex(0x000000ff, 8)), this, "Overlay");
        overlay.transform.scale = Vec.from(320, 180);
        overlay.transform.position = Vec.from(-160, -90, -10);

        let offset = 0;
        let y = 0;
        let gap = 2;
        for (let i = 0; i < tiles.length; i++) {
            let sprites = this.batches.find((b) => b.material.atlas.texture == tiles[i].texture);
            if (!sprites) {
                sprites = new World.SpriteBatch(tiles[i], tiles.length, this);
                this.batches.push(sprites);
            }
            let transform = new Transform(offset, y);
            transform.scale = Vec.from(tiles[i].clip.z, tiles[i].clip.w);
            sprites.batch(tiles[i], transform);
            offset += tiles[i].clip.z + gap;
            if ((i + 1) % 9 == 0) {
                y -= tiles[i].clip.w + gap;
                offset = 0;
            }
        }
    }

    tile(pos: Vec): Tile {
        for (let i = 0; i < this.batches.length; i++) {
            for (let j = 0; j < this.batches[i].transforms.length; j++) {
                let { x, y } = this.batches[i].transforms[j].position;
                let { x: w, y: h } = this.batches[i].transforms[j].scale;
                if (pos.x > x && pos.x < x + w && pos.y > y && pos.y < y + h) return this.batches[i].tiles[j];
            }
        }
    }
}
