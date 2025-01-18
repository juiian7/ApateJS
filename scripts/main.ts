import Apate from "../engine/index.js";

const canvas = document.querySelector("canvas");

class Game extends Apate {
    counter: number = 0;

    async init(): Promise<void> {
        this.counter = 60;
    }

    update(): void {
        this.counter--;

        if (this.counter <= 0) {
            console.log("Counter reached 0 -> setting to 60");
            this.counter = 60;
        }
    }
}
new Game({ screen: { canvas, autoResize: true } });
