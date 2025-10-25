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
                pad: 0,
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
                keys: ["Space", "KeyC"],
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

        window.addEventListener("gamepadconnected", this.gamepadConnected.bind(this));
        window.addEventListener("gamepaddisconnected", this.gamepadDisconnected.bind(this));
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

    private gamepadConnected(ev: GamepadEvent) {
        console.log(ev.gamepad.id, ev.gamepad);

        if (!ev.gamepad.vibrationActuator) return;

        console.log(ev.gamepad.vibrationActuator);

        ev.gamepad.vibrationActuator.playEffect("dual-rumble", {
            startDelay: 0,
            duration: 2000,
            weakMagnitude: 0.1,
            strongMagnitude: 1.0,
        });
    }
    private gamepadDisconnected(ev: GamepadEvent) {
        console.log("disconnected: ", ev.gamepad.id);
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

    public axis(name: string, pad: number = 0): number {
        let axis = 0;

        const dax = this.mapping.axis[name];
        if (!dax) throw `Axis "${name}" not defined!`;

        if (Number.isInteger(dax.pad) && this.pads.length > pad) {
            // gamepad input
            axis += this.pads[pad].axes[dax.pad];
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
                for (let j = 0; j < (buttons[i] as number[]).length; j++) {
                    sum += this.pads[pad].buttons[buttons[i][j]].value;
                }
            }
            if (sum > 0) break;
        }
        return sum;
    }

    public mouse(): Vec4 {
        return this.mPosition.clone();
    }

    public _fetch() {
        // called by engine to poll inputs (gamepads and other logic)
        this.pads = window.navigator.getGamepads();
    }

    //cursor() {}
}
export { Input };
