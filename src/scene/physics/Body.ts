import { Obj } from "../Obj.js";
import { Vec4 } from "../../core/Vec4.js";
import { Collider } from "./Collider.js";
import { Context } from "../../graphics/Context.js";
import { Apate } from "../../Apate.js";
import { CollisionInfo, Physics } from "../../core/Physics.js";

export class Body<E extends Apate = Apate> extends Obj<E> {
    public mass: number = 1;
    public velocity: Vec4;

    public grounded: boolean = false;
    public touchesWall: boolean = false;

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
        this.add(this._collider);
    }

    constructor(parent?: Obj, name?: string) {
        super(parent, name);

        this.collider = new Collider(null, 0, this, (name || "unnamed") + "-collider");
        this.velocity = Vec4.from(0, 0, 0);
    }

    private clone: Vec4 = new Vec4();
    public accelerate(force: Vec4) {
        this.clone.setTo(force).multiply(this.engine!.delta / 1000);
        this.velocity.add(this.clone);
    }

    public impulse(force: Vec4) {
        this.velocity.add(force);
    }

    private _update() {
        if (!this.engine) throw new Error("Body is not connected to physics engine -> not in active scene?");
        if (this.gravity) {
            this.accelerate(this.gravity);
        }
        this.grounded = false;
        this.touchesWall = false;
    }

    public slide() {
        this._update();

        const factor = this.engine!.delta * 0.001; // delta in seconds
        // apply vel and if collision change vel along colliding obj
        // apply y
        this.transform.move(0, this.velocity.y * factor, 0);

        if (this.engine!.physics.collisions(this.collider) > 0) {
            // resolve
            this.engine!.physics.resolve(this.collider);
            this.velocity.y = 0;
            // this.velocity.y > 0 -> up ? TODO: physically resolving
            this.grounded = true;
        }
        this.transform.move(this.velocity.x * factor, 0, 0);
        if (this.engine!.physics.collisions(this.collider) > 0) {
            // resolve
            this.engine!.physics.resolve(this.collider);
            this.velocity.x = 0;
            // this.velocity.x > 0 -> right
            this.touchesWall = true;
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
