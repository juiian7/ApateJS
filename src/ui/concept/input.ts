import { Color } from "../../core/Color.js";
import { Vec4 } from "../../core/Vec4.js";
import { Context, customWindowEventListener, element, NodeConfig, UINode } from "./core.js";
import { text as uiText } from "./text.js";
import { group } from "./group.js";
import { button } from "./button.js";
import { panel } from "./panel.js";

class InputNode extends UINode<HTMLInputElement> {
    protected changed: boolean = false;
    protected updateValue: boolean = true;

    constructor() {
        super("input");

        this.element.addEventListener("input", () => (this.changed = true));
    }

    public update(value: string, config?: NodeConfig): any {
        if (config) this.updateBaseConfig(config);

        if (this.changed) {
            this.changed = false;
            value = this.element.value;
        } else if (this.element.value != value && this.updateValue) {
            this.element.value = value;
        }
        return value;
    }
}

interface NumberInputConfig extends NodeConfig {
    min?: number;
    max?: number;
    step?: number;
}

class NumberInput extends InputNode {
    constructor(value: string, config?: NumberInputConfig) {
        super();

        this.element.addEventListener("keydown", this.onKeyDown.bind(this));
        this.element.addEventListener("blur", this.onBlur.bind(this));
        this.element.addEventListener("focus", () => (this.updateValue = false));

        this.element.addEventListener("mousedown", this.onMouseDown.bind(this));
        window.addEventListener("mouseup", this.onMouseUp.bind(this));
        customWindowEventListener("mousemove", this.onMouseMove.bind(this));

        this.update(value, config);
    }

    public update(value: string, config?: NumberInputConfig) {
        super.update(value, config);

        if (config?.min !== undefined && config.min.toString() != this.element.min) this.element.min = config?.min.toString();
        if (config?.max !== undefined && config.max.toString() != this.element.max) this.element.max = config?.max.toString();
        if (config?.step !== undefined && config.step.toString() != this.element.step) this.element.step = config?.step.toString();

        return this.num;
    }

    private lastNum: number = 0;
    public get num(): number {
        if (Number.isNaN(+this.element.value)) return this.lastNum;
        this.lastNum = +this.element.value;
        return this.lastNum;
    }

    public set num(v: number) {
        if (this.element.max) v = Math.min(v, +this.element.max);
        if (this.element.min) v = Math.max(v, +this.element.min);

        this.element.value = v.toLocaleString();
        this.changed = true;
    }

    private onKeyDown(ev: KeyboardEvent) {
        if (ev.code.includes("Key")) ev.preventDefault();

        switch (ev.code) {
            case "ArrowUp":
                this.num++;
                break;
            case "ArrowDown":
                this.num--;
                break;
            case "Enter":
            case "Escape":
                this.element.blur();
                break;
        }
    }

    private isDown: boolean = false;
    private offset: number = 0;
    private onMouseDown(ev: MouseEvent) {
        this.isDown = true;
        this.offset = ev.clientX;
    }

    private onMouseUp(ev: MouseEvent) {
        this.isDown = false;
    }

    private onMouseMove(ev: MouseEvent, abort: Function) {
        if (this.isDown) {
            abort();
            const step = +this.element.step || 1;
            this.num += (ev.clientX - this.offset) * step;
            this.offset = ev.clientX;
        }
    }

    private onBlur() {
        if (this.element.value) this.num = eval(this.element.value);
        else this.element.value = "0";

        this.updateValue = true;
    }
}

function text(prompt: string, value: string): string;
function text(value: string): string;
function text(...args: string[]): string {
    if (args.length == 1) {
        const node = Context.current.getNode(InputNode);
        return node.update(args[0].toString());
    }
    group.beginWrap("input-wrap", "key-val");
    uiText.label(args[0]);
    args[1] = text(args[1]);
    group.end();
    return args[1];
}

function number(prompt: string, value: number, config: NumberInputConfig): number;
function number(prompt: string, value: number): number;
function number(value: number, config: NumberInputConfig): number;
function number(value: number): number;
function number(...args: any[]): number {
    let [promptOrValue, valueOrConfig, config] = args;
    if (args.length == 1 || (args.length == 2 && (typeof valueOrConfig == "object" || typeof valueOrConfig == "undefined"))) {
        const node = Context.current.getNode(NumberInput, promptOrValue, valueOrConfig);
        return +node.update(promptOrValue, valueOrConfig);
    }
    group.beginWrap("input-wrap", "key-val", "number-input");
    uiText.label(promptOrValue);
    if (config) valueOrConfig = number(valueOrConfig, config);
    else valueOrConfig = number(valueOrConfig);
    group.end();
    return valueOrConfig;
}

function vec(prompt: string, value: Vec4, dim: 2 | 3 | 4 = 3, config?: NumberInputConfig): Vec4 {
    group.beginWrap("input-wrap", "key-val", "vec-input");
    uiText.label(prompt);
    group.beginWrap("vec" + dim);
    const c = value.vec();
    for (let i = 0; i < dim; i++) c[i] = number(c[i], config);
    group.end();
    group.end();
    return value;
}

function colorPicker(prompt: string, value: Color): Color {
    group.beginWrap("input-wrap", "color-picker", "key-val");
    uiText.label(prompt);

    let close;
    if ((close = button.empty("", { type: "open", classes: ["stretch"], styles: { height: "100%" }, color: value }))) {
        panel.begin({
            name: prompt,
            movable: true,
            resize: "none",
            closeable: true,
            onClose: close,
        });
        color(value);
        panel.end();
    }

    group.end();

    return value;
}

function color(value: Color): Color {
    group.beginWrap("input-wrap", "color-input");

    element("button", { color: value.cssStr() }).inject((node) => {
        const oldUpdate = node.update.bind(node);
        node.update = (attrs) => {
            oldUpdate();
            if (attrs?.color && attrs.color != node.element.style.backgroundColor) node.element.style.backgroundColor = attrs.color;
        };

        node.element.style.height = "1.5rem";
        node.element.classList.add("stretch");

        node.element.addEventListener("click", () => {
            const col = document.createElement("input");
            col.value = value.toHex();
            col.type = "color";
            col.click();
            col.addEventListener("input", () => {
                const c = Color.fromHexStr(col.value);
                value.r = c.r;
                value.g = c.g;
                value.b = c.b;
            });
        });
    });

    const c = value.color(false);
    group.beginWrap("input-wrap", "child");
    c[0] = number("r", c[0], { min: 0, max: 255, step: 1 });
    c[1] = number("g", c[1], { min: 0, max: 255, step: 1 });
    c[2] = number("b", c[2], { min: 0, max: 255, step: 1 });
    c[3] = number("a", c[3], { min: 0, max: 255, step: 1 });
    group.end();
    group.end();
    return value;
}

export const input = {
    number,
    text,
    vec,
    color,
    colorPicker,
};
