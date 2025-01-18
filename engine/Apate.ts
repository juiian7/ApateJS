interface EngineConfig {
    screen?: ScreenConfig;
}

interface ScreenConfig {
    canvas?: HTMLCanvasElement;
    // filter style
    autoResize?: boolean;
}

const defaultConfig: EngineConfig = {};
const defaultScreenConfig: ScreenConfig = {
    autoResize: true,
};

export default class Apate {
    constructor(config?: EngineConfig) {
        // initialization
        if (!config) config = defaultConfig;

        // run after constructor
        setTimeout(this._init.bind(this), 0);
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

        this.update();

        // - do timings
        window.requestAnimationFrame(this._loop);
    }

    public async init() {}

    public update() {}
}
