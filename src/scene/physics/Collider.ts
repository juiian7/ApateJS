import { Obj } from "../Obj.js";

import { Context } from "../../graphics/Context.js";

//import { Shape } from "./Shape.js";
import { Apate } from "../../Apate.js";
import { Vec } from "../../core/Vec.js";
import { Shape } from "./shapes/Shape.js";
import { CollisionInfo } from "../../core/Physics.js";

type CollisionLayer = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;
export class Collider<E extends Apate = Apate> extends Obj<E> {
    private shapes: Shape[] = [];
    public enabled: boolean = true;

    public layer: number = Collider.Layers.indexOf("debug");

    public collisionLayer: CollisionLayer = 0;
    public mask: number = 0xffff;

    constructor(/* shapes: Shape[] = [], */ layer: CollisionLayer = 0, parent?: Obj, name?: string) {
        super(parent, name);

        //this.shapes = shapes;
        this.collisionLayer = layer;
    }

    public addShape(shape: Shape) {
        this.shapes.push(shape);
        shape.transform.parent = this.transform;
    }

    public checkAgainst(col: Collider): CollisionInfo[] {
        let infos: CollisionInfo[] = [];
        for (let i = 0; i < this.shapes.length; i++) {
            for (let j = 0; j < col.shapes.length; j++) {
                if (this.shapes[i].collides(col.shapes[j])) infos.push({ self: this.shapes[i], other: this.shapes[j] });
            }
        }
        return infos;
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
