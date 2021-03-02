//

export default class ApateUI {
    constructor(engine) {
        this.engine = engine;

        this.maxControlLength = 0;

        this.controlls = [];
        this.addControl('continue', () => {
            this.engine.IsRunning = true;
        });

        /**
         * @type {HTMLElement}
         */
        let el = this.engine.screen.pixelScreen.canvas;
        let fullscreen = false;

        this.addControl('fullscreen: off', (c) => {
            fullscreen = !fullscreen;

            c.name = `fullscreen: ${fullscreen ? 'on' : 'off'}`;

            // toggle fulscree
            if (fullscreen) {
                if (el.requestFullscreen) {
                    el.requestFullscreen();
                } else if (el.webkitRequestFullscreen) {
                    /* Safari */
                    el.webkitRequestFullscreen();
                } else if (el.msRequestFullscreen) {
                    /* IE11 */
                    el.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) document.exitFullscreen();
                if (document.webkitExitFullScreen) document.webkitExitFullScreen();
            }
        });

        this.addControl('reload page', () => {
            window.location.reload();
        });

        this.currentIndex = 0;

        this.backColor = {
            r: 30,
            g: 30,
            b: 30
        };

        this.shadowColor = {
            r: 0,
            g: 0,
            b: 0
        };
        this.fontColor = {
            r: 255,
            g: 255,
            b: 255
        };

        this.selectedColor = {
            r: 255,
            g: 120,
            b: 102
        };

        this.isFirstPress = true;
        this.keyDelay = 100;
        this.nextListen = 0;
    }

    update(delta) {
        this.nextListen -= delta;

        if (this.nextListen < 0) {
            if (this.engine.isButtonPressed('engine_submit')) {
                this.controlls[this.currentIndex].execute();

                this.nextListen = this.isFirstPress ? this.keyDelay * 3 : this.keyDelay;
                this.isFirstPress = false;
            } else if (this.engine.isButtonPressed('up')) {
                this.currentIndex--;
                if (this.currentIndex < 0) this.currentIndex = this.controlls.length - 1;

                this.nextListen = this.isFirstPress ? this.keyDelay * 3 : this.keyDelay;
                this.isFirstPress = false;
            } else if (this.engine.isButtonPressed('down')) {
                this.currentIndex++;
                if (this.currentIndex >= this.controlls.length) this.currentIndex = 0;

                this.nextListen = this.isFirstPress ? this.keyDelay * 3 : this.keyDelay;
                this.isFirstPress = false;
            }
        } else {
            this.nextListen = this.engine.keys.length == 0 ? 0 : this.nextListen;
        }
        if (!this.isFirstPress && this.engine.keys.length == 0) this.isFirstPress = true;
    }

    draw() {
        for (let x = 0; x < 128; x++) {
            for (let y = 0; y < 128; y++) {
                let c = this.engine.screen.pixelScreen.getPixel(x, y);
                c.r = c.r - 128 < 0 ? 0 : c.r - 128;
                c.g = c.g - 128 < 0 ? 0 : c.g - 128;
                c.b = c.b - 128 < 0 ? 0 : c.b - 128;
                this.engine.screen.pixel(x, y, c);
            }
        }

        let w = this.maxControlLength * 5;
        let h = this.controlls.length * 8;

        let minX = Math.round(64 - w / 2);
        let minY = Math.round(64 - h / 2);

        this.engine.screen.rect(minX + 2, minY + 2, w, h, this.shadowColor);
        this.engine.screen.rect(minX, minY, w, h, this.backColor);

        for (let i = 0; i < this.controlls.length; i++) {
            if (i == this.currentIndex) {
                this.engine.screen.text(minX + 1, minY + 2 + 7 * i, this.controlls[i].name, this.selectedColor);
            } else {
                this.engine.screen.text(minX + 1, minY + 2 + 7 * i, this.controlls[i].name, this.fontColor);
            }
        }
    }
    /**
     * 
     * @param {string} name Name of the control to add
     * @param {() => void} onClick Event which is triggered when control is clicked
     */
    addControl(name, onClick) {
        let c = { name };

        c.execute = () => {
            onClick(c);
        };

        this.controlls.push(c);

        this.maxControlLength = name.length > this.maxControlLength ? name.length : this.maxControlLength;
    }
}
