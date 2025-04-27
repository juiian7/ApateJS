/**
 * This class is used to create and operate with 4 dimensional vectors.
 * Vectors are typically used for storing positions, rotations, scales and also colors.
 * To make it practicable for working with colors the components
 * {@link Core.Vec#x | x}, {@link Core.Vec#y | y}, {@link Core.Vec#z | z}, {@link Core.Vec#w | w} can be replaced by
 * {@link Core.Vec#r | r}, {@link Core.Vec#g | g}, {@link Core.Vec#b | b}, {@link Core.Vec#a | a}.
 * <br>
 * A Vec object is in fact just a mask to operate on an array with the components more elegant.
 * The raw array can be accessed with {@link Core.Vec#vec | this.vec()}.
 *
 * <span class="note">
 * Important: Vec is designed to work on the current reference. Be sure to create copies if needed!
 * </span>
 *
 * @example
 * // create a vector (0,0,0,0) and do few operations
 * const position = Vec.from(0,0);
 * postion.add(otherVec).multiplyScalar(3.4);
 *
 * @memberof Core
 */
class Vec {
    /**
     * Creates a Vec object from a given number. Typically used for specifying hex colors.
     *
     * @static
     * @param {number} num - The value of the vector, formatted in a single number (see hex colors -> 0xff00ff)
     * @param {number} bit - The number of bits per component
     * @returns {Core.Vec} - The created vector
     */
    public static fromHex(num: number, bit: number = 8): Vec {
        let mask = 2 ** bit - 1;
        let v = new Vec([
            (num >> (bit * 3)) & mask,
            (num >> (bit * 2)) & mask,
            (num >> bit) & mask,
            num & mask, //
        ]);
        return v;
    }

    /**
     * Crates a Vec object given by all components (x,y,z,w)
     *
     * @static
     * @param {number} x the x component of the vector
     * @param {number} y the y comp...
     * @param {number} z the z ...
     * @param {number} w ...
     * @returns {Core.Vec} - The created object
     */
    public static from(x: number, y: number, z: number = 0, w: number = 0): Vec {
        return new Vec([x, y, z, w]);
    }

    protected data: number[];
    protected offset: number = 0;
    protected end: number = 3;

    /**
     * Dimension of the vector. Should be 4 in most cases.
     * @returns {number} The number of components.
     */
    public get dimension(): number {
        return this.end - this.offset;
    }

    /**
     * Creates a new Vec object. If you want more simple constructors look at:
     * {@link Core.Vec.from | Vec.from} and {@link Core.Vec.fromHex | Vec.from}
     *
     * @param {number[]} data - The array behind the vector, storing the components
     * @param {number} offset - The index of the array with the first component
     * @param {number} end - The index of the array with the last component
     */
    public constructor(data: number[], offset: number = 0, end: number = 3) {
        this.data = data;
        this.offset = offset;
        this.end = end;
    }

    /**
     * Sets the vectors components equal to an others vectors components.
     *
     * @param {Core.Vec} vec - The vec to mirror
     * @returns {Core.Vec} - A reference to the own vector.
     */
    public setTo(vec: Vec): this {
        this.data[this.offset + 0] = vec.x;
        this.data[this.offset + 1] = vec.y;
        this.data[this.offset + 2] = vec.z;
        this.data[this.offset + 3] = vec.w;
        return this;
    }

    /**
     * Set the individual components of this vector.
     *
     * @param x - The x component to set
     * @param y - The y component to set
     * @param z - The z component to set
     * @param w - The w component to set
     * @returns {Core.Vec} The ref to this
     */
    public setXYZ(x: number, y: number, z: number = 0, w: number = 0): this {
        this.data[this.offset + 0] = x;
        this.data[this.offset + 1] = y;
        this.data[this.offset + 2] = z;
        this.data[this.offset + 3] = w;
        return this;
    }

    /**
     * Add the values of the components of the given vector to this vector.
     *
     * @param vec - The vec to add
     * @returns {Core.Vec} The ref to this
     */
    public add(vec: Vec): this {
        this.data[this.offset + 0] += vec.x;
        this.data[this.offset + 1] += vec.y;
        this.data[this.offset + 2] += vec.z;
        this.data[this.offset + 3] += vec.w;
        return this;
    }

