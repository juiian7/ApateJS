import ApateUI from './apateUI.js';
import AudioController from './audio/audioController.js';
import Scene from './scene.js';
import Screen from './screen/screen.js';
import Random from './utility/random.js';

/*export*/
class Engine {
    constructor() {
        this.random = new Random();

        this.colors = defaultColors;
        this.clearColor = defaultColors.black;
        this.clearScreen = true;

        this.screen = new Screen(document.body);

        this.keyMap = defaultKeyMap;
        this.keys = [];

        this.controllerAxes = [];

        this.IsRunning = false;
        this.IsDebug = false;

        this.activeScene = new Scene();

        this.audio = new AudioController();

        this.ui = new ApateUI(this);

        this.mouseX = 0;
        this.mouseY = 0;
        this.IsMouseDown = false;

        this.ShowMouse = false;
        this.autoResize = true;

        this.screen.pixelScreen.canvas.addEventListener('mousemove', (e) => {
            this.mouseX = Math.round(e.offsetX / this.screen.pixelScreen.scale);
            this.mouseY = Math.round(e.offsetY / this.screen.pixelScreen.scale);
        });

        this.screen.pixelScreen.canvas.addEventListener('click', (e) => {
            this['click']({ isLeftClick: false });
            this.activeScene.run('click', { isLeftClick: false });
        });
        this.screen.pixelScreen.canvas.addEventListener('contextmenu', (e) => {
            this['click']({ isLeftClick: true });
            this.activeScene.run('click', { isLeftClick: true });
            e.preventDefault();
            return false;
        });
        this.screen.pixelScreen.canvas.addEventListener('mousedown', (e) => {
            this.IsMouseDown = true;
            this['mouseDown']();
            this.activeScene.run('mouseDown');
        });
        this.screen.pixelScreen.canvas.addEventListener('mouseup', (e) => {
            this.IsMouseDown = false;
            this['mouseUp']();
            this.activeScene.run('mouseUp');
        });

        document.addEventListener('blur', () => {
            this.IsRunning = false;
        });

        this.autoResumeOnFocus = false;
        document.addEventListener('focus', () => {
            if (this.autoResumeOnFocus) {
                this.IsRunning = true;
            }
        });

        document.addEventListener('keydown', (e) => {
            this.keys.push(e.code.toLowerCase());

            this.activeScene.run('btnDown', { key: e.code.toLowerCase(), shift: e.shiftKey, metaKey: e.metaKey });
            if (this['btnDown']) this['btnDown']({ key: e.code.toLowerCase(), shift: e.shiftKey, metaKey: e.metaKey });

            if (this.isButtonPressed('engine_menu')) this.IsRunning = !this.IsRunning;
            if (!e.metaKey) e.preventDefault();
        });

        document.addEventListener('keyup', (e) => {
            this.keys = this.keys.filter((code) => code != e.code.toLowerCase());

            this.activeScene.run('btnUp', { key: e.code.toLowerCase(), shift: e.shiftKey, metaKey: e.metaKey });
            if (this['btnUp']) this['btnUp']({ key: e.code.toLowerCase(), shift: e.shiftKey, metaKey: e.metaKey });
        });
        window.addEventListener('gamepadconnected', (e) => {
            console.log('gamepad connected!', e);
        });

        window.addEventListener('resize', (e) => {
            if (this.autoResize) this.screen.pixelScreen.rescale(this.maxScreenScale);
        });
        if (this.autoResize) this.screen.pixelScreen.rescale(this.maxScreenScale);
    }

    get maxScreenScale() {
        let width = window.innerWidth;
        let height = window.innerHeight;
        let max = width >= height ? height : width;

        let maxScreen = this.screen.pixelScreen.width >= this.screen.pixelScreen.height ? this.screen.pixelScreen.width : this.screen.pixelScreen.height;

        let scale = Math.floor(max / maxScreen);
        return scale;
    }

