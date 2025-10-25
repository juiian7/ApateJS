import { Obj } from "../Obj.js";
import { Vec4 } from "../../core/Vec4.js";
import { Collider } from "./Collider.js";
import { Context } from "../../graphics/Context.js";
import { Apate } from "../../Apate.js";
import { CollisionInfo, Physics } from "../../core/Physics.js";
import { Ray } from "../../core/Ray.js";
import { Transform } from "../../core/Transform.js";

export class Body<E extends Apate = Apate> extends Obj<E> {
    public mass: number = 1;
    public velocity: Vec4;

    public grounded: boolean = false;
    public touchesLeftWall: boolean = false;
    public touchesRightWall: boolean = false;
    public wallThreshold: number = 0.01;

    private left: Ray = Ray.left(this.transform.position);
    private right: Ray = Ray.right(this.transform.position);

    public gravity: Vec4 = Vec4.from(0, -9.81, 0);

    private _collider: Collider<E>;
    public get collider(): Collider<E> {
        return this._collider;
    }
    public set collider(v: Collider<E>) {
        if (this._collider) {
            console.warn("Overwriting collider. Are you sure you want this?");
            //this._collider.remove();
        }
        this._collider = v;
        this._collider.belongsTo = this;
        if (!this.children.includes(v)) this.add(this._collider);
    }

    constructor(parent?: Obj, name?: string) {
        super(parent, name);

        this.collider = new Collider(null, "trigger", 0, this, (name || "unnamed") + "-collider");
        this.velocity = Vec4.from(0, 0, 0);
    }

    private clone: Vec4 = new Vec4();
    public accelerate(force: Vec4) {
        this.clone.setTo(force).multiply(this.mass);
        this.clone.multiply(this.engine!.delta / 1000);
        this.velocity.add(this.clone);
    }

    public impulse(force: Vec4) {
        this.clone.setTo(force).multiply(this.mass);
        this.velocity.add(force);
    }

    private _update() {
        if (!this.engine) throw new Error("Body is not connected to physics engine -> not in active scene?");
        if (this.gravity) {
            this.accelerate(this.gravity);
        }
        if (this.velocity.y != 0) this.grounded = false;
        if (this.velocity.x != 0) (this.touchesLeftWall = false), (this.touchesRightWall = false);

        this.collider.flushFrameCollisions();
    }

    public slide() {
        this._update();

        const factor = this.engine!.delta * 0.001; // delta in seconds
        // apply vel and if collision change vel along colliding obj
        // apply y
        this.transform.move(0, this.velocity.y * factor, 0);
        this.engine!.physics.collisions(this.collider);

        if (this.collider.collisionsToResolve.length > 0) {
            // resolve
            //TODO: physically resolving...
            this.engine!.physics.resolve(this.collider);
            if (Math.sign(this.velocity.y) == Math.sign(this.gravity.y)) this.grounded = true; // assume ground is always direction of gravity
            this.velocity.y = 0;
        }

        // apply x
        this.transform.move(this.velocity.x * factor, 0, 0);
        this.engine!.physics.collisions(this.collider);

        if (this.collider.collisionsToResolve.length > 0) {
            // resolve
            //  TODO: physically resolving...
            this.engine!.physics.resolve(this.collider);

            if (this.velocity.x < 0) this.touchesLeftWall = true;
            else this.touchesRightWall = true;

            this.velocity.x = 0;
        }
    }

    public collide(): CollisionInfo[] {
        this._update();

        const factor = this.engine!.delta * 0.001; // delta in seconds
        // apply vel, and return optional collision
        this.transform.move(this.velocity.x * factor, this.velocity.y * factor, 0);

        // check collisions
        this.engine!.physics.collisions(this.collider);
        return this.collider.collisions;
    }

    public draw(context: Context): void {}
}
