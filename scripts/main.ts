import { orthographic } from "../engine/core/Matrix.js";
import Apate, { World, Tile, Vec } from "../engine/index.js";

import Player from "./Player.js";
import Room from "./Room.js";

const canvas = document.querySelector("canvas");
canvas.width = 320;
canvas.height = 180;

const tiles = document.querySelector("#tiles");

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

        this.prism = await World.Model.loadObj("assets/suzanne_smooth_3.obj");

        this.scene.add(this.prism);
        //this.prism.transform.position.add(Vec.from(160, 90, 0));
        this.prism.transform.scale.add(Vec.from(25, 25, 25));

        this.scene.camera.projection = orthographic(0, 320, 180, 0, -100, 100);
        this.scene.camera.transform.move(-160, -90, 0);

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

        if (this.counter <= 0) {
            console.log("Counter reached 0 -> setting to 60");
            this.counter = 60;
        }
    }
}
new Game({ screen: { canvas, autoResize: true } });
