import { Vec } from "./Vec.js";

interface BrowserKey {
    code: string;
    shiftKey?: boolean;
    ctrlKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
}

class Input {
    private keys: { [code: string]: number } = {};
    private mPosition: Vec = Vec.from(0, 0, 0);

    private mapping = {
        axis: {
            horizontal: {
                pad: null,
                pos: { keys: ["KeyD", "ArrowRight"], btn: [] },
                neg: { keys: ["KeyA", "ArrowLeft"], btn: [] },
            },
            vertical: {
                pad: null,
                pos: { keys: ["KeyW", "ArrowUp"], btn: [] },
                neg: { keys: ["KeyS", "ArrowDown"], btn: [] },
            },
        },
    };

    public static toInternalKey(key: BrowserKey): string {
        let k = key.code;
        let m = "";
        if (key.shiftKey) m += "S";
        if (key.ctrlKey) m += "C";
        if (key.altKey) m += "A";
        if (key.metaKey) m += "M";
        if (m) k += "-" + m;
        return k;
    }
    public static toExternalKey(key: string): BrowserKey {
        let [code, mod] = key.split("-");
        return {
            code,
            shiftKey: mod?.includes("S") || false,
            ctrlKey: mod?.includes("C") || false,
            altKey: mod?.includes("A") || false,
            metaKey: mod?.includes("M") || false,
        };
    }

    constructor(canvas?: HTMLCanvasElement) {
        window.addEventListener("keyup", this.keyup.bind(this));
        window.addEventListener("keydown", this.keydown.bind(this));

        (canvas || document).addEventListener("mousemove", this.mouseMove.bind(this));
    }

    private keyup(ev: KeyboardEvent) {
        let code = Input.toInternalKey(ev);
        this.keys[code] = 0;
    }

    private keydown(ev: KeyboardEvent) {
        let code = Input.toInternalKey(ev);
        if (!this.keys[code]) this.keys[code] = 0;
        this.keys[code]++;
    }

    private mouseMove(ev: MouseEvent) {
        this.mPosition.x = ev.offsetX;
        this.mPosition.y = ev.offsetY;
    }

    public on() {}

    public btn() {}

    public key(internalKey: string) {
        return this.keys[internalKey] > 0;
    }

    public axis(name: string): number {
        let axis = 0;

        const dax = this.mapping.axis[name];
        if (!dax) throw `Axis "${name}" not defined!`;

        if (dax.pad) {
            // gamepad input
        }

        if (dax.pos) {
            if (this.oneOfKeys(dax.pos.keys)) axis += 1;
            // todo btn's
        }

        if (dax.neg) {
            if (this.oneOfKeys(dax.neg.keys)) axis -= 1;
            // todo btn's
        }
        return axis;
    }

    private oneOfKeys(keys?: string[]) {
        if (!keys || keys.length == 0) return null;
        for (let i = 0; i < keys.length; i++) {
            if (this.keys[keys[i]] > 0) {
                return keys[i];
            }
        }
    }

    public mouse(): Vec {
        return this.mPosition;
    }

    //cursor() {}
}
export { Input };