    /**
     * Subtracts the values of the components of the given vector from this vector.
     *
     * @param vec - The vec to subtract
     * @returns {Core.Vec} The ref to this
     */
    public subtract(vec: Vec): this {
        this.data[this.offset + 0] -= vec.x;
        this.data[this.offset + 1] -= vec.y;
        this.data[this.offset + 2] -= vec.z;
        this.data[this.offset + 3] -= vec.w;
        return this;
    }

    /**
     * Multiplies the values of the components of the given vector to this vector.
     *
     * @param vec - The vec to multiply
     * @returns {Core.Vec} The ref to this
     */
    public multiply(vec: Vec): this {
        this.data[this.offset + 0] *= vec.x;
        this.data[this.offset + 1] *= vec.y;
        this.data[this.offset + 2] *= vec.z;
        this.data[this.offset + 3] *= vec.w;
        return this;
    }

    /**
     * Multiplies a single value to all components of this vector.
     *
     * @param f - The number to multiply
     * @returns {Core.Vec} The ref to this
     */
    public multiplyScalar(f: number): this {
        this.data[this.offset + 0] *= f;
        this.data[this.offset + 1] *= f;
        this.data[this.offset + 2] *= f;
        this.data[this.offset + 3] *= f;
        return this;
    }

    /**
     * Divides a single value from all components of this vector.
     *
     * @param f - The number to divide the components
     * @returns {Core.Vec} The ref to this
     */
    public divide(v: number): this {
        this.data[this.offset + 0] /= v;
        this.data[this.offset + 1] /= v;
        this.data[this.offset + 2] /= v;
        this.data[this.offset + 3] /= v;
        return this;
    }

    /**
     * Gets the array of components behind the vector.
     *
     * @returns {number[]} The array of components
     */
    public vec(): number[] {
        return this.data;
    }

    /**
     * Gets the array of components behind the vector after normalizing colors bigger than 1 by dividing them with 255.
     *
     * @returns {number[]} The normalized array of components
     */
    public color(): number[] {
        if (this.r > 1 || this.g > 1 || this.b > 1 || this.a > 1) this.divide(255);
        return this.vec();
    }

    /**
     * Clones the current vector.
     *
     * <span class="note warn">
     * This is not a deep copy if the components are not numbers, but references they will have the same reference.
     * </span>
     *
     * @returns {Core.Vec} The cloned vector
     */
    public clone(): Vec {
        return new Vec([...this.data], this.offset, this.end);
    }

    // Getter & Setter

    /**
     * The "x" component of the vector.
     * @type {number}
     */
    public get x(): number {
        return this.data[this.offset + 0];
    }
    /**
     * The "y" component of the vector.
     * @type {number}
     */
    public get y(): number {
        return this.data[this.offset + 1];
    }
    /**
     * The "z" component of the vector.
     * @type {number}
     */
    public get z(): number {
        return this.data[this.offset + 2];
    }
    /**
     * The "w" component of the vector.
     * @type {number}
     */
    public get w(): number {
        return this.data[this.offset + 3];
    }
    /**
     * The "r" component of the vector.
     * @type {number}
     */
    public get r(): number {
        return this.data[this.offset + 0];
    }
    /**
     * The "g" component of the vector.
     * @type {number}
     */
    public get g(): number {
        return this.data[this.offset + 1];
    }
    /**
     * The "b" component of the vector.
     * @type {number}
     */
    public get b(): number {
        return this.data[this.offset + 2];
    }
    /**
     * The "a" component of the vector.
     * @type {number}
     */
    public get a(): number {
        return this.data[this.offset + 3];
    }

    public set x(v: number) {
        this.data[this.offset + 0] = v;
    }
    public set y(v: number) {
        this.data[this.offset + 1] = v;
    }
    public set z(v: number) {
        this.data[this.offset + 2] = v;
    }
    public set w(v: number) {
        this.data[this.offset + 3] = v;
    }
    public set r(v: number) {
        this.data[this.offset + 0] = v;
    }
    public set g(v: number) {
        this.data[this.offset + 1] = v;
    }
    public set b(v: number) {
        this.data[this.offset + 2] = v;
    }
    public set a(v: number) {
        this.data[this.offset + 3] = v;
    }
}

export { Vec };
