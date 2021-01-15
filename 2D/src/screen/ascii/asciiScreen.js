import {
    apateConfig
} from '../../apateConfig.js';

export default class AsciiScreen {
    constructor(parentElement) {

        const el = parentElement.querySelector('#asciiscreen');

        this.width = apateConfig.width;
        this.height = apateConfig.height;
        this.scale = apateConfig.scale;

        if (el) {
            this.canvas = el;
        } else {
            this.canvas = document.createElement('canvas');
            parentElement.appendChild(this.canvas);
        }

        this.canvas.id = 'asciiscreen';
        this.canvas.width = this.width * apateConfig.scale;
        this.canvas.height = this.height * apateConfig.scale;

        this.canvas.style.position = 'absolute';
        this.canvas.style.zIndex = 2;
        this.canvas.style.transform = 'translateX(-100%)';
        /**
         * @type {CanvasRenderingContext2D}
         */

        this.ctx = this.canvas.getContext('2d');
        this.size = 32;
        this.setSize(this.size);
    }

    setSize(size) {
        this.size = size;
        this.ctx.font = this.size + 'px pixel';
    }

    setColor(c) {
        this.ctx.fillStyle = c.HEX;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    putChar(x, y, c) {
        this.ctx.fillText(c, x * this.scale * this.scale, (y + 1) * this.scale * this.scale, this.width / this.scale);
    }

    setPixel(x, y) {
        this.ctx.fillRect(x * this.scale, y * this.scale, this.scale, this.scale);
    }

}