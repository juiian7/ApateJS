import { Vec4 } from "./Vec4.js";

interface BrowserKey {
    code: string;
    shiftKey?: boolean;
    ctrlKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
}

type ButtonEvents = "down" | "up" | "pressed";

class Input {
    private keys: { [code: string]: number } = {};
    private mPosition: Vec4 = Vec4.from(0, 0, 0);

    private pads: Gamepad[] = [];

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
        buttons: {
            jump: {
                keys: ["Space"],
                btn: [0],
            },
            combination: {
                keys: [["KeyS", "KeyD"]],
                btn: [],
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

    public on(btn: string, event: ButtonEvents, handler: (value: number) => void) {}

    public btn(name: string): number {
        const mapping = this.mapping.buttons[name];
        if (!mapping) throw `Button "${name}" not defined!`;

        const btnValue = this.valueOfPadButtons(mapping.btn);
        if (btnValue) return btnValue;

        if (this.oneOfKeys(mapping.keys)) return 1;

        return 0;
    }

    public key(internalKey: string): boolean {
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

    private oneOfKeys(keys?: (string | string[])[]) {
        if (!keys || keys.length == 0) return null;
        for (let i = 0; i < keys.length; i++) {
            if (typeof keys[i] == "string") {
                if (this.keys[keys[i] as string] > 0) return keys[i];
            } else {
                let valid = true;
                for (let j = 0; j < keys[i].length; j++) {
                    if (!this.keys[keys[i][j]]) {
                        valid = false;
                        break;
                    }
                }
                if (valid) return keys[i];
            }
        }
    }

    private valueOfPadButtons(buttons?: (number | number[])[], pad: number = 0): number {
        if (this.pads.length <= pad || !buttons || buttons.length == 0) return null;
        let sum = 0;
        for (let i = 0; i < buttons.length; i++) {
            if (typeof buttons[i] == "number") {
                sum += this.pads[pad].buttons[buttons[i] as number].value;
            } else {
                let valid = true;
                for (let j = 0; j < (buttons[i] as number[]).length; j++) {
                    if (!this.pads[pad].buttons[buttons[i][j]].value) {
                        valid = false;
                        break;
                    }
                }
                if (valid) sum += 1;
            }
            if (sum >= 1) {
                sum = 1;
                break;
            }
        }
        return sum;
    }

    public mouse(): Vec4 {
        return this.mPosition.clone();
    }

    public _fetch() {
        // called by engine to poll inputs (gamepads and other logic)
    }

    //cursor() {}
}
export { Input };
