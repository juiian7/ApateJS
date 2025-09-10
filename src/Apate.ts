import { Color } from "./core/Color.js";
import { Input } from "./core/Input.js";
import { screenToWorld, inverse } from "./core/Matrix.js";
import { Physics } from "./core/Physics.js";
import { Vec4 } from "./core/Vec4.js";

import { Context } from "./graphics/Context.js";
import { Renderer } from "./graphics/webgl2/Renderer.js";

import { Camera, Viewport } from "./scene/index.js";
import { Obj } from "./scene/Obj.js";
import * as UI from "./ui/concept/index.js";

interface EngineConfig {
    screen?: ScreenConfig;
}

interface ScreenConfig {
    canvas?: HTMLCanvasElement;
    // filter style
    autoResize?: boolean;
    screenAspect?: number;
    size?: {
        width: number;
        height: number;
    };
}

const defaultConfig: EngineConfig = {};
const defaultScreenConfig: ScreenConfig = { autoResize: true, size: { width: 640, height: 360 } };

/**
 * This class is the entry point of the engine.
 * It handles the engines initialization, asynchronous content loading and executes the game loop
 *
 * @example
 * import Apate, { {@link World} } from "<apate>/index.js";
 *
 * class Game extends Apate {
 *     sprite;
 *
 *     async init() {
 *         // load content required for running the game
 *         const tile = {@link Core.Tile | Tile}.{@link Core.Tile.fromImage | fromImage}(<img>);
 *         this.sprite = new {@link World.Sprite}(tile, this.scene, "My first sprite");
 *     }
 *
 *     update() {
 *         // gets called every frame before the drawing is done
 *         sprite.transform.rotate(0, 0.1, 0);
 *     }
 * }
 * new Game();
 */
export class Apate {
    /**
     * The instance of the current renderer (only webgl2 is supported for now)
     * @type {Renderer}
     */
    public renderer: Renderer;

    /**
     * The context for draw operations
     * @type {Context}
     */
    public context: Context;

    public input: Input;
    public physics: Physics;

    private _scene: Obj;

    /**
     * This is the currently active scene.
     * The object and all children will be drawn when they are in the active scene
     *
     * @type {Obj}
     */
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

    public autoResize: boolean = false;
    public screenAspect: number = 0;

    public debug: boolean = true;
    public inspector: boolean = true;

    private uiContext: UI.Context;

    constructor(config?: EngineConfig) {
        this.startTime = Date.now();

        // initialization
        if (!config) config = defaultConfig;

        if (!config.screen?.canvas) {
            if (!config.screen) config.screen = { ...defaultScreenConfig };

            // create canvas
            config.screen.canvas = document.createElement("canvas");
            if (config.screen.size) {
                config.screen.canvas.width = config.screen.size.width;
                config.screen.canvas.height = config.screen.size.height;
            }
            document.body.appendChild(config.screen.canvas);
        }

        this.renderer = new Renderer(config.screen.canvas);
        this.scene = new Obj(null, "Default Scene");
        this.context = new Context(this);
        let camera = Camera.perspective(this.renderer.canvas.width, this.renderer.canvas.height);
        camera.name = "Default Camera";
        camera.transform.move(0, 0, 1);
        this.context.pushCamera(camera);

        if (config.screen.screenAspect) this.screenAspect = config.screen.screenAspect;
        else if (config.screen.size) this.screenAspect = config.screen.size.width / config.screen.size.height;
        window.addEventListener("resize", this.onResize.bind(this));
        this.autoResize = !!config.screen.autoResize;
        this.onResize();

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
        this.renderer.canvas.addEventListener("mousedown", (ev) => {
            const cam = this.context.cameras[0];
            const coords = screenToWorld(
                Vec4.from(ev.offsetX, ev.offsetY),
                cam.view(),
                cam.projection,
                Vec4.from(this.renderer.canvas.width, this.renderer.canvas.height),
                cam.clipSpace
            );
            console.log(coords.vec());

            // shoot ray to scene?
        });

        // - do user init
        await this.init();

        // - start game loop
        this._loop();
    }

    private onHold: boolean = false;
    private releaseForOneTick: boolean = false;
    private _loop() {
        // - do timings
        this.time = Date.now() - this.startTime;
        this.delta = this.time - this.last;

        if (!this.onHold || this.releaseForOneTick) {
            this.releaseForOneTick = false;

            // input fetching / handling
            this.input._fetch();

            // update
            this.update();

            // rendering
            this.context.clear();
            this.renderer.begin(this.delta);
            this._scene.render(this.context);
            this.renderer.flush();
        }

        // inspecting
        if (this.inspector) {
            if (!this.uiContext) {
                const inspector = document.createElement("div");
                inspector.classList.add("inspector");
                document.body.append(inspector);

                this.uiContext = UI.setup(inspector);
            }
            UI.start(this.uiContext);
            this.inspect();
            UI.finish();
        }

        // - do timings
        this.last = this.time;
        window.requestAnimationFrame(this._loop);
    }

    public async init() {}

    public update() {}

    public inspect() {
        // scene graph / obj picker
        UI.panel.begin({ name: "Scene", movable: false });

        UI.text.title("Scene Graph");

        UI.panel.end();

        // engine stats / update rendering
        UI.panel.begin({ name: "Runtime", movable: false });

        UI.text.label("FPS: " + this.renderer.stats.fps);
        if (UI.button.text("Limit FPS", { type: "toggle" })) {
            UI.input.number("Limit", 100);
        }

        UI.text.label("Draw calls: " + this.renderer.stats.drawCalls);
        this.onHold = UI.button.text(this.onHold ? "Run" : "Hold", {
            type: "toggle",
            styles: { backgroundColor: `var(--${this.onHold ? "green" : "red"})` },
        });
        if (this.onHold) if (UI.button.text("Tick")) this.releaseForOneTick = true;

        UI.panel.end();
    }

    public onResize() {
        if (!this.autoResize) return;

        let w = window.innerWidth;
        let h = window.innerHeight;
        if (this.screenAspect) h = w / this.screenAspect;

        this.renderer.canvas.width = w;
        this.renderer.canvas.height = h;

        this.context.resize(w, h);
    }
}
