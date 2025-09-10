import { Color } from "../../core/Color.js";
import { Context, NodeConfig, UINode } from "./core.js";

interface TextConfig extends NodeConfig {
    color?: Color;
}

class TextNode extends UINode {
    constructor(content: string, config?: TextConfig) {
        super("span");

        this.update(content);
    }

    public update(content: string, config?: TextConfig): void {
        if (config) this.updateBaseConfig(config);

        if (content != this.element.innerText) this.element.innerText = content;
    }
}

function label(content: string, config?: TextConfig) {
    if (config && config.classes && !config.classes.includes("label")) config.classes.push("label");
    config = { classes: ["label"], ...config };
    const node = Context.current.getNode(TextNode, content);
    node.update(content, config);
}

function title(content: string) {
    const node = Context.current.getNode(TextNode, content, { classes: ["title", "primary"] });
    node.update(content);
}

export const text = {
    label,
    title,
};