    /**
     * Once called on start
     */
    start() {}
    /**
     * Called every tick
     * @param {number} delta Time since last call
     */
    update(delta) {}
    /**
     * Called every frame
     */
    draw() {}
    /**
     * @param {{isLeftClick: boolean}} clickInfo
     */
    click(clickInfo) {}
    /**
     * Triggered when left mouse button is pressed down
     */
    mouseDown() {}
    /**
     * Triggered when left mouse button is released
     */
    mouseUp() {}
    /**
     * Triggered when any key pressed down
     * @param {{key: string, shift: boolean, metaKey: boolean}} keyInfo
     */
    btnDown(keyInfo) {}
    /**
     * Triggered when any key is released
     * @param {{key: string, shift: boolean, metaKey: boolean}} keyInfo
     */
    btnUp(keyInfo) {}

    /**
     * Starts the current instance
     *
     * Calls update every tick (max. ~230 ticks per second, depending on browser limit)
     * Calls draw evrey frame (depends on browsers refresh rate)
     */
    async run() {
        this.IsRunning = true;

        // load game files
        if (this['load']) await this['load']();
        // start game (download rescources)
        if (this['start']) await this['start']();
        await this.activeScene.run('init');

        // create variables
        let self = this;

        // timing
        let lastTime = new Date().getTime();
        let time = 0;
        let delta = 0;

        let frames = 0;
        let ticks = 0;

        //start render loop
        let renderLoop = function () {
            self['draw']?.(self.screen);
            self.activeScene.run('draw', self.screen);

            if (!self.IsRunning) self.ui.draw();
            if (self.IsRunning && self.ShowMouse) drawMouse(self.mouseX, self.mouseY, 1, self);

            frames++;

            self.screen.pixelScreen.updateTexture();
            self.screen.pixelScreen.render();

            if (self.clearScreen) self.screen.clear(self.clearColor);

            if (!self.isStopped) window.requestAnimationFrame(renderLoop);
        };
        window.requestAnimationFrame(renderLoop);

        // draw info
        this.infoLoop = setInterval(() => {
            if (this.IsDebug) console.log({ frames, ticks });
            frames = 0;
            ticks = 0;
        }, 1000);

        // let nextUpdate = 1000 / maxTicks;
        // set update intervall and update objects
        this.updateLoop = setInterval(() => {
            time = new Date().getTime();
            delta = time - lastTime;
            //nextUpdate -= delta;

            if (this.IsRunning /* && nextUpdate < 0*/) {
                // nextUpdate = 1000 / maxTicks;

                if (this['update']) this['update'](delta);
                this.activeScene.run('update', delta);

                ticks++;
            } else {
                this.ui.update(delta);
            }
            lastTime = time;
        }, 0);
    }

    /**
     * Stops the current running instance
     */
    stop() {
        clearInterval(this.updateLoop);
        clearInterval(this.infoLoop);
        this.isStopped = true;
    }

    /**
     * @param {'start' | 'update' | 'draw' | 'click' | 'mouseDown' | 'mouseUp'  | 'btnDown' | 'btnUp'} event
     * @param {() => void} handler
     */
    on(event, handler) {
        this[event.toLowerCase()] = handler;
    }

    /**
     * @param {'Up' | 'Down' | 'Left' | 'Right' | 'Action1' | 'Action2'} name
     * @returns {boolean}
     */
    isButtonPressed(name) {
        name = name.toLowerCase();

        if (navigator.getGamepads()[0]) {
            if (name == 'up' && navigator.getGamepads()[0].axes[1] < -0.3) return true;
            else if (name == 'down' && navigator.getGamepads()[0].axes[1] > 0.3) return true;
            else if (name == 'left' && navigator.getGamepads()[0].axes[0] < -0.3) return true;
            else if (name == 'right' && navigator.getGamepads()[0].axes[0] > 0.3) return true;
            else if (name == 'action1' && navigator.getGamepads()[0].buttons[controllerMap['action1']].pressed) return true;
            else if (name == 'action2' && navigator.getGamepads()[0].buttons[controllerMap['action2']].pressed) return true;
            else if (name == 'engine_menu' && navigator.getGamepads()[0].buttons[controllerMap['engine_menu']].pressed) return true;
            else if (name == 'engine_submit' && navigator.getGamepads()[0].buttons[controllerMap['engine_submit']].pressed) return true;
        }

        if (this.keyMap[name]) {
            for (let i = 0; i < this.keyMap[name].length; i++) {
                if (this.keys.includes(this.keyMap[name][i].toLowerCase())) return true;
            }
        } else {
            if (this.keys.includes(name)) return true;
        }

        return false;
    }

