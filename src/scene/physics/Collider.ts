import { Obj } from "../Obj.js";
import { Body } from "./Body.js";

import { Apate } from "../../Apate.js";
import { Context } from "../../graphics/Context.js";

import { Vec4 } from "../../core/Vec4.js";
import { Shape } from "./shapes/Shape.js";
import { CollisionInfo, CollisionLayer, RayHit } from "../../core/Physics.js";
import { Ray } from "../../core/Ray.js";

export class Collider<E extends Apate = Apate> extends Obj<E> {
    public shapes: Shape[] = [];
    public enabled: boolean = true;

    public belongsTo: Obj;

    public layer: number = Collider.Layers.indexOf("debug");

    private _collisionLayer: CollisionLayer = 0;
    public set collisionLayer(v: CollisionLayer) {
        this._collisionLayer = v;
        if (this.engine) this.engine.physics.layerUpdated(this);
    }
    public get collisionLayer(): CollisionLayer {
        return this._collisionLayer;
    }

    public mask: number = 0xffff;

    constructor(shape: Shape, layer: CollisionLayer = 0, parent?: Obj, name?: string) {
        super(parent, name);

        this.belongsTo = parent;
        this.collisionLayer = layer;

        if (shape) this.addShape(shape);
    }

    public addShape(shape: Shape) {
        this.shapes.push(shape);
        shape.transform.parent = this.transform;
        return this;
    }

    public collisions: CollisionInfo[] = [];

    public collectCollisions(): number {
        if (this.engine) return this.engine.physics.collisions(this);
        return 0;
    }

    public checkAgainst(other: Collider): boolean {
        let l = this.collisions.length;

        if (this.shapes.length == 0) console.warn("No Shapes assigned to: ", this);
        else if (other.shapes.length == 0) console.warn("No Shapes assigned to: ", other);

        for (let i = 0; i < this.shapes.length; i++) {
            for (let j = 0; j < other.shapes.length; j++) {
                if (this.shapes[i].collides(other.shapes[j])) {
                    this.collisions.push({ self: this, other, ownShape: this.shapes[i], otherShape: other.shapes[j] });
                }
            }
        }
        return this.collisions.length != l;
    }

    public checkAgainstRay(ray: Ray): RayHit {
        for (let i = 0; i < this.shapes.length; i++) {
            let distance = this.shapes[i].raycast(ray);
            if (distance !== null) return { collider: this, shape: this.shapes[i], distance };
        }
        return null;
    }

    /**
     *
     * @param ray
     * @returns The distance where the ray hit the collider
     */
    /* public raycast(ray: Ray): number {
        return 0;
    } */

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
