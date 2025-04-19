import Input from "./core/Input.js";
import Physics from "./core/Physics.js";

import Context from "./graphics/Context.js";
import Renderer from "./graphics/webgl2/Renderer.js";

import { Camera, Viewport } from "./scene/index.js";
import Obj, { Drawable } from "./scene/Obj.js";

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

    public input: Input;
    public physics: Physics;

    private _scene: Obj;
    public set scene(v: Obj) {
        if (this._scene) this._scene.recCall("on_scene_exit", this);
        this._scene = v;
        this._scene.recCall("on_scene_enter", this);
    }

    public get scene(): Obj {
        return this._scene;
    }

    public startTime: number;
    public time: number = 0;
    private last: number = 0;
    public delta: number = 20;

    public debug: boolean = true;

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
        this.scene = new Obj(null, "Default Scene");
        this.context = new Context(this);
        let camera = Camera.perspective(this.renderer.canvas.width, this.renderer.canvas.height);
        camera.name = "Default Camera";
        camera.transform.move(0, 0, 1);
        this.context.pushCamera(camera);

        this.input = new Input(this.renderer.canvas);
        this.physics = new Physics();

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
        this._scene.render(this.context);
        this.renderer.flush();

        // - do timings
        this.last = this.time;
        window.requestAnimationFrame(this._loop);
    }

    public async init() {}

    public update() {}
}