    /**
     * Saves an object to the local storage
     * @param {string} name
     * @param {*} obj
     */
    saveObjToBrowser(name, obj) {
        localStorage.setItem(name, JSON.stringify(obj));
    }

    /**
     * Loads an object from the local storage
     * @param {string} name
     */
    loadObjFromBrowser(name) {
        let obj = localStorage.getItem(name);
        return obj ? JSON.parse(obj) : null;
    }

    /**
     * Sets the root element where the main canvas is located
     * @param {HTMLElement} parent
     */
    setParentElement(parent) {
        parent.appendChild(this.screen.pixelScreen.canvas);
    }
}

const defaultMouse = [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 0 }
];

/**
 * @param {number} x
 * @param {number} y
 * @param {number} scale
 * @param {Engine} engine
 */
function drawMouse(x, y, scale, engine) {
    for (let mp = 0; mp < defaultMouse.length; mp++) {
        for (let i = 0; i < scale; i++) {
            for (let j = 0; j < scale; j++) {
                let pixel = engine.screen.pixelScreen.getPixel(x + i + defaultMouse[mp].x * scale, y + j + defaultMouse[mp].y * scale);
                let mousePixel = 255 - (pixel.r + pixel.g + pixel.b) / 3;

                engine.screen.drawPixel(x + i + defaultMouse[mp].x * scale, y + j + defaultMouse[mp].y * scale, color(mousePixel, mousePixel, mousePixel));
            }
        }
    }
}

const defaultKeyMap = {
    up: ['KeyW', 'ArrowUp'],
    down: ['KeyS', 'ArrowDown'],
    left: ['KeyA', 'ArrowLeft'],
    right: ['KeyD', 'ArrowRight'],

    action1: ['KeyZ', 'KeyN', 'KeyC', 'Space'],
    action2: ['KeyX', 'KeyM', 'KeyV'],

    engine_menu: ['Escape'],
    engine_submit: ['Enter', 'NumpadEnter']
};

const controllerMap = {
    action1: 0,
    action2: 2,
    engine_menu: 1,
    engine_submit: 0
};

export function color(r, g, b) {
    return { r, g, b };
}

/**
 * A collection of the best colors
 */
const defaultColors = {
    white: color(230, 230, 230),
    black: color(20, 20, 20),
    gray: color(40, 40, 40),
    light_gray: color(60, 60, 60),

    yellow: color(255, 215, 0),
    ocher: color(190, 150, 0),
    orange: color(255, 155, 0),
    brown: color(165, 110, 30),
    red: color(255, 75, 75),
    dark_red: color(170, 50, 50),
    pink: color(230, 85, 150),
    magenta: color(185, 50, 110),

    light_purple: color(170, 90, 190),
    purple: color(110, 50, 120),
    indigo: color(100, 100, 190),
    dark_indigo: color(70, 70, 140),
    blue: color(65, 90, 160),
    dark_blue: color(50, 70, 120),
    agua: color(80, 170, 220),
    dark_agua: color(50, 135, 180),

    cyan: color(60, 220, 200),
    dark_cyan: color(40, 170, 155),
    mint: color(70, 200, 140),
    jade: color(40, 145, 100),
    light_green: color(100, 220, 100),
    green: color(50, 165, 50),
    lime: color(190, 220, 90),
    avocado: color(160, 190, 50)
};

export var apate = new Engine();
