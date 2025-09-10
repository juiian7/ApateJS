import { button } from "./button.js";
import { Context, UINode } from "./core.js";
import { text } from "./text.js";

export class WrapNode extends UINode<HTMLDivElement> {
    protected context: Context;

    constructor(...classes: string[]) {
        super("div");

        this.context = new Context(this);

        this.element.classList.add(...classes);
    }

    public append(child: UINode): void {
        //@ts-ignore
        this.element.appendChild(child.element);
    }

    public begin() {
        Context.push(this.context);
    }

    public end() {
        Context.pop();
    }
}

function beginWrap(...classes: string[]) {
    const node = Context.current.getNode(WrapNode, ...classes);
    node.begin();
}

function begin(name?: string) {
    beginWrap("child");
    if (name) text.title(name);
}

function beginCollapsible(name: string) {
    beginWrap("child", "collapsible"); // could also be done by using an "UI.element()" and hide with css
    return button.empty(name, { type: "toggle", classes: ["collapsible"] });
}

function end() {
    Context.pop();
}

export const group = {
    begin,
    beginWrap,
    beginCollapsible,
    end,
};
