import { Obj } from "../Obj.js";
import { Body } from "./Body.js";

import { Context } from "../../graphics/Context.js";

import { Apate } from "../../Apate.js";
import { Shape } from "./shapes/Shape.js";
import { CollisionInfo } from "../../core/Physics.js";

type CollisionLayer = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;
export class Collider<E extends Apate = Apate> extends Obj<E> {
    private shapes: Shape[] = [];
    public enabled: boolean = true;

    public belongsTo: Obj;

    public layer: number = Collider.Layers.indexOf("debug");

    public collisionLayer: CollisionLayer = 0;
    public mask: number = 0xffff;

    constructor(shapes: Shape[] = [], layer: CollisionLayer = 0, parent?: Obj, name?: string) {
        super(parent, name);

        this.belongsTo = parent;
        this.shapes = [...shapes];
        this.collisionLayer = layer;
    }

    public addShape(shape: Shape) {
        this.shapes.push(shape);
        shape.transform.parent = this.transform;
        return this;
    }

    public collisions: CollisionInfo[] = [];

    public checkAgainst(other: Collider): boolean {
        let l = this.collisions.length;
        for (let i = 0; i < this.shapes.length; i++) {
            for (let j = 0; j < other.shapes.length; j++) {
                if (this.shapes[i].collides(other.shapes[j])) {
                    this.collisions.push({ self: this, other, ownShape: this.shapes[i], otherShape: other.shapes[j] });
                }
            }
        }
        return this.collisions.length != l;
    }

    public draw(context: Context): void {
        if (context.engine.debug && this.enabled) {
            for (const shape of this.shapes) shape.debugDraw(context);
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
