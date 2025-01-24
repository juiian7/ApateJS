import Context from "./graphics/Context.js";
import Renderer from "./graphics/webgl2/Renderer.js";

import { Scene } from "./scene/index.js";

interface EngineConfig {
    screen?: ScreenConfig;
}

interface ScreenConfig {
    canvas?: HTMLCanvasElement;
    // filter style
    autoResize?: boolean;
    width?: number;
    height?: number;
}

const defaultConfig: EngineConfig = {};
const defaultScreenConfig: ScreenConfig = { autoResize: true, width: 640, height: 360 };

export default class Apate {
    public renderer: Renderer;
    public context: Context;
    public scene: Scene;

    public delta: number = 20;

    constructor(config?: EngineConfig) {
        // initialization
        if (!config) config = defaultConfig;

        if (!config.screen?.canvas) {
            if (!config.screen) config.screen = { ...defaultScreenConfig };

            // create canvas
            config.screen.canvas = document.createElement("canvas");
            if (config.screen.width) config.screen.canvas.width = config.screen.width;
            if (config.screen.height) config.screen.canvas.height = config.screen.height;
            document.body.appendChild(config.screen.canvas);
        }

        this.renderer = new Renderer(config.screen.canvas);
        this.scene = new Scene(null, "Default");
        this.context = new Context(this);

        // run after constructor
        this._init = this._init.bind(this);
        this._loop = this._loop.bind(this);

        setTimeout(this._init, 0);
    }

    /** Internal init only (do not overwrite) */
    private async _init() {
        // - do engine init
        // - do user init
        await this.init();

        // - start game loop
        this._loop();
    }

    private _loop() {
        // - do timings

        // update
        this.update();

        // rendering
        this.renderer.begin();
        this.context.drawScene(this.scene);
        this.renderer.flush();

        // - do timings
        window.requestAnimationFrame(this._loop);
    }

    public async init() {}

    public update() {}
}
