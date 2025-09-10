import NumberInput from "../Components/NumberInput.js";
import { Context, customWindowEventListener, NodeConfig, UINode } from "./core.js";
import { WrapNode } from "./group.js";

interface PanelConfig extends NodeConfig {
    name: string;
    movable?: boolean;
    resize?: "both" | "vertical" | "horizontal" | "none";
    closeable?: boolean;
    onClose?: Function;

    dimensions?: {
        x: string;
        y: string;
        width?: string;
        height?: string;
    };
}

let panelAmount = 0;

class PanelNode extends WrapNode {
    private title: HTMLSpanElement;
    private close: HTMLSpanElement;
    private container: HTMLDivElement;

    private drag: boolean = false;
    private mouse: number[] = [];

    constructor(config: PanelConfig) {
        super("panel");

        if (config.movable) {
            this.element.style.top = panelAmount * 30 + "px";
            this.element.style.left = panelAmount * 30 + "px";
            panelAmount++;
        }

        if (config.dimensions) {
            this.element.style.top = config.dimensions.y;
            this.element.style.left = config.dimensions.x;
            if (config.dimensions.width) this.element.style.width = config.dimensions.width;
            if (config.dimensions.height) this.element.style.height = config.dimensions.height;
        }

        const header = document.createElement("div");
        header.classList.add("header");
        this.title = document.createElement("span");
        this.title.classList.add("title");
        this.close = document.createElement("span");
        this.close.classList.add("close");
        this.close.innerHTML = "&times;";
        this.close.style.display = "none";
        this.close.addEventListener("click", () => {
            this.element.remove();
            if (config.onClose) config.onClose();
        });
        this.container = document.createElement("div");
        this.container.classList.add("container");
        header.append(this.title, this.close);
        this.element.append(header, this.container);

        this.element.addEventListener("mousedown", (ev) => {
            ev.stopPropagation();

            if (
                this.element.style.resize &&
                this.element.style.resize != "none" &&
                this.element.offsetLeft + this.element.offsetWidth - ev.clientX <= 10 &&
                this.element.offsetTop + this.element.offsetHeight - ev.clientY <= 10
            ) {
                return;
            }

            this.drag = true;
            this.mouse = [this.element.offsetLeft - ev.clientX, this.element.offsetTop - ev.clientY];
        });
        window.addEventListener("mouseup", () => (this.drag = false));
        customWindowEventListener(
            "mousemove",
            (ev) => {
                if (this.drag) {
                    this.element.style.left = ev.clientX + this.mouse[0] + "px";
                    this.element.style.top = ev.clientY + this.mouse[1] + "px";
                }
            },
            "last"
        );

        this.update(config);
    }

    public append(child: UINode): void {
        //@ts-ignore
        this.container.appendChild(child.element);
    }

    public update(config: PanelConfig): void {
        this.updateBaseConfig(config);

        if (this.title.textContent != config.name) this.title.textContent = config.name;

        if (config.closeable && this.close.style.display == "none") this.close.style.display = "";
        else if (!config.closeable && this.close.style.display == "") this.close.style.display = "none";

        if (config.movable && !this.element.classList.contains("movable")) this.element.classList.add("movable");
        else if (!config.movable && this.element.classList.contains("movable")) this.element.classList.remove("movable");

        if (config.resize && this.element.style.resize != config.resize) this.element.style.resize = config.resize;
    }
}

const defaultConfig: PanelConfig = { name: "Unnamed", movable: true, resize: "none" };
function begin(config: PanelConfig) {
    config = { ...defaultConfig, ...config };
    const node = Context.current.getNode(PanelNode, config);
    node.update(config);
    node.begin();
}

function end() {
    Context.pop();
}

export const panel = {
    begin,
    end,
};
