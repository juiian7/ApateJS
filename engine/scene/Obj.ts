import Transform from "../core/Transform.js";
import Context from "../graphics/Context.js";
import Renderer from "../graphics/webgl2/Renderer.js";

export interface Drawable {
    render(context: Context): void;
}

export default class Obj implements Drawable {
    public static Layers: string[] = ["bg", "default", "ui"];

    public name: string = "unnamed";
    public layer: number = Obj.Layers.indexOf("default");

    public parent?: Obj = null;
    public children: Obj[] = [];

    public transform: Transform;
    private absolut: Transform;

    constructor(parent?: Obj, name?: string) {
        if (name) this.name = name;
        if (parent) parent.add(this);

        this.transform = new Transform();
        this.absolut = new Transform();
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

    public draw(context: Context) {}
    public drawAfter(context: Context) {}

    protected drawRec(context: Context, layer: number) {
        // render self
        if (layer == this.layer) this.draw(context);

        // render children
        let i = this.children.length;
        while (i-- > 0) this.children[i].drawRec(context, layer);

        if (layer == this.layer) this.drawAfter(context);
    }

    public render(context: Context) {
        for (let i = 0; i < Obj.Layers.length; i++) {
            this.drawRec(context, i);
        }
    }

    public absolutTransform(): Transform {
        if (!this.parent) {
            this.absolut.setTo(this.transform.position, this.transform.rotation, this.transform.scale);
            return this.absolut;
        }

        this.parent.absolut = this.parent.absolutTransform();
        this.absolut.setTo(this.parent.absolut.position, this.parent.absolut.rotation, this.parent.absolut.scale);
        this.absolut.add(this.transform.position, this.transform.rotation, this.transform.scale);

        return this.absolut;
    }
}
