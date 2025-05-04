import { Obj } from "../Obj.js";
import { Vec } from "../../core/Vec.js";
import { Collider } from "./Collider.js";
import { Context } from "../../graphics/Context.js";
import { Apate } from "../../Apate.js";
import { CollisionInfo } from "../../core/Physics.js";

export class Body<E extends Apate = Apate> extends Obj<E> {
    public mass: number = 1;
    public velocity: Vec;

    public gravity: Vec = Vec.from(0, -9.81, 0);

    public collider: Collider<E>;

    constructor(collider?: Collider<E>, parent?: Obj, name?: string) {
        super(parent, name);

        if (collider) {
            this.add(collider);
            this.collider = collider;
        } //else this.collider = new Collider(0, this, name ? name + "-collider" : null);

        this.velocity = Vec.from(0, 0, 0);
    }

    private clone: Vec = new Vec([0, 0, 0, 0]);
    public accelerate(force: Vec) {
        this.clone.setTo(force).multiplyScalar(this.engine!.delta / 1000);
        this.velocity.add(this.clone);
    }

    public impulse(force: Vec) {
        this.velocity.add(force);
    }

    private _update() {
        if (!this.engine) throw new Error("Body is not connected to physics engine -> not in active scene?");
        if (this.gravity) {
            this.accelerate(this.gravity);
        }
    }

    public slide() {
        this._update();

        const factor = this.engine!.delta * 0.001; // delta in seconds
        // apply vel and if collision change vel along colliding obj
        // apply y
        this.transform.move(0, this.velocity.y * factor, 0);
        let info = this.engine!.physics.collisions(this.collider);
        if (info.length > 0) {
            // resolve
            // this.velocity.y > 0 -> up
        }
        this.transform.move(this.velocity.x * factor, 0, 0);
        info = this.engine!.physics.collisions(this.collider);
        if (info.length > 0) {
            // resolve
            // this.velocity.x > 0 -> right
        }
    }

    public collide(): CollisionInfo[] {
        this._update();

        const factor = this.engine!.delta * 0.001; // delta in seconds
        // apply vel, and return optional collision
        this.transform.move(this.velocity.x * factor, this.velocity.y * factor, 0);

        // check collisions
        return this.engine!.physics.collisions(this.collider);
    }

    public draw(context: Context): void {}
}
