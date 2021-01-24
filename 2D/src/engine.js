//


import {
    apateConfig
} from './apateConfig.js';
import ApateUI from './apateUI.js';
import ECS from './ECS/ECS.js';
import Screen from './screen/screen.js';
import Color from './utility/color.js';


export default class Engine {
    constructor() {

        if (apateConfig.useUI) {
            this.ui = new ApateUI();
            this.ui.uiElements.controlPause.onclick = () => {
                this.IsRunning = !this.IsRunning;
                if (this.IsRunning) this.ui.uiElements.controlPause.innerText = 'Pause';
                else this.ui.uiElements.controlPause.innerText = 'Resume';
            };
            this.ui.uiElements.controlSave.onclick = () => {
                this.save();
            }
            this.ui.uiElements.controlLoad.onclick = () => {
                this.load();
            }
        }

        this.clearColor = new Color(0, 0, 0);
        this.clearScreen = true;

        this.ECS = new ECS();
        this.ECS.loadDefaultsSystems(this);

        let el = document.querySelector(apateConfig.parentSelector);
        if (apateConfig.useUI) el = this.ui.uiElements.screen;

        this.screen = new Screen(el);

        this.keyMap = {};
        this.keys = [];

        this.IsRunning = false;


        let scale = apateConfig.scale;

        this.mouseX = 0;
        this.mouseY = 0;
        this.IsMouseDown = false;

        this.ShowMouse = false;

        let self = this;

        this.screen.pixelScreen.canvas.addEventListener('mousemove', (e) => {
            self.mouseX = Math.round(e.offsetX / scale);
            self.mouseY = Math.round(e.offsetY / scale);
        });

        let font = new FontFace('pixel', 'url(https://kusternigg.at/pixel.ttf)');
        font.load().then(() => {
            document.fonts.add(font);
        });
        this.screen.pixelScreen.canvas.addEventListener('click', (e) => {
            self['mouseClick']();
        });
        this.screen.pixelScreen.canvas.addEventListener('mousedown', (e) => {
            self.IsMouseDown = true;
            self['mouseDown']();
        });
        this.screen.pixelScreen.canvas.addEventListener('mouseup', (e) => {
            self.IsMouseDown = false;
            self['mouseUp']();
        });

        document.addEventListener('keydown', (ev) => {
            this.keys.push(ev.code);
        });

        document.addEventListener('keyup', (ev) => {
            this.keys = this.keys.filter((code) => code != ev.code);
        });

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
        // create variables
        this.IsRunning = true;
        let self = this;

        // timing
        let lastTime = new Date().getTime();
        let time = 0;
        let delta = 0;

        let frames = 0;
        let ticks = 0;

        //start render loop
        let renderLoop = function () {
            if (!self.IsRunning) drawPause(6, 6, 4, 10, self);
            if (self.IsRunning && self.ShowMouse) drawMouse(self.mouseX, self.mouseY, 3, self);

            frames++;

            self.screen.pixelScreen.updateTexture();
            self.screen.pixelScreen.render();

            if (!self.isStopped) window.requestAnimationFrame(renderLoop);
        }
        window.requestAnimationFrame(renderLoop);

        // draw info
        this.infoLoop = setInterval(() => {
            if (this.IsRunning) {
                console.log({
                    frames,
                    ticks
                });

                frames = 0;
                ticks = 0;
            }
        }, 1000);


        // load game files
        await this['load']();
        // start game (download rescources)
        await this['start']();




        // set update intervall and update objects
        this.updateLoop = setInterval(() => {

            time = new Date().getTime();
            delta = time - lastTime;

            if (this.IsRunning) {
                if (this.clearScreen) self.screen.clear(self.clearColor);

                this['update'](delta);
                this.ECS.updateAll(delta);
                this['lastUpdate'](delta);

                ticks++;
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
     * @param {'start' | 'update'| 'lastUpdate'| 'exit' | 'save' | 'load'} event 
     * @param {() => void} handler 
     */
    on(event, handler) {
        this[event] = handler;
    }

    registerButton(name, keyCode) {
        this.keyMap[name] = keyCode;
    }

    isButtonPressed(name) {
        return this.keys.includes(this.keyMap[name]);
    }

    getPressedKeyCodes() {
        return this.keys;
    }

    async loadSprite(url) {
        var res = await fetch(url);
        let json = await res.json();
        return json;
    }

    saveObjToBrowser(name, obj) {
        localStorage.setItem(name, JSON.stringify(obj));
    }
    loadObjFromBrowser(name) {
        let objS = localStorage.getItem(name);
        if (objS) return JSON.parse(objS);
        return null;
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

const white = {
    r: 255,
    g: 255,
    b: 255,
}

/**
 * 
 * @param {Engine} engine 
 */
function drawPause(x, y, w, h, engine) {
    engine.screen.rect(x, y, w, h, white);
    engine.screen.rect(x + w * 2, y, w, h, white);
}