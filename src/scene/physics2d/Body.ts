import Obj from "../Obj.js";
import Vec from "../../core/Vec.js";
import Collider, { CollisionInfo } from "./Collider.js";
import Context from "../../graphics/Context.js";
import Apate from "../../Apate.js";

export default class Body<E extends Apate = Apate> extends Obj<E> {
    public mass: number = 1;
    public acceleration: Vec;
    public velocity: Vec;

    public gravity: Vec = Vec.from(0, -1, 0);

    public collider: Collider<E>;

    constructor(collider?: Collider<E>, parent?: Obj, name?: string) {
        super(parent, name);

        if (collider) {
            this.add(collider);
            this.collider = collider;
        } else new Collider([], 0, this, name ? name + "-collider" : null);

        this.acceleration = Vec.from(0, 0, 0);
        this.velocity = Vec.from(0, 0, 0);
    }

    private clone: Vec = new Vec([0, 0, 0, 0]);
    public addForce(force: Vec) {
        this.clone.setTo(force).multiplyScalar(20 / 1000); // needs to include delta?
        this.acceleration.add(this.clone);
    }

    private _update() {
        if (this.gravity) this.addForce(this.gravity);
        this.velocity.add(this.acceleration);
    }

    public slide() {
        this._update();

        // apply vel and if collision change vel along colliding obj
        // apply y
        this.transform.move(0, this.velocity.y, 0);
        if (this.collider.check() > 0) {
            // resolve
            // this.velocity.y > 0 -> up
        }
        this.transform.move(this.velocity.x, 0, 0);
        if (this.collider.check() > 0) {
            // resolve
            // this.velocity.x > 0 -> right
        }
    }

    public collide(): CollisionInfo<any>[] {
        this._update();

        // apply vel, and return optional collision
        this.transform.move(this.velocity.x, this.velocity.y, 0);

        // check collisions
        this.collider.check();
        return this.collider.collisions;
    }

    public draw(context: Context): void {}
}
