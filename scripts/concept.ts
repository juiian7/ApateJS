import Apate, { Tile, Vec, World } from "../engine/index.js";

import { loadObj } from "../engine/scene/drawing/Model.js";

const tilesImg = document.querySelector("#tiles") as HTMLImageElement;

class Game extends Apate {
    public async init(): Promise<void> {
        // Sprite (one color)
        let tile = Tile.fromColor(Vec.from(0xffff00ff));
        new World.Sprite(tile, this.scene);

        // Sprite (img)
        let tiles = Tile.fromImage(tilesImg).grid(8, 8);
        new World.Sprite(tiles[0][0], this.scene);

        let model = loadObj("assets/prism.obj");
        this.scene.add(model);

        // show in inspector
    }

    public update(): void {
        // call through inspector (possible to change ticks)
    }
}
