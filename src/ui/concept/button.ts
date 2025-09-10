import { Color } from "../../core/Color.js";
import { Context, NodeConfig, UINode } from "./core.js";

type ButtonAppearance = "text" | "empty" | "icon";
interface ButtonType {
    click: boolean;
    hover: boolean;
    toggle: boolean;
    open: () => void;
}
interface ButtonConfig<T extends keyof ButtonType> extends NodeConfig {
    type: T;
    color?: Color;
    appearance?: ButtonAppearance;
}

class ButtonNode extends UINode<HTMLButtonElement> {
    private shouldFire: boolean = false;
    private fireCounter: number = 0;

    private type: keyof ButtonType = "click";
    private appearance: ButtonAppearance = "empty";

    constructor(content: string | HTMLImageElement, config?: ButtonConfig<any>) {
        super("button");

        this.prepareFire = this.prepareFire.bind(this);
        this.stopFiring = this.stopFiring.bind(this);
        this.element.addEventListener("click", this.prepareFire);

        this.update(content, config);
    }

    private prepareFire() {
        if (this.type == "toggle") this.shouldFire = !this.shouldFire;
        else this.shouldFire = true;
        this.fireCounter = 0;
    }

    private stopFiring() {
        this.shouldFire = false;
        this.element.disabled = false;
        return true;
    }

    public update(content: string | HTMLImageElement, config?: ButtonConfig<any>): any {
        if (config) this.updateBaseConfig(config);

        if (config?.type && config.type != this.type) this.type = config.type;
        if (config?.appearance && config.appearance != this.appearance) this.appearance = config.appearance;

        if (this.appearance == "text" && this.element.textContent != content) this.element.textContent = content as string;
        else if (this.appearance == "empty" && this.element.innerHTML != content) this.element.innerHTML = content as string;
        else if (this.appearance == "icon") {
            if (typeof content == "string") {
                // i - class
            } else {
                // img - href
            }
        }

        if (config?.color && config.color.cssStr() != this.element.style.backgroundColor)
            this.element.style.backgroundColor = config.color.cssStr();

        if (this.shouldFire) {
            switch (this.type) {
                case "click":
                case "hover":
                    this.stopFiring();
                case "toggle":
                    this.fireCounter++;
                    return true;
                case "open":
                    this.fireCounter++;
                    this.element.disabled = true;
                    return this.stopFiring;
            }
        }

        return false;
    }
}

function text<T extends keyof ButtonType>(content: string, config: ButtonConfig<T>): ButtonType[T];
function text(content: string): boolean;
function text(...args: any[]): any {
    const node = Context.current.getNode(ButtonNode, ...args);
    if (args.length == 1) return node.update(args[0]);
    if (!args[1].appearance) args[1].appearance = "text";
    return node.update(args[0], args[1]);
}

function icon<T extends keyof ButtonType>(img: HTMLImageElement, config: ButtonConfig<T>): ButtonType[T];
function icon<T extends keyof ButtonType>(css: string, config: ButtonConfig<T>): ButtonType[T];
function icon(css: string): boolean;
function icon(img: HTMLImageElement): boolean;
function icon(...args: any[]): any {
    const node = Context.current.getNode(ButtonNode, ...args);
    if (args.length == 1) return node.update(args[0]);
    if (!args[1].appearance) args[1].appearance = "icon";
    return node.update(args[0], args[1]);
}

function empty<T extends keyof ButtonType>(innerHTML?: string, config?: ButtonConfig<T>): ButtonType[T] {
    const node = Context.current.getNode(ButtonNode, innerHTML, config);
    if (!config) return node.update(innerHTML);
    if (!config.appearance) config.appearance = "empty";
    return node.update(innerHTML, config);
}

export const button = {
    text,
    icon,
    empty,
};
