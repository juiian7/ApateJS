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

        this.prism = await World.Model.loadObj("assets/prism.obj");
        this.prism.transform.position.add(Vec.from(0, 0, -80));
        this.prism.transform.scale.add(Vec.from(25, 25, 25));
        this.scene.add(this.prism);

        this.scene.camera.projection = orthographic(0, 320, 180, 0, -100, 100);
        this.scene.camera.transform.move(-160, -90, 0);
        //this.scene.camera.projection = orthographic(-160, 160, 90, -90, -100, 100);
        //this.scene.camera.transform.position = Vec.from(-10, -10, 0);

        this.renderer.clearColor(Vec.fromHex(0x000000ff));

        this.player = new Player(this.scene);

        this.currentRoom = Room.load("");
        this.scene.add(this.currentRoom);
    }

    onDied() {}
    onRoomExit() {}

    update(): void {
        this.counter -= this.delta;
        this.renderer.clear();

        this.prism.transform.rotation.y += (0.6 * this.delta) / 1000;

        if (this.counter <= 0) {
            /* `Uptime: ${this.time / 1000}s, ` + */
            let info = `Fps: ${this.renderer.stats.fps}, Draw calls: ${this.renderer.stats.drawCalls}`;

            console.log(info);

            this.counter = 1000;
        }
    }
}
new Game({ screen: { canvas, autoResize: true } });
