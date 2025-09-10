/**
 * This class is used to create and operate with 4 dimensional vectors. If you are looking for colors see {@link Core.Color}.
 * Vectors are typically used for storing location data.
 * To make it practicable for working with positions the components
 * {@link Core.Vec4#x | x}, {@link Core.Vec4#y | y}, {@link Core.Vec4#z | z}, {@link Core.Vec4#w | w} can be used.
 * <br>
 *
 * A Vec4 object is in fact just a mask to operate on an array with the components more elegant.
 * The raw array can be accessed with {@link Core.Vec4#vec | this.vec()}.
 *
 * <span class="note">
 * Important: Vec4 is designed to work on the current reference.
 * Be sure to create copies if needed or use the static functions to choose the working reference!
 * </span>
 *
 * @example
 * // create a vector (0,0,0,0) and do few operations
 * const position = Vec4.from(0,0);
 * postion.add(otherVec).multiply(3.4);
 * // shorthand for:
 * const outPos = new Vec4();
 * Vec4.multiply(Vec4.add(position, otherVec, outPos), 3.4);
 *
 * @memberof Core
 */
class Vec4 {
    /* ##### Factory functions ##### */

    /**
     * Creates a Vec4 object from a given number. Typically used for specifying hex colors.
     *
     * @param {number} num - The value of the vector, formatted in a single number (see hex colors -> 0xff00ff)
     * @param {number} bit - The number of bits per component
     * @returns {Core.Vec4} - The created vector
     *
     */
    public static fromNum(num: number, bit: number = 8): Vec4 {
        let mask = 2 ** bit - 1;
        let f = 255 / mask; // / 2 ** bit + mask;
        return new Vec4([
            ((num >> (bit * 3)) & mask) * f,
            ((num >> (bit * 2)) & mask) * f,
            ((num >> bit) & mask) * f,
            (num & mask) * f, //
        ]);
    }

    /**
     * Crates a Vec4 object given by all components (x,y,z,w)
     *
     * @static
     * @param {number} x the x component of the vector
     * @param {number} y the y comp...
     * @param {number} z the z ...
     * @param {number} w ...
     * @returns {Core.Vec4} - The created object
     */
    public static from(x: number, y: number, z: number = 0, w: number = 0): Vec4 {
        return new Vec4([x, y, z, w]);
    }

    /* ##### Static operations ##### */

    /**
     * Add the values of the components of the given vector to the reference vector.
     * Only modifies ref, a and b stay the same!
     *
     * @param a - The initial vec
     * @param b - The vec to add
     * @param ref - The resulting vector, will be written within the function
     * @returns {Core.Vec4} The ref
     */
    public static add(a: Vec4, b: Vec4, ref: Vec4 = new Vec4()): Vec4 {
        ref.data[0] = a.data[0] + b.data[0];
        ref.data[1] = a.data[1] + b.data[1];
        ref.data[2] = a.data[2] + b.data[2];
        ref.data[3] = a.data[3] + b.data[3];
        return ref;
    }

    /**
     * Subtracts the values of the components of the given vector from this vector.
     * Only modifies ref, a and b stay the same!
     *
     * @param a - The initial vec
     * @param b - The vec to subtract
     * @param ref - The resulting vector, will be written within the function
     * @returns {Core.Vec4} The ref
     */
    public static subtract(a: Vec4, b: Vec4, ref: Vec4 = new Vec4()): Vec4 {
        ref.data[0] = a.data[0] - b.data[0];
        ref.data[1] = a.data[1] - b.data[1];
        ref.data[2] = a.data[2] - b.data[2];
        ref.data[3] = a.data[3] - b.data[3];
        return ref;
    }

