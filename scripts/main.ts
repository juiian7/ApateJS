import Apate, { World } from "../engine/index.js";
import Renderer from "../engine/graphics/webgl2/Renderer.js";

import Player from "./Player.js";
import Room from "./Room.js";

const canvas = document.querySelector("canvas");

class Game extends Apate {
    counter: number = 0;

    player: Player;
    currentRoom: Room;

    async init(): Promise<void> {
        // load assets
        console.log(this);

        // register events (dead, room_exit, ...)

        this.player = new Player(this.scene);

        this.currentRoom = Room.load("");
        this.scene.add(this.currentRoom);
    }

    onDied() {}
    onRoomExit() {}

    update(): void {
        this.counter--;

        if (this.counter <= 0) {
            console.log("Counter reached 0 -> setting to 60");
            this.counter = 60;
        }
    }
}
new Game({ screen: { canvas, autoResize: true } });
