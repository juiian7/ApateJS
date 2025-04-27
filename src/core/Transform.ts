import { Matrix, transform } from "./Matrix.js";
import { Vec } from "./Vec.js";

const rFac = Math.PI / 180;

/**
 * This class is used to store transformations, which is done by the 3 properties:
 * {@link Core.Transform#position | position},
 * {@link Core.Transform#rotation | rotation} and
 * {@link Core.Transform#scale | scale}.
 *
 * <span class="note info">
 * Remember: Angels of rotations are specified in radians!
 * </span>
 *
 * <span class="note">
 * Like {@link Core.Vec}, {@link Core.Transform} is designed to work on the current reference.
 * Be sure to create copies if needed!
 * </span>
 *
 *
 * @example
 * // create a transform object with an initial position of 0,10,0
 * const transform = new Transform(0, 10, 0);
 * transform.rotation.z = Math.PI; // rotate around the z axis by 180°
 * transform.move(0,-10); // move to center
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
     * @type {Core.Vec}
     * @public
     */
    public rotation: Vec;
    /**
     * The scale component of the transformation.
     *
     * @type {Vec}
     * @public
     */
    public scale: Vec;

    /**
     * Constructs a new Transform object with a optional initial position.
     * Also look at {@link Core.Transform.from | Transform.from} for more options when constructing transform objects
     *
     * @param {number} x - The x component of the position
     * @param {number} y - The y component of the position
     * @param {number} z - The z component of the position
     */
    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.position = Vec.from(x || 0, y || 0, z || 0, 0);
        this.rotation = Vec.from(0, 0, 0, 0);
        this.scale = Vec.from(1, 1, 1, 0);
    }

    /**
     * Constructs a transform object and sets the given properties
     *
     * @param {Core.Vec} position - The postion of the transformation
     * @param {Core.Vec?} rotation - The rotation of the transformation
     * @param {Core.Vec?} scale - The scale of the transformation
     * @returns {Core.Transform} The created {@link Core.Transform | Transform} object.
     */
    public static from(position: Vec, rotation?: Vec, scale?: Vec) {
        return new Transform().setTo(position, rotation, scale);
    }

    /**
     * Sets the given properties on this object. If omitted they won't be set.
     *
     * @param {Core.Vec} position - The postion of the transformation
     * @param {Core.Vec?} rotation - The rotation of the transformation
     * @param {Core.Vec?} scale - The scale of the transformation
     * @returns {Core.Transform} The reference to this {@link Core.Transform | Transform} object.
     */
    public setTo(position: Vec, rotation?: Vec, scale?: Vec) {
        this.position.setTo(position);
        if (rotation) this.rotation.setTo(rotation);
        if (scale) this.scale.setTo(scale);
        return this;
    }

    /**
     * Adds the given properties to this object.
     *
     * @param {Core.Vec} translation - The translation to add
     * @param {Core.Vec?} rotation - The rotation to add
     * @param {Core.Vec?} scale - The scale to add
     * @returns The reference to this {@link Core.Transform | Transform} object.
     */
    public add(translation: Vec, rotation?: Vec, scale?: Vec) {
        this.position.add(translation);
        if (rotation) this.rotation.add(rotation);
        if (scale) this.scale.multiply(scale);
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

    /**
     * Rotates this {@link Core.Transform | Transform} by the amount of the given axes.
     *
     * @param {number} x - The amount to rotate on the x-axis.
     * @param {number} y - The amount to rotate on the y-axis.
     * @param {number} z - The amount to rotate on the z-axis.
     * @returns The reference to this {@link Core.Transform | Transform} object.
     */
    public rotate(x: number = 0, y: number = 0, z: number = 0) {
        this.rotation.x += x * rFac;
        this.rotation.y += y * rFac;
        this.rotation.z += z * rFac;
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
    public size(x: number = 1, y: number = 1, z: number = 1) {
        this.scale.x *= x;
        this.scale.y *= y;
        this.scale.z *= z;
        return this;
    }

    /**
     * Gets a transformation matrix of this object. Also referred as "model" or "world" matrix.
     *
     * @returns {Matrix}
     */
    public matrix(): Matrix {
        return transform(this);
    }
}

export { Transform };