    /**
     * Multiplies the values of the components of the given vector to this vector.
     * Only modifies ref, a and b stay the same!
     *
     * @param a - The initial vec
     * @param b - The vec to multiply
     * @param ref - The resulting vector, will be written within the function
     * @returns {Core.Vec4} The ref
     */
    public static multiplyVec(a: Vec4, b: Vec4, ref: Vec4 = new Vec4()): Vec4 {
        ref.data[0] = a.data[0] * b.data[0];
        ref.data[1] = a.data[1] * b.data[1];
        ref.data[2] = a.data[2] * b.data[2];
        ref.data[3] = a.data[3] * b.data[3];
        return ref;
    }

    /**
     * Multiplies a single value to all components of this vector.
     * Only modifies ref, a stays the same!
     *
     * @param a - The vector to multiply
     * @param f - The number to multiply
     * @param ref - The resulting vector, will be written within the function
     * @returns {Core.Vec4} The ref
     */
    public static multiply(a: Vec4, f: number, ref: Vec4 = new Vec4()): Vec4 {
        ref.data[0] = a.data[0] * f;
        ref.data[1] = a.data[1] * f;
        ref.data[2] = a.data[2] * f;
        ref.data[3] = a.data[3] * f;
        return ref;
    }

    /**
     * Divides a single value from all components of a vector.
     * Only modifies ref, a stays the same!
     *
     * @param a - The vector to divide from
     * @param v - The number to divide the components
     * @param ref - The resulting vector, will be written within the function
     * @returns {Core.Vec4} The ref
     */
    public static divide(a: Vec4, v: number, ref: Vec4 = new Vec4()): Vec4 {
        ref.data[0] = a.data[0] / v;
        ref.data[1] = a.data[1] / v;
        ref.data[2] = a.data[2] / v;
        ref.data[3] = a.data[3] / v;
        return ref;
    }

    /**
     * Divides a single value from all components of a vector.
     * Only modifies ref, a stays the same!
     *
     * @param a - The vector to divide from
     * @param b - The numbers to divide the components
     * @param ref - The resulting vector, will be written within the function
     * @returns {Core.Vec4} The ref
     */
    public static divideVec(a: Vec4, b: Vec4, ref: Vec4 = new Vec4()): Vec4 {
        ref.data[0] = a.data[0] / b.data[0];
        ref.data[1] = a.data[1] / b.data[1];
        ref.data[2] = a.data[2] / b.data[2];
        ref.data[3] = a.data[3] / b.data[3];
        return ref;
    }

    /**
     * Gets length of vector v
     *
     * @param v - The vector to calculate the length
     * @returns {number} The length of v
     */
    public static len(v: Vec4): number {
        return Math.sqrt(v.data[0] ** 2 + v.data[1] ** 2 + v.data[2] ** 2 + v.data[3] ** 2);
    }

    /**
     * Calculates the cross product
     *
     * @param {Core.Vec4} a The first vec of the operation
     * @param {Core.Vec4} b The second vec of the operation
     * @param {Core.Vec4} ref The working reference, if omitted will create a new Vec4
     * @returns {Core.Vec4} the resulting vec
     */
    public static cross(a: Vec4, b: Vec4, ref: Vec4 = Vec4.from(0, 0)) {
        ref.x = a.y * b.z - a.z * b.y;
        ref.y = a.z * b.x - a.x * b.z;
        ref.z = a.x * b.y - a.y * b.x;
        return ref;
    }

    /* ##### Fields & Constructor ##### */

    protected data: number[];

    /**
     * Dimension of the vector. Should be 4 in most cases.
     * @returns {number} The number of components.
     */
    public get dimension(): number {
        return this.data.length;
    }

    /**
     * Creates a new Vec4 object. If you want more simple constructors look at:
     * {@link Core.Vec4.from | Vec4.from} and {@link Core.Vec4.fromNum | Vec4.fromNum}
     *
     * @param {number[]} data - The array behind the vector, storing the components
     * @param {number} offset - The index of the array with the first component
     * @param {number} end - The index of the array with the last component
     */
    public constructor(data: number[] = [0, 0, 0, 0]) {
        this.data = data;
    }

    /* ##### Bound methods ##### */

