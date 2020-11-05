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
        this.screen = new Screen(screenConfig);
        
        this.keyMap = {};
        this.keys = [];

        document.addEventListener('keydown', (ev) => {
            this.keys.push(ev.code);
        });

        document.addEventListener('keyup', (ev) => {
            this.keys = this.keys.filter((code) => code != ev.code);
        });
    }

    run() {
        //this.onStart.bind(this)();
        this.onStart(this);
        let frames = 0;
        let nextSec = new Date().getTime() + 1000;

        setInterval(() => {
            this.update(this);
            this.ECS.updateAll();
            this.lastUpdate(this);

            frames++;
            if (new Date().getTime() > nextSec) {
                nextSec = new Date().getTime() + 1000;
                console.log(frames);
                frames = 0;
            }

        }, 1000 / 30);
    }


     /**
     * @param {"onStart"|"update"|"lastUpdate"} name
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
    update(self) {}
    /**
     * @param {Engine} self
     */
    lastUpdate(self) {}

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