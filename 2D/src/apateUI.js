import {
    apateConfig
} from './apateConfig.js';

export default class ApateUI {

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
        document.head.appendChild(style);   this.element.id = 'main';
        let {
            title,
            screen,
            controls,
            description,
            controlPause,
            controlSave,
            controlLoad
        } = initEngineHTML(this.element);

        this.uiElements = {
            title,
            screen, 
            controls,
            description,
            controlPause,
            controlSave,
            controlLoad
        };
    }
    setTitle(title) {
        this.uiElements.title.innerText = title;
    }


    addControl(name, onClick) {

        let controlEl = document.createElement('button');

        controlEl.innerText = name;
        controlEl.classList.add('controlItem');
        let execute = () => {
            let args = onClick();
            if (args) {
                if (args.name) controlEl.innerText = args.name;
                if (args.prevent) return true;
            }
        };
        controlEl.onclick = execute;

        this.uiElements.controls.appendChild(controlEl);
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

        this.uiElements.description.innerHTML = html;
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

    let controlList = ['Pause', 'Save', 'Load'];
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