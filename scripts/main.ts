import { orthographic } from "../engine/core/Matrix.js";
import Transform from "../engine/core/Transform.js";
import Apate, { World, Tile, Vec, Mat } from "../engine/index.js";

import Player from "./Player.js";
import Room from "./Room.js";

const canvas = document.querySelector("canvas");
canvas.width = 320;
canvas.height = 180;

const tilesImg = document.querySelector("#tiles") as HTMLImageElement;
const tiles = Tile.fromImage(tilesImg).grid(8, 8);

class Game extends Apate {
    counter: number = 0;

    player: Player;
    currentRoom: Room;

    prism: World.Model;
    mouse: Vec = Vec.from(0, 0, 0);

    sb: World.SpriteBatch;

    async init(): Promise<void> {
        // load assets
        console.log(this);

        // register events (dead, room_exit, ...)

        let mPos = null;
        this.renderer.canvas.onmousedown = (ev) => (mPos = { x: ev.clientX, y: ev.clientY });
        this.renderer.canvas.onmouseup = (ev) => (mPos = null);

        this.renderer.canvas.addEventListener("mousemove", (ev) => {
            if (mPos) {
                let x = (mPos.x - ev.clientX) / 1;
                let y = (mPos.y - ev.clientY) / 1;

                mPos.x = ev.clientX;
                mPos.y = ev.clientY;

                this.prism.transform.rotate(y, x, 0);
            }
        });

        /* this.prism = await World.Model.loadObj("assets/local/suzanne_smooth_3.obj");
        let mat = new Mat.Default3DMaterial();
        mat.texture = Tile.fromImage(tilesImg);
        this.prism.material = mat;

        this.scene.add(this.prism);
        this.prism.transform.position.add(Vec.from(0, 0, -80));
        this.prism.transform.scale.add(Vec.from(25, 25, 25)); */

        this.scene.camera.projection = orthographic(0, 320, 180, 0, -100, 100);
        this.scene.camera.transform.move(-160, -90, 0);

        this.sb = new World.SpriteBatch(tiles[0][0], 100);
        this.sb.transform.scale = Vec.from(8, 8, 1);

        this.scene.add(this.sb);

        this.sb.batch(tiles[0][5], new Transform(0, 0, 0));
        //this.sb.batch(tiles[1][1], new Transform(0, -8, 0));

        //for (let i = 0; i < 100; i++) this.sb.batch(tiles[0][0], new Transform());

        //this.scene.camera.projection = orthographic(-160, 160, 90, -90, -100, 100);
        //this.scene.camera.transform.position = Vec.from(-10, -10, 0);

        this.player = new Player(this.scene);

        this.renderer.clearColor(Vec.from(0x000000ff));

        this.currentRoom = Room.load("");
        this.scene.add(this.currentRoom);
    }

    onDied() {}
    onRoomExit() {}

    update(): void {
        this.counter--;
        this.renderer.clear();

        //this.prism.transform.rotation.setTo(this.mouse).divide(10);
        /* for (let i = 0; i < this.sb.transforms.length; i++) {
            this.sb.tiles[i] = tiles[i % 5][i % 4];
            this.sb.transforms[i].move((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, 0);
        } */
        this.sb.sync();

        if (this.counter <= 0) {
            console.log("Counter reached 0 -> setting to 60");
            this.counter = 60;
        }
    }
}
new Game({ screen: { canvas, autoResize: true } });
