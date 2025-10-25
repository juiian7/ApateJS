import { Obj } from "../Obj.js";
import { Body } from "./Body.js";

import { Apate } from "../../Apate.js";
import { Context } from "../../graphics/Context.js";

import { Vec4 } from "../../core/Vec4.js";
import { Shape } from "./shapes/Shape.js";
import { CollisionInfo, CollisionLayer, RayHit, CollisionType } from "../../core/Physics.js";
import { Ray } from "../../core/Ray.js";
import { Color } from "../../core/Color.js";

export class Collider<E extends Apate = Apate> extends Obj<E> {
    public shapes: Shape[] = [];
    public enabled: boolean = true;

    public debugColor: Color = Color.fromHex(0x00ff0044);

    public type: CollisionType = "static";

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

    constructor(shape: Shape, type: CollisionType = "static", layer: CollisionLayer = 0, parent?: Obj, name?: string) {
        super(parent, name);

        this.belongsTo = parent;
        this.type = type;
        this.collisionLayer = layer;

        if (shape) this.addShape(shape);
    }

    public addShape(shape: Shape) {
        this.shapes.push(shape);
        shape.transform.parent = this.transform;
        return this;
    }

    public collisions: CollisionInfo[] = [];
    public collisionsLastFrame: CollisionInfo[] = [];
    public collisionsToResolve: CollisionInfo[] = [];

    public collectCollisions(): number {
        if (this.engine) return this.engine.physics.collisions(this);
        return 0;
    }

    public flushFrameCollisions() {
        this.collisionsLastFrame.length = this.collisions.length;
        for (let i = 0; i < this.collisions.length; i++) this.collisionsLastFrame[i] = this.collisions[i];
        this.collisions.length = 0;
    }

    public checkAgainst(other: Collider): boolean {
        if (this.shapes.length == 0) console.warn("No Shapes assigned to: ", this);
        else if (other.shapes.length == 0) console.warn("No Shapes assigned to: ", other);

        let foundCollision = false;
        for (let i = 0; i < this.shapes.length; i++) {
            for (let j = 0; j < other.shapes.length; j++) {
                if (this.shapes[i].collides(other.shapes[j])) {
                    foundCollision = true;
                    const info = { self: this, other, ownShape: this.shapes[i], otherShape: other.shapes[j] };
                    this.collisions.push(info);
                    if (other.type == "static") this.collisionsToResolve.push(info);

                    // fire event if new
                    let alreadyCaptured = false;
                    for (let i = 0; i < this.collisionsLastFrame.length; i++) {
                        if (
                            this.collisionsLastFrame[i].otherShape == info.otherShape &&
                            this.collisionsLastFrame[i].ownShape == info.ownShape
                        ) {
                            alreadyCaptured = true;
                        }
                    }
                    if (!alreadyCaptured) {
                        this.on_enter(info);
                        info.other.on_enter(info);
                    }
                }
            }
        }
        if (!foundCollision && this.collisionsLastFrame.length > 0) {
            // release previous collisions
            for (let i = 0; i < this.collisionsLastFrame.length; i++) {
                if (this.collisionsLastFrame[i].other != other) continue;

                // clean up unresolved which are no longer colliding
                const ndx = this.collisionsToResolve.indexOf(this.collisionsLastFrame[i]);
                if (ndx >= 0) this.collisionsToResolve.splice(i, 1);

                this.on_leave(this.collisionsLastFrame[i]);
                this.collisionsLastFrame[i].other.on_leave(this.collisionsLastFrame[i]);
            }
        }
        return foundCollision;
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
            for (const shape of this.shapes) shape.debugDraw(context, this.debugColor);
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

    on_enter(other: CollisionInfo): void {}
    on_leave(other: CollisionInfo): void {}
}
