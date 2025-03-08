import Obj from "../Obj.js";

import Context from "../../graphics/Context.js";

import Shape from "./Shape.js";
import Apate from "../../Apate.js";

interface CollisionInfo<T> {
    self: Shape;
    collider: Collider;
    colliderShape: Shape;
    info: T;
}

type CollisionLayer = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;
export default class Collider<E extends Apate = Apate> extends Obj<E> {
    public shapes: Shape[] = [];
    public enabled: boolean = true;

    public layer: number = Collider.Layers.indexOf("debug");

    public collisionLayer: CollisionLayer = 0;
    public mask: number = 0xffff;

    constructor(shapes: Shape[] = [], layer: CollisionLayer = 0, parent?: Obj, name?: string) {
        super(parent, name);

        this.shapes = shapes;
        this.collisionLayer = layer;
    }

    public collisions: CollisionInfo<any>[] = [];

    public check(): number {
        if (!this.enabled) return this.collisions.length;
        if (!this.engine) throw new Error("Not connected to physics engine");
        let toCheck = this.engine.physics.get(this.mask);

        this.collisions.length = 0;
        for (let i = 0; i < this.shapes.length; i++) {
            let a = this.absolut();
            for (let j = 0; j < toCheck.length; j++) {
                for (let k = 0; k < toCheck[j].shapes.length; k++) {
                    let b = toCheck[j].absolut();
                    if (this.shapes[i].collision(a, toCheck[j].shapes[k], b))
                        this.collisions.push({
                            collider: toCheck[j],
                            colliderShape: toCheck[j].shapes[k],
                            self: this.shapes[i],
                            info: this.shapes[i].info(a, toCheck[j].shapes[k], b),
                        });
                }
            }
        }
        return this.collisions.length;
    }

    public draw(context: Context): void {
        if (context.engine.debug && this.enabled) {
            for (const shape of this.shapes) shape.draw(context, this.absolut());
        }
    }

    on_scene_enter(engine: E): void {
        super.on_scene_enter(engine);
        engine.physics.add(this);
    }

    on_scene_exit(engine: E): void {
        super.on_scene_exit(engine);
        engine.physics.remove(this);
    }
}
