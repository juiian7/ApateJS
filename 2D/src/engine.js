//


import {
    apateConfig
} from './apateConfig.js';
import ECS from './ECS/ECS.js';
import Screen from './screen/screen.js';
import Color from './utility/color.js';


export default class Engine {
    constructor() {
        let root = document.querySelector(apateConfig.parentSelector);
        this.element = root.querySelector('#main');
        if (this.element) {
            this.element.innerText = '';
        } else {
            this.element = document.createElement('div');
            root.appendChild(this.element);
        }

        let style = document.createElement('style');
        style.innerText = stylesheet;
        document.head.appendChild(style);

        this.clearColor = new Color(0, 0, 0);

        this.element.id = 'main';
        let {
            title,
            screen,
            controls,
            description,
            controlPause,
            controlSave,
            controlLoad
        } = initEngineHTML(this.element);

        this.controlsDivElement = controls;
        this.descriptionElement = description;
        this.titleElement = title;

        this.ECS = new ECS();
        this.ECS.loadDefaultsSystems(this);

        this.screen = new Screen(screen);

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

        let white = new Color(255, 255, 255);

        let pauseResume = () => {

            self.IsRunning = !self.IsRunning;


            self.screen.rect(10, 10, 3, 10, white);
            self.screen.rect(15, 10, 3, 10, white);

            self.screen.pixelScreen.updateTexture();
            self.screen.pixelScreen.render();


            if (self.IsRunning) {
                controlPause.innerText = 'Pause (p)';
            } else {
                controlPause.innerText = 'Resume (p)';
            }
            return true;
        }
        controlPause.onclick = pauseResume;

        controlSave.onclick = () => {
            self['save']();
        }
        controlLoad.onclick = () => {
            self['load']();
        }

        this.keybinds = {
            p: pauseResume
        };
        this.keyMap['p'] = 'KeyP';

        document.addEventListener('keydown', (ev) => {
            for (const key in this.keyMap) {
                if (this.keyMap[key] == ev.code) {

                    if (this.keybinds[key]) {
                        if (this.keybinds[key]()) {
                            ev.preventDefault();
                            return;
                        }
                    }
                }
            }

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
    setTitle(title) {
        this.titleElement.innerText = title;
    }
    run() {
        this.IsRunning = true;

        this['load']();
        this['start']();
        let frames = 0;
        let ticks = 0;
        let avgTicks = 60;

        let self = this;

        //start render loop
        /*let renderLoop = function () {

            if (self.IsRunning) drawMouse(self.mouseX, self.mouseY, 3, self);

            frames++;

            self.screen.pixelScreen.updateTexture();
            self.screen.pixelScreen.render();

            if (!self.isStopped) window.requestAnimationFrame(renderLoop);
        }
        window.requestAnimationFrame(renderLoop);*/

        this.updateLoop = setInterval(() => {

            if (this.IsRunning) {
                self.screen.clear(self.clearColor);

                this['update']();
                this.ECS.updateAll();
                this['lastUpdate']();

                ticks++;

                drawMouse(self.mouseX, self.mouseY, 3, self);

                self.screen.pixelScreen.updateTexture();
                self.screen.pixelScreen.render();

                frames++;
            }
        }, 1000 / avgTicks);

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
    }


    runExit() {
        clearInterval(this.updateLoop);
        clearInterval(this.infoLoop);
        this.isStopped = true;

        this['exit']();
    }

    runSave() {
        this['save']();
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

    addControl(name, onClick, keybind) {

        let controlEl = document.createElement('button');
        let append = keybind ? ' (' + keybind + ')' : '';

        controlEl.innerText = name + append;
        controlEl.classList.add('controlItem');
        let execute = () => {
            let args = onClick();
            if (args) {
                if (args.name) controlEl.innerText = args.name + append;
                if (args.prevent) return true;
            }
        };
        controlEl.onclick = execute;
        if (keybind) this.keybinds[keybind] = execute;

        this.controlsDivElement.appendChild(controlEl);
    }

    setDescription(markDown) {
        let lines = markDown.split('\n');
        let isList = false;

        let html = '';

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim()[0] == '#') {

                if (isList) {
                    html += '</ul>';
                    isList = false;
                }

                let title = lines[i].slice(1).trim();
                html += '<h1>' + title + '</h1>';

            } else if (lines[i].trim()[0] == '-') {

                if (!isList) {
                    html += '<ul>';
                    isList = true;
                }

                let item = lines[i].slice(1).trim();
                html += '<li>' + item + '</li>';

            } else {

                if (isList) {
                    html += '</ul>';
                    isList = false;
                }
                html += '<p>' + lines[i] + '</p>';
            }
        }
        
        if (isList) {
            html += '</ul>';
            isList = false;
        }

        this.descriptionElement.innerHTML = html;
    }
}



/**
 * 
 * @param {HTMLDivElement} element 
 */
function initEngineHTML(element) {
    element.classList.add('mainContent');
    element.style.width = (apateConfig.width * apateConfig.scale) + 20 + 'px';

    let header = document.createElement('div');
    header.id = 'header';
    let title = document.createElement('h1');
    header.appendChild(title);
    title.innerText = 'ApateJS';
    title.classList.add('title');


    let body = document.createElement('div');
    body.classList.add('mainDiv');

    let screen = document.createElement('div');
    screen.id = '#screen';
    screen.style.margin = '0px auto 0px auto';
    screen.style.width = (apateConfig.width * apateConfig.scale) + 'px';
    screen.style.height = (apateConfig.height * apateConfig.scale) + 'px';

    let controls = document.createElement('div');
    controls.id = 'controls';
    controls.classList.add('controlBox');

    let controlList = ['Pause (p)', 'Save', 'Load'];
    let controlsArray = [];
    for (let i = 0; i < controlList.length; i++) {
        let controlEl = document.createElement('button');
        controlEl.innerText = controlList[i];
        controlEl.classList.add('controlItem');

        controlsArray.push(controlEl);
        controls.appendChild(controlEl);
    }


    body.appendChild(screen);
    body.appendChild(controls);

    let description = document.createElement('div');
    description.classList.add('description');
    body.appendChild(description);

    element.appendChild(header);
    element.appendChild(body);


    return {
        title,
        screen,
        controls,
        description,
        controlPause: controlsArray[0],
        controlSave: controlsArray[1],
        controlLoad: controlsArray[2]
    };
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
                engine.screen.pixel(x + i + defaultMouse[mp].x * scale, y + j + defaultMouse[mp].y * scale, {
                    r: f - 60,
                    g: f - 60,
                    b: f - 60
                });
            }
        }
    }
}

let stylesheet = `

.mainDiv {
    padding: 10px;
}

.mainContent {
    border-radius: 4px ;
    background-color:#333333;
}

.controlBox {
    display: flex;
    text-align: center;
    justify-content: space-evenly;
    flex-wrap: wrap;
    padding: 10px;
    margin: 0px;
}

.controlItem {
    /*height: 40px;*/
    background-color: #333333;
    border: 0px;
    border-radius: 4px;
    font-family: pixel;
    color: #eeeeee;
    font-size: 20px;
    cursor: pointer;
    padding: 20px;
    margin: 0px;
}

.controlItem:hover {
    background-color: #222222;
}
.title {
    text-align: center;
    color: #eeeeee;
    font-family: pixel;
    margin: 0px;
    padding: 10px;
}

.description {
    color: #eeeeee;
    font-family: pixel;
    border-radius: 8px;
    background-color: #222222;
}
.description > h1 {
    text-align: center;
}
`;