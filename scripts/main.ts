import Apate, { World } from "../engine/index.js";
import Renderer from "../engine/graphics/webgl2/Renderer.js";

const canvas = document.querySelector("canvas");

class Test extends World.Obj {
    public render(renderer: Renderer): void {
        renderer.clear();
    }
}

class Game extends Apate {
    counter: number = 0;

    async init(): Promise<void> {
        // load assets
        this.counter = 60;

        console.log(this);
        this.scene.add(new Test());
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
