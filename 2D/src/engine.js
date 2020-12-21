//

/**
 * @typedef {import("../screen/screen.js").ScreenConfig} ScreenConfig
 */


import ECS from './ECS/ECS.js';
import Screen from './screen/screen.js'


export default class Engine {
    /**
     * @param {ScreenConfig} screenConfig 
     */
    constructor(screenConfig) {
        this.ECS = new ECS();
        this.ECS.loadDefaultsSystems(this);

        this.screen = new Screen(screenConfig);
        
        this.keyMap = {};
        this.keys = [];
        this.refreshSpeed = screenConfig.refreshSpeed ? screenConfig.refreshSpeed : 30;
        this.cleanUpScreen = screenConfig.cleanUpScreen ? screenConfig.cleanUpScreen : false;

        document.addEventListener('keydown', (ev) => {
            this.keys.push(ev.code);
        });

        document.addEventListener('keyup', (ev) => {
            this.keys = this.keys.filter((code) => code != ev.code);
        });
    }

    run() {
        this.onStart(this);
        let frames = 0;
        let nextSec = new Date().getTime() + 1000;

        setInterval(() => {
            if (this.cleanUpScreen) this.screen.clearScreen();
            this.onUpdate(this);
            this.ECS.updateAll();
            this.onLastUpdate(this);

            frames++;
            if (new Date().getTime() > nextSec) {
                nextSec = new Date().getTime() + 1000;
                console.log(frames);
                frames = 0;
            }

        }, 1000 / this.refreshSpeed);
    }

     /**
     * @param {"onStart"|"onUpdate"|"onLastUpdate"} name
     * @param {(self:Engine)=>void} func
     */
    registerEvent(name, func){
        this[name] = func;
    }
    
    /**
     * @param {Engine} self
     */
    onStart(self) {}
    /**
     * @param {Engine} self
     */
    onUpdate(self) {}
    /**
     * @param {Engine} self
     */
    onLastUpdate(self) {}

    registerButton(name, keyCode) {
        this.keyMap[name] = keyCode;
    }

    isButtonPressed(name) {
        return this.keys.includes(this.keyMap[name]);
    }

    getPressedKeyCodes() {
        return this.keys;
    }
}