import Vec from "./Vec.js";

export default class Input {
    private keys: { [code: string]: number } = {};
    private mPosition: Vec = Vec.from(0, 0, 0);

    constructor(canvas?: HTMLCanvasElement) {
        window.addEventListener("keyup", this.keyup.bind(this));
        window.addEventListener("keydown", this.keydown.bind(this));

        (canvas || document).addEventListener("mousemove", this.mouseMove.bind(this));
    }

    private keyup(ev: KeyboardEvent) {
        let code = ev.code + ev.shiftKey + ev.ctrlKey + ev.altKey + ev.metaKey;
        this.keys[code] = 0;
    }

    private keydown(ev: KeyboardEvent) {
        let code = ev.code + ev.shiftKey + ev.ctrlKey + ev.altKey + ev.metaKey;
        if (!this.keys[code]) this.keys[code] = 0;
        this.keys[code]++;
    }

    private mouseMove(ev: MouseEvent) {
        this.mPosition.x = ev.clientX;
        this.mPosition.y = ev.clientY;
    }

    public on() {}

    public btn() {}

    public key(code: string, shift = false, ctrl = false, alt = false, meta = false) {
        return this.keys[code + shift + ctrl + alt + meta] > 0;
    }

    public axis(name: string): number {
        let axis = 0;
        if (this.key("KeyD")) axis += 1;
        if (this.key("KeyA")) axis -= 1;
        return axis;
    }

    public mouse(): Vec {
        return this.mPosition;
    }

    //cursor() {}
}
