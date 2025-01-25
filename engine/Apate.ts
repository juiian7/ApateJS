import Context from "./graphics/Context.js";
import Renderer from "./graphics/webgl2/Renderer.js";

import { Viewport } from "./scene/index.js";

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
    public scene: Viewport;

    public startTime: number;
    public time: number = 0;
    private last: number = 0;
    public delta: number = 20;

    constructor(config?: EngineConfig) {
        this.startTime = Date.now();

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
        this.scene = new Viewport(null, "Default Viewport");
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
        this.time = Date.now() - this.startTime;
        this.delta = this.time - this.last;

        // update
        this.update();

        // rendering
        this.renderer.begin(this.delta);
        this.context.drawViewport(this.scene);
        this.renderer.flush();

        // - do timings
        this.last = this.time;
        window.requestAnimationFrame(this._loop);
    }

    public async init() {}

    public update() {}
}
