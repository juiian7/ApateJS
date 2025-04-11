import { Comp } from "../WebUI/src/index.js";

export default class NumberInput extends Comp.Input {
    private _focused: boolean = false;
    public get isFocused(): boolean {
        return this._focused;
    }
    public set isFocused(v: boolean) {
        if (!v) this.blur();
    }

    constructor() {
        super();

        this.on("keydown", this.onKeyDown.bind(this));
        this.on("mousedown", this.onMouseDown.bind(this));
        window.addEventListener("mouseup", this.onMouseUp.bind(this));
        window.addEventListener("mousemove", this.onMouseMove.bind(this));
        this.on("focus", this.onFocus.bind(this));
        this.on("blur", this.onBlur.bind(this));
        this.on("click", () => this.select());

        this.style("outline", "none");

        this.num = 0;
    }

    public set num(v: number) {
        this.value = v.toLocaleString();
    }

    public get num(): number {
        return +this.value;
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
                this.blur();
                break;
        }

        this.update();
    }

    private onFocus(ev: Event) {
        this._focused = true;
    }

    private onBlur(ev: Event) {
        this.update();
        this._focused = false;
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

    private onMouseMove(ev: MouseEvent) {
        if (this.isDown) {
            this.num += ev.clientX - this.offset;
            this.offset = ev.clientX;
            this.dispatch(new Event("input"));
        }
    }

    private update() {
        if (this.value) this.value = eval(this.value);
        else this.num = 0;
    }
}
