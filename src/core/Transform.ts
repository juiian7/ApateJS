import { Mat } from "../index.js";
import { Matrix } from "./Matrix.js";
import { Vec } from "./Vec.js";
import { Quaternion } from "./Quaternion.js";

const rFac = Math.PI / 180;

/**
 * This class is used to store transformations, which is done by the 3 properties:
 * {@link Core.Transform#position | position},
 * {@link Core.Transform#rotation | rotation} and
 * {@link Core.Transform#scale | scale}.
 *
 * <span class="note">
 * Like {@link Core.Vec}, {@link Core.Transform} is designed to work on the current reference.
 * Be sure to create copies if needed!
 * </span>
 *
 *
 * @example
 * // create a transform object with an initial position of 0, 10, 0
 * const transform = new Transform(0, 10, 0);
 * transform.rotate(0, 0, Math.PI); // rotate around the z axis by 180°
 * transform.move(0, -10, 0); // move to center
 *
 * @memberof Core
 */
class Transform {
    /**
     * The position component of the transformation.
     *
     * @type {Core.Vec}
     * @public
     */
    public position: Vec;
    /**
     * The rotation component of the transformation.
     *
     * @type {Core.Quaternion}
     * @public
     */
    public rotation: Quaternion;
    /**
     * The scale component of the transformation.
     *
     * @type {Vec}
     * @public
     */
    public size: Vec;

    public parent?: Transform;
    private mat: Matrix = Mat.identity();

    /**
     * Constructs a new Transform object with an optional initial position.
     * Also look at {@link Core.Transform.from | Transform.from} for more options when constructing transform objects
     *
     * @param {Core.Transform} parent - The transform with this is relative to, or undefined if is is absolute
     * @param {number} x - The x component of the position
     * @param {number} y - The y component of the position
     * @param {number} z - The z component of the position
     */
    constructor(parent?: Transform, x: number = 0, y: number = 0, z: number = 0) {
        this.parent = parent;
        this.position = Vec.from(x || 0, y || 0, z || 0, 0);
        this.rotation = new Quaternion();
        this.size = Vec.from(1, 1, 1, 0);
    }

    /**
     * Constructs a transform object and sets the given properties
     *
     * @param {Core.Vec} position - The postion of the transformation
     * @param {Core.Quaternion?} rotation - The rotation of the transformation
     * @param {Core.Vec?} scale - The scale of the transformation
     * @returns {Core.Transform} The created {@link Core.Transform | Transform} object.
     */
    public static from(position: Vec, rotation?: Quaternion, scale?: Vec) {
        return new Transform().setTo(position, rotation, scale);
    }

    /**
     * Sets the given properties on this object. If omitted they won't be set.
     *
     * @param {Core.Vec} position - The postion of the transformation
     * @param {Core.Quaternion?} rotation - The rotation of the transformation
     * @param {Core.Vec?} scale - The scale of the transformation
     * @returns {Core.Transform} The reference to this {@link Core.Transform | Transform} object.
     */
    public setTo(position: Vec, rotation?: Quaternion, scale?: Vec) {
        this.position.setTo(position);
        if (rotation) this.rotation.c.setTo(rotation.c);
        if (scale) this.size.setTo(scale);
        return this;
    }

    /**
     * Moves this {@link Core.Transform | Transform} by the amount of the given axes.
     *
     * @param {number} x - The amount to move on the x-axis.
     * @param {number} y - The amount to move on the y-axis.
     * @param {number} z - The amount to move on the z-axis.
     * @returns The reference to this {@link Core.Transform | Transform} object.
     */
    public move(x: number = 0, y: number = 0, z: number = 0) {
        this.position.x += x;
        this.position.y += y;
        this.position.z += z;
        return this;
    }

    private tmpQuat = new Quaternion();
    /**
     * Rotates the given axes of this {@link Core.Transform | Transform} by the amount of radians.
     *
     * @param {number} x - The radians to rotate on the x-axis.
     * @param {number} y - The radians to rotate on the y-axis.
     * @param {number} z - The radians to rotate on the z-axis.
     * @returns The reference to this {@link Core.Transform | Transform} object.
     */
    public rotate(x: number = 0, y: number = 0, z: number = 0) {
        this.tmpQuat.setAngles(x, y, z);
        Quaternion.multiply(this.rotation, this.tmpQuat, this.rotation);
        return this;
    }

    /**
     * Scales this {@link Core.Transform | Transform} by the amount of the given axes.
     *
     * @param {number} x - The amount to scale on the x-axis.
     * @param {number} y - The amount to scale on the y-axis.
     * @param {number} z - The amount to scale on the z-axis.
     * @returns The reference to this {@link Core.Transform | Transform} object.
     */
    public scale(x: number = 1, y: number = 1, z: number = 1) {
        this.size.x *= x;
        this.size.y *= y;
        this.size.z *= z;
        return this;
    }

    public static up: Vec = Vec.from(0, 1, 0);
    public lookAt(pos: Vec, up: Vec = Transform.up) {
        this.rotation.setMatrix(Mat.lookAt(this.position, pos, up));
        return this;
    }

    private calc() {
        // rotation mat
        this.mat = this.rotation.matrix();

        this.mat[0] *= this.size.x; // anchor
        this.mat[1] *= this.size.x;
        this.mat[2] *= this.size.x;
        this.mat[4] *= this.size.y;
        this.mat[5] *= this.size.y; // anchor
        this.mat[6] *= this.size.y;
        this.mat[8] *= this.size.z;
        this.mat[9] *= this.size.z;
        this.mat[10] *= this.size.z; // anchor
        this.mat[12] = this.position.x;
        this.mat[13] = this.position.y;
        this.mat[14] = this.position.z;

        if (this.parent) this.mat = Mat.multiply(this.parent.mat, this.mat);
    }

    private sync() {
        if (this.parent) this.parent.sync();
        this.calc();
    }

    /**
     * Gets a transformation matrix of this object. Also referred as "model" or "world" matrix.
     *
     * @returns {Matrix}
     */
    public matrix(): Matrix {
        this.sync();
        return this.mat;
    }

    /**
     * Gets the absolute transformation of this object
     * TODO: Not finished!
     *
     * @param {Transform} ref The destination to write to, if omitted a new transform object is created
     * @returns {Transform} the absolute transform (equal to ref)
     */
    public absolute(ref: Transform = new Transform()): Transform {
        this.sync();

        ref.position.x = this.mat[12];
        ref.position.y = this.mat[13];
        ref.position.z = this.mat[14];
        ref.parent = undefined;

        //TODO: also scale and rotation
        return ref;
    }
}

export { Transform };