    /**
     * Sets the vectors components equal to an others vectors components.
     *
     * @param {Core.Vec4} vec - The vec to mirror
     * @returns {Core.Vec4} - A reference to the own vector.
     */
    public setTo(vec: Vec4): this {
        this.data[0] = vec.x;
        this.data[1] = vec.y;
        this.data[2] = vec.z;
        this.data[3] = vec.w;
        return this;
    }

    /**
     * Set the individual components of this vector.
     *
     * @param x - The x component to set
     * @param y - The y component to set
     * @param z - The z component to set
     * @param w - The w component to set
     * @returns {Core.Vec4} The ref to this
     */
    public setXYZ(x: number, y: number, z: number = 0, w: number = 0): this {
        this.data[0] = x;
        this.data[1] = y;
        this.data[2] = z;
        this.data[3] = w;
        return this;
    }

    /**
     * Adds a vec to this vec
     *
     * @param vec - The vec to add
     * @returns A reference to this
     */
    public add(vec: Vec4) {
        return Vec4.add(this, vec, this);
    }

    /**
     * Subtracts a vec from this vec
     *
     * @param vec - The vec to subtract
     * @returns A reference to this
     */
    public subtract(vec: Vec4) {
        return Vec4.subtract(this, vec, this);
    }

    /**
     * Multiplies a value to this vec
     *
     * @param f - The scalar to multiply
     * @returns A reference to this
     */
    public multiply(f: number) {
        return Vec4.multiply(this, f, this);
    }

    /**
     * Divides this vec with a value
     *
     * @param v - The value to divide this vec
     * @returns A reference to this
     */
    public divide(v: number) {
        return Vec4.divide(this, v, this);
    }

    /**
     * Gets the length of the vector
     *
     * @returns {number} The length of this vec
     */
    public len(): number {
        return Vec4.len(this);
    }

    /**
     * Normalize the vector. Modifies this reference.
     *
     * @returns A reference to this vec.
     */
    public normalize() {
        return this.divide(this.len());
    }

    /**
     * Gets the components of the vec as an array.
     *
     * @returns {number[]} The array of components
     */
    public vec(): number[] {
        return this.data;
    }

    /**
     * Clones the current vector.
     *
     * <span class="note warn">
     * This is not a deep copy if the components are not numbers, but references they will have the same reference.
     * </span>
     *
     * @returns {Core.Vec4} The cloned vector
     */
    public clone(): Vec4 {
        return new Vec4([...this.data]);
    }

    private _last: number;
    /**
     * Checks if the vector was modified since the last time this function was called
     *
     * @returns {boolean}
     */
    public changed(): boolean {
        let hash = 0;
        for (let i = 0; i < this.data.length; i++) hash = hash * 31 + this.data[i];

        if (hash == this._last) return true;

        this._last = hash;
        return false;
    }

    // Getter & Setter

    /**
     * The "x" component of the vector.
     * @type {number}
     */
    public get x(): number {
        return this.data[0];
    }
    /**
     * The "y" component of the vector.
     * @type {number}
     */
    public get y(): number {
        return this.data[1];
    }
    /**
     * The "z" component of the vector.
     * @type {number}
     */
    public get z(): number {
        return this.data[2];
    }
    /**
     * The "w" component of the vector.
     * @type {number}
     */
    public get w(): number {
        return this.data[3];
    }

    public set x(v: number) {
        this.data[0] = v;
    }
    public set y(v: number) {
        this.data[1] = v;
    }
    public set z(v: number) {
        this.data[2] = v;
    }
    public set w(v: number) {
        this.data[3] = v;
    }

    /**
     * Checks if all components are zero
     */
    public isZero(dim: number = 3): boolean {
        for (let i = 0; i < dim; i++) if (this.data[i] != 0) return false;
        return true;
    }

    /**
     * Checks if all components are one
     */
    public allOne(dim: number = 3): boolean {
        for (let i = 0; i < dim; i++) if (this.data[i] != 1) return false;
        return true;
    }
}

export { Vec4 };
