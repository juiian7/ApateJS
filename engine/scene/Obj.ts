import Apate from "../Apate.js";
import Transform from "../core/Transform.js";
import Context from "../graphics/Context.js";
import Renderer from "../graphics/webgl2/Renderer.js";

export interface Drawable {
    render(context: Context): void;
}

export default class Obj<E extends Apate = Apate> implements Drawable {
    public static Layers: string[] = ["bg", "default", "ui", "debug"];

    public engine?: E;

    public name: string = "unnamed";
    public layer: number = Obj.Layers.indexOf("default");

    public parent?: Obj<E> = null;
    public children: Obj<E>[] = [];

    public transform: Transform;
    private _absolut: Transform;

    /* public set<T extends keyof Obj<E>, O extends Obj<E>>(name: T, value: O[T]) {
        // @ts-ignore
        this[name] = value;
        return;
    } */

    constructor(parent?: Obj, name?: string) {
        if (name) this.name = name;
        if (parent) parent.add(this);

        this.transform = new Transform();
        this._absolut = new Transform();
    }

    public add(...children: Obj<E>[]): this {
        this.children.push(...children);
        for (const c of children) {
            c.parent = this;
            if (this.engine) c.recCall("on_scene_enter", this.engine);
        }
        return this;
    }

    public ref(): this {
        return this;
    }

    public remove() {
        if (this.parent) {
            let i = this.parent.children.indexOf(this);
            if (i >= 0) this.parent.children.splice(i, 1);
            this.parent = null;
        }
        if (this.engine) this.recCall("on_scene_exit", this.engine);
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

    //protected flatten(): Obj[] {}

    public render(context: Context) {
        for (let i = 0; i < Obj.Layers.length; i++) {
            this.drawRec(context, i);
        }
    }

    public absolut(): Transform {
        if (!this.parent) {
            this._absolut.setTo(this.transform.position, this.transform.rotation, this.transform.scale);
            return this._absolut;
        }

        this.parent._absolut = this.parent.absolut();
        this._absolut.setTo(this.parent._absolut.position, this.parent._absolut.rotation, this.parent._absolut.scale);
        this._absolut.add(this.transform.position, this.transform.rotation, this.transform.scale);

        return this._absolut;
    }

    public root(): Obj<E> {
        return this.parent ? this.parent.root() : this;
    }

    public recCall(name: keyof Obj, ...params: any[]) {
        //@ts-ignore
        this[name](...params);
        let i = this.children.length;
        while (i-- > 0) this.children[i].recCall(name, ...params);
    }

    on_scene_enter(engine: E) {
        this.engine = engine;
    }
    on_scene_exit(engine: E) {
        this.engine = null;
    }
}
