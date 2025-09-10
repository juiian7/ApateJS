export interface NodeConfig {
    classes?: string[];
    styles?: Partial<CSSStyleDeclaration>;
    attribs?: { [name: string]: string };
}

class UINode<T extends HTMLElement = HTMLElement> {
    public element: T;

    constructor(type: keyof HTMLElementTagNameMap | T) {
        if (typeof type === "string") {
            this.element = document.createElement(type) as T;
        } else {
            this.element = type;
        }
    }

    private executed: boolean = false;
    private injectFunc: (node: UINode) => void;
    public inject(func: (node: UINode<T>) => void) {
        this.injectFunc = func;
    }

    public updateBaseConfig(config: NodeConfig) {
        if (config?.classes) {
            this.element.classList.add(...config?.classes);
            const toRemove = [...this.element.classList.values()].filter((v) => !config.classes.includes(v));
            this.element.classList.remove(...toRemove);
        }

        if (config?.styles) {
            for (const key in config.styles) {
                if (this.element.style[key] != config.styles[key]) this.element.style[key] = config.styles[key];
            }
        }

        if (config.attribs) {
            for (const key in config.attribs) {
                if (this.element.getAttribute(key) != config.attribs[key]) this.element.setAttribute(key, config.attribs[key]);
            }
        }
    }

    public css(...classes: string[]) {
        this.element.classList.add(...classes);
    }

    public append(child: UINode) {
        this.element.append(child.element);
    }

    public update(...args: any[]): any {
        if (this.injectFunc && !this.executed) {
            this.executed = true;
            this.injectFunc(this);
        }
    }

    public remove() {
        this.element.remove();
    }
}

type Constructor<T> = { new (...args: any[]): T };

class Context {
    private node: UINode;
    private ndx: number = 0;
    private children: Map<number, UINode> = new Map();
    private used: Set<number> = new Set();

    constructor(root: UINode) {
        this.node = root;
    }

    getNode<T extends UINode>(ctor: Constructor<T>, ...args: any[]): T {
        const key = this.ndx++;
        let node = this.children.get(key);

        if (!(node instanceof ctor)) {
            if (node) node.remove();

            node = new ctor(...args);
            this.node.append(node);
            this.children.set(key, node);
        }
        this.used.add(key);
        return node as T;
    }

    access<T extends UINode>(): T {
        return this.children.get(this.ndx - 1) as T;
    }

    private finish() {
        // clear unused
        for (const [key, val] of this.children.entries()) {
            if (!this.used.has(key)) {
                this.children.delete(key);
                val.remove();
            }
        }
        this.used.clear();
    }

    private static stack: Context[] = [];

    public static get current(): Context {
        if (this.stack.length == 0) return null;
        return this.stack[this.stack.length - 1];
    }

    public static push(ctx: Context) {
        Context.stack.push(ctx);
        this.current.ndx = 0;
    }

    public static pop() {
        Context.current.finish();
        Context.stack.pop();
    }
}

const listeners: { [key in keyof Partial<WindowEventMap>]: Function[] } = {};
export function customWindowEventListener<K extends keyof WindowEventMap>(
    type: K,
    listener: (ev: WindowEventMap[K], abort: () => void) => any,
    order: "first" | "last" = "first"
) {
    if (!listeners[type]) {
        const triggerAll = (ev) => {
            let shouldAbort = false;
            const catchAbort = () => (shouldAbort = true);
            for (const l of listeners[type] || []) {
                l(ev, catchAbort);
                if (shouldAbort) break;
            }
        };
        window.addEventListener(type, triggerAll);
        listeners[type] = [];
    }
    if (order == "first") listeners[type].unshift(listener);
    else listeners[type].push(listener);
}

const rootContexts = [];
export function setup(root: HTMLElement): Context {
    if (!root) throw new Error("Root is not specified!");

    const ctx = new Context(new UINode(root));
    rootContexts.push(ctx);
    return ctx;
}

export function start(ctx: Context) {
    Context.push(ctx);
}

export function finish() {
    Context.pop();
}

export function element<T extends keyof HTMLElementTagNameMap>(type: T, attributes?: Record<string, string>) {
    const node = Context.current.getNode<UINode<HTMLElementTagNameMap[T]>>(UINode, type);
    node.update(attributes);
    return node;
}

export { UINode, Context };

export const context = {
    access: () => Context.current.access(),
};
