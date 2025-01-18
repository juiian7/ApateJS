import Renderer from "../graphics/webgl2/Renderer.js";

export default class Obj {
    public name: string = "unnamed";

    public parent?: Obj = null;
    public children: Obj[] = [];

    constructor(parent?: Obj, name?: string) {
        if (name) this.name = name;
        if (parent) this.parent.add(this);
    }

    public add(...children: Obj[]): this {
        this.children.push(...children);
        for (const c of children) c.parent = this;
        return this;
    }

    public remove() {
        if (this.parent) {
            let i = this.parent.children.indexOf(this);
            if (i >= 0) this.parent.children.splice(i, 1);
            this.parent = null;
        }
    }

    public render(renderer: Renderer) {}

    public renderAll(renderer: Renderer) {
        // render self
        this.render(renderer);

        // render children
        let i = this.children.length;
        while (i-- > 0) this.children[i].renderAll(renderer);
    }
}
