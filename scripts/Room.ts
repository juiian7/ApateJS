import { Tile, Vec, World } from "../engine/index.js";

import Tilemap from "./Tilemap.js";

const tilesImg = document.querySelector("#tiles") as HTMLImageElement;
const tiles = Tile.fromImage(tilesImg).grid(8, 8);

export default class Room extends World.Obj {
    private tilemap: Tilemap;

    constructor(data: any, parent?: World.Obj) {
        super(parent, data._room_name);

        this.tilemap = new Tilemap(tiles[0][0], Vec.from(32 * 1, 18 * 1), Vec.from(8, 8), this, data.name);

        // load tilemap by data
        this.tilemap.tile(tiles[0][0], Vec.from(0, 0, 0));
        this.tilemap.tile(tiles[0][0], Vec.from(1, 0, 0));
        this.tilemap.tile(tiles[0][0], Vec.from(1, 1, 0));
    }

    public static load(args: any): Room {
        // get room data from args
        let data = { _room_name: "Demo" };
        return new Room(data);
    }
}
