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
            this['click']();
            this.activeScene.run('click');
        });
        this.screen.pixelScreen.canvas.addEventListener('contextmenu', (e) => {
            this['rightClick']();
            this.activeScene.run('rightClick');
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
        document.addEventListener('focus', () => {
            //this.IsRunning = true;
        });

        document.addEventListener('keydown', (e) => {
            this.keys.push(e.code.toLowerCase());
            if (this.isButtonPressed('engine_menu')) this.IsRunning = !this.IsRunning;
            if (!e.metaKey) e.preventDefault();
        });

        document.addEventListener('keyup', (e) => {
            this.keys = this.keys.filter((code) => code != e.code.toLowerCase());
        });
        window.addEventListener('gamepadconnected', (e) => {
            console.log('gamepad connected!', e);
        });

        let resizeScreen = () => {
            let width = window.innerWidth;
            let height = window.innerHeight;
            let max = width >= height ? height : width;

            let maxScreen = this.screen.pixelScreen.width >= this.screen.pixelScreen.height ? this.screen.pixelScreen.width : this.screen.pixelScreen.height;

            let scale = Math.floor(max / maxScreen);
            console.log('scale: ', scale);
            this.screen.pixelScreen.rescale(scale);
        };
        window.addEventListener('resize', (e) => {
            if (this.autoResize) resizeScreen();
        });
        resizeScreen();

        this['start'] = () => { };
        this['update'] = () => { };
        this['lastUpdate'] = () => { };
        this['save'] = () => { };
        this['load'] = () => { };
        this['exit'] = () => { };

        this['click'] = () => { };
        this['rightClick'] = () => { };
        this['mouseDown'] = () => { };
        this['mouseUp'] = () => { };
    }

    /**
     * Starts the current instance
     * 
     * Calls update every tick (max. ~230 ticks per browser)
     * Calls draw evrey frame (depends on monitors refresh rate)
     */
    async run() {
        // load game files
        if (this['load']) await this['load']();
        // start game (download rescources)
        if (this['start']) await this['start']();
        await this.activeScene.run('init');

        // create variables
        this.IsRunning = true;
        let self = this;

        // timing
        let lastTime = new Date().getTime();
        let time = 0;
        let delta = 0;

        //let maxTicks = 80;
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
            console.log({ frames, ticks });
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
                //                nextUpdate = 1000 / maxTicks;
                if (navigator.getGamepads()[0]) {
                    this.controllerAxes = navigator.getGamepads()[0].axes;
                }

                if (this['update']) this['update'](delta);
                this.activeScene.run('update', delta);

                if (this['lastUpdate']) this['lastUpdate'](delta);

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
        this['exit']();
    }

    /**
     * @param {'start' | 'update' | 'draw' | 'lastUpdate' | 'exit' | 'save' | 'load' | 'click' | 'rightClick'} event
     * @param {() => void} handler
     */
    on(event, handler) {
        this[event.toLowerCase()] = handler;
    }

    /**
     * @param {'Up' | 'Down' | 'Left' | 'Right' | 'Action1' | 'Action2'} name
     * @returns {boolean} 
     */
    isButtonPressed(name) {
        name = name.toLowerCase();

        if (navigator.getGamepads()[0]) {
            if (name == 'up' && this.controllerAxes[1] < -0.3) return true;
            else if (name == 'down' && this.controllerAxes[1] > 0.3) return true;
            else if (name == 'left' && this.controllerAxes[0] < -0.3) return true;
            else if (name == 'right' && this.controllerAxes[0] > 0.3) return true;
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
     * @param {String} name
     * @param {*} obj
     */
    saveObjToBrowser(name, obj) {
        localStorage.setItem(name, JSON.stringify(obj));
    }

    /**
     * Loads an object from the local storage
     * @param {String} name
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
 * @param {Number} x
 * @param {Number} y
 * @param {Number} scale
 * @param {Engine} engine
 */
function drawMouse(x, y, scale, engine) {
    for (let mp = 0; mp < defaultMouse.length; mp++) {
        for (let i = 0; i < scale; i++) {
            for (let j = 0; j < scale; j++) {
                // getcolor set color

                //engine.screen.pixel()
                let c = engine.screen.pixelScreen.getPixel(x + i + defaultMouse[mp].x * scale, y + j + defaultMouse[mp].y * scale);
                let f = (c.r + c.g + c.b) / 3;
                f = (f - 255) * -1;
                //f = f < 128 ? f/2 : f*3;
                engine.screen.pixel(x + i + defaultMouse[mp].x * scale, y + j + defaultMouse[mp].y * scale, { r: f, g: f, b: f });
            }
        }
    }
}

const defaultKeyMap = {
    up: ['KeyW', 'ArrowUp'],
    down: ['KeyS', 'ArrowDown'],
    left: ['KeyA', 'ArrowLeft'],
    right: ['KeyD', 'ArrowRight'],

    action1: ['KeyZ', 'KeyN', 'KeyC'],
    action2: ['KeyX', 'KeyM', 'KeyV'],

    engine_menu: ['Escape'],
    engine_submit: ['Enter']
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
    avocado: color(160, 190, 50),
};

export var apate = new Engine();
