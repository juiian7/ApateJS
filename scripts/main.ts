import Apate, { World, Tile, Vec } from "../engine/index.js";

import Player from "./Player.js";
import Room from "./Room.js";

const canvas = document.querySelector("canvas");

const tiles = document.querySelector("#tiles");

class Game extends Apate {
    counter: number = 0;

    player: Player;
    currentRoom: Room;

    async init(): Promise<void> {
        // load assets
        console.log(this);

        // register events (dead, room_exit, ...)

        let prism = await (await fetch("assets/prism.obj")).text();
        let model = await World.Model.loadObj("assets/prism.obj");
        console.log(model);

        this.scene.add(model);

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

        if (this.counter <= 0) {
            console.log("Counter reached 0 -> setting to 60");
            this.counter = 60;
        }
    }
}
new Game({ screen: { canvas, autoResize: true } });
