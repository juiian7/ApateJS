//

import ApateUI from './apateUI.js';
import Scene from './scene.js';
import Screen from './screen/screen.js';
import Random from './utility/random.js';

/*export*/
class Engine {
    constructor() {
        this.random = new Random();

        this.clearColor = {
            r: 0,
            g: 0,
            b: 0
        }
        this.clearScreen = true;

        let el = document.body;

        this.screen = new Screen(el);

        this.keyMap = loadKeyMap();
        this.keys = [];

        this.controllerAxes = [];

        this.IsRunning = false;

        this.activeScene = new Scene();

        this.ui = new ApateUI(this);

        this.mouseX = 0;
        this.mouseY = 0;
        this.IsMouseDown = false;

        this.ShowMouse = false;
        this.autoResize = true;

        let self = this;

        this.screen.pixelScreen.canvas.addEventListener('mousemove', (e) => {
            this.mouseX = Math.round(e.offsetX / self.screen.pixelScreen.scale);
            this.mouseY = Math.round(e.offsetY / self.screen.pixelScreen.scale);
        });

        this.screen.pixelScreen.canvas.addEventListener('click', (e) => {
            this['mouseClick']();
        });
        this.screen.pixelScreen.canvas.addEventListener('mousedown', (e) => {
            this.IsMouseDown = true;
            this['mouseDown']();
        });
        this.screen.pixelScreen.canvas.addEventListener('mouseup', (e) => {
            this.IsMouseDown = false;
            this['mouseUp']();
        });

        document.addEventListener('keydown', (ev) => {
            this.keys.push(ev.code);
            if (this.isButtonPressed('engine_cancel')) this.IsRunning = !this.IsRunning;
            if (!ev.metaKey) ev.preventDefault();
        });

        document.addEventListener('keyup', (ev) => {
            this.keys = this.keys.filter((code) => code != ev.code);
        });
        window.addEventListener('gamepadconnected', (ev) => {
            console.log('gamepad connected!', ev);
        });
        let resizeScreen = function () {
            let width = window.innerWidth;
            let height = window.innerHeight;
            let max = width >= height ? height : width;

            let scale = Math.floor(max / 128);
            console.log(scale);
            self.screen.pixelScreen.resize(scale);
        }
        window.addEventListener('resize', e => {
            if (this.autoResize) {
                resizeScreen();
            }
        });
        resizeScreen();

        this['start'] = () => {};
        this['update'] = () => {};
        this['lastUpdate'] = () => {};
        this['save'] = () => {};
        this['load'] = () => {};
        this['exit'] = () => {};

        this['mouseClick'] = () => {};
        this['mouseDown'] = () => {};
        this['mouseUp'] = () => {};
    }
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

            if (self['draw']) self['draw'](self.screen);
            self.activeScene.run('draw');

            if (!self.IsRunning) self.ui.draw();
            if (self.IsRunning && self.ShowMouse) drawMouse(self.mouseX, self.mouseY, 1, self);

            frames++;

            self.screen.pixelScreen.updateTexture();
            self.screen.pixelScreen.render();
            
            if (self.clearScreen) self.screen.clear(self.clearColor);

            if (!self.isStopped) window.requestAnimationFrame(renderLoop);
        }
        window.requestAnimationFrame(renderLoop);

        // draw info
        this.infoLoop = setInterval(() => {
            console.log({
                frames,
                ticks
            });

            frames = 0;
            ticks = 0;
        }, 1000);

        //let nextUpdate = 1000 / maxTicks;
        // set update intervall and update objects
        this.updateLoop = setInterval(() => {

            time = new Date().getTime();
            delta = time - lastTime;
            //nextUpdate -= delta;

            if (this.IsRunning /* && nextUpdate < 0*/ ) {
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
    stop() {
        clearInterval(this.updateLoop);
        clearInterval(this.infoLoop);
        this.isStopped = true;
        this['exit']();
    }
    /**
     * 
     * @param {'start' | 'update'| 'draw'| 'lastUpdate'| 'exit' | 'save' | 'load'} event 
     * @param {() => void} handler 
     */
    on(event, handler) {
        this[event] = handler;
    }
    /**
     * 
     * @param {'Up' | 'Down'| 'Left'| 'Right' | 'Action1' | 'Action2' | 'Action3' | 'Action4'} name 
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
        }

        for (let i = 0; i < this.keyMap[name].length; i++) {
            if (this.keys.includes(this.keyMap[name][i])) return true;
        }

        return false;
    }
    saveObjToBrowser(name, obj) {
        localStorage.setItem(name, JSON.stringify(obj));
    }
    loadObjFromBrowser(name) {
        let objS = localStorage.getItem(name);
        if (objS) return JSON.parse(objS);
        return null;
    }
    /**
     * 
     * @param {HTMLElement} parent 
     */
    setParentElement(parent) {
        parent.appendChild(this.screen.pixelScreen.canvas);
    }
}

let defaultMouse = [{
    x: 0,
    y: 0,
}, {
    x: 0,
    y: 1,
}, {
    x: 1,
    y: 0,
}]
/**
 * 
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
                engine.screen.pixel(x + i + defaultMouse[mp].x * scale, y + j + defaultMouse[mp].y * scale, {
                    r: f,
                    g: f,
                    b: f
                });
            }
        }
    }
}

function loadKeyMap() {
    return {
        'up': ['KeyW', 'ArrowUp'],
        'down': ['KeyS', 'ArrowDown'],
        'left': ['KeyA', 'ArrowLeft'],
        'right': ['KeyD', 'ArrowRight'],

        'action1': ['KeyZ', 'KeyN', 'KeyC', 'Enter', 'Space'],
        'action2': ['KeyX', 'KeyM', 'KeyV'],

        'engine_cancel': ['Escape'],
    }
}
const controllerMap = {
    'action1': 0,
    'action2': 2
}

export var apate = new Engine();