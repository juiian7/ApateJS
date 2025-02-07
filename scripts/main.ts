import { identity, inverse, orthographic, screenToWorld, translation, worldToScreen } from "../engine/core/Matrix.js";
import Transform from "../engine/core/Transform.js";
import Apate, { World, Tile, Vec, Mat } from "../engine/index.js";

import Player from "./Player.js";
import Room from "./Room.js";
import LevelBuilder from "./LevelBuilder.js";

const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerWidth / (16 / 9);

canvas.addEventListener("dblclick", () => {
    canvas.requestFullscreen();
});

const tilesImg = document.querySelector("#tiles") as HTMLImageElement;
const tiles = Tile.fromImage(tilesImg).grid(8, 8);

class Game extends Apate {
    counter: number = 0;

    player: Player;
    currentRoom: Room;

    // builder: LevelBuilder;

    prism: World.Model;
    mouse: Vec = Vec.from(0, 0, 0, 0);

    async init(): Promise<void> {
        // load assets
        console.log(this);

        // init game

        let camera = World.Camera.ortho(320, 180, "center");
        //camera.transform.move(-160, -90, 0);
        camera.bgColor = Vec.fromHex(0xabcdefff);
        this.context.cameras[0] = camera; // overwrite default

        //this.scene = new LevelBuilder();

        const sprite = new World.Sprite(tiles[0][0], this.scene, "test");
        sprite.transform.size(40, 40);
        sprite.transform.move(0, 0, -10);

        let size = { w: 32, h: 64 };
        let pixelated = new World.Viewport(size.w, size.h, this.scene, "Pixelate");
        pixelated.layer = 2;
        pixelated.camera.projection = orthographic(-size.w / 2, size.w / 2, -size.h / 2, size.h / 2, -100, 100);
        //pixelated.texture.setParameters({ min: "nearest", mag: "nearest" });

        this.prism = await World.Model.loadObj("assets/prism.obj");
        this.prism.transform.scale.add(Vec.from(15, 15, 15));
        pixelated.add(this.prism);
        //this.scene.add(this.prism);

        // register events (dead, room_exit, ...)

        // start logic
        // this.currentRoom = Room.load("");
        // this.scene.add(this.currentRoom);

        /* let mPos = null;
        this.renderer.canvas.onmousedown = (ev) => (mPos = { x: ev.clientX, y: ev.clientY });
        this.renderer.canvas.onmouseup = (ev) => (mPos = null);

        this.renderer.canvas.addEventListener("mousemove", (ev) => {
            if (mPos) {
                let x = (mPos.x - ev.clientX) / 1;
                let y = (mPos.y - ev.clientY) / 1;
                mPos.x = ev.clientX;
                mPos.y = ev.clientY;

                this.mouse.x = x;
                this.mouse.y = y;

                this.prism.transform.rotate(y, x, 0);
            }

            this.mouse.z = ev.clientX;
            this.mouse.w = ev.clientY;
        }); */
        //this.player = new Player(this.scene);

        console.dir(this.scene);
    }

    onDied() {}
    onRoomExit() {}

    update(): void {
        // this.builder.update(this);

        this.counter -= this.delta;
        this.context.clear();

        this.prism.transform.rotation.y += (0.6 * this.delta) / 1000;

        /* let x = ((2 * (this.mouse.z / canvas.clientWidth) - 1) * 320) / 2;
        let y = ((1 - 2 * (this.mouse.w / canvas.clientHeight)) * 180) / 2;

        x = Math.round(x / 8) * 8;
        y = Math.round(y / 8) * 8;

        this.player.transform.position.x = x - 4;
        this.player.transform.position.y = y - 4; */

        //this.player.update(this.delta, this.input);
        //(this.scene as LevelBuilder).update(this);

        if (this.counter <= 0) {
            /* `Uptime: ${this.time / 1000}s, ` + */
            let info = `Fps: ${this.renderer.stats.fps}, Draw calls: ${this.renderer.stats.drawCalls}`;

            console.log(info);

            this.counter = 1000;
        }
    }

    loadScene(scene: World.Viewport) {
        this.scene = scene;
    }
}
new Game({ screen: { canvas, autoResize: true } });
