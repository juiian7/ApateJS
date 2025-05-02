import { Vec } from "./Vec.js";
import { type Matrix } from "./Matrix.js";

/**
 * This class represents a rotation.
 * Rotations are more complex, so unfortunately is not possible to simply store a {@link Core.Vec | Vec} with the axis angles.
 * But there are a few methods in this class and the {@link Core.Transform | Transform} class to make rotations easier.
 *
 * <span class="note warn">
 * Angles are usually interpreted as radians!
 * <br>
 * Use {@link Core.Quaternion.radToDeg | Quaternion.radToDeg} and {@link Core.Quaternion.degToRad | Quaternion.degToRad}
 * to convert between angles.
 * </span>
 *
 * @example
 * let a = new Quaternion(Math.PI / 2, 0, 0); // set the x axis to an angle of π/2
 * let b = new Quaternion(); // create a not-rotated object
 * b.setAngles(-Math.PI / 2, Math.PI); // set x to -π/2 and y to π
 *
 * let c = Quaternion.multiply(a, b); // combine the rotations a and b
 * Quaternion.multiply(a, c, c); // combine a and c and write it to c, or short -> "add a to c"
 *
 * @memberof Core
 */
class Quaternion {
    /**
     * The w, x, y, z, components of the quaternion. *These values are not angles!*
     *
     * @type {Core.Vec}
     * @public
     */
    public c: Vec = Vec.from(0, 0, 0, 1);

    /**
     * Constructs a new quaternion object with an initial axis rotation (in radians!)
     *
     * @param ax The x rotation in radians
     * @param ay The y rotation in radians
     * @param az The z rotation in radians
     */
    public constructor(ax: number = 0, ay: number = 0, az: number = 0) {
        if (ax || ay || az) this.setAngles(ax, ay, az);
    }

    private static rFac = Math.PI / 180;
    private static dFac = 1 / this.rFac;
    /**
     * Converts radians to degrees
     *
     * @param {number} radians
     * @returns {number}
     */
    public static radToDeg(radians: number) {
        return radians * this.dFac;
    }

    /**
     * Converts degrees to radians
     *
     * @param {number} degrees
     * @returns {number}
     */
    public static degToRad(degrees: number) {
        return degrees * this.rFac;
    }

    /**
     * Multiplies two quaternions and writes the result in ref.
     *
     * @param {Quaternion} a The first quaternion for the multiplication
     * @param {Quaternion} b The second quaternion for the multiplication
     * @param {Quaternion} ref The output, if omitted a new quaternion is created
     * @returns {Quaternion} The output (same as ref)
     */
    public static multiply(a: Quaternion, b: Quaternion, ref: Quaternion = new Quaternion()) {
        let w, x, y, z;
        w = a.c.w * b.c.w - a.c.x * b.c.x - a.c.y * b.c.y - a.c.z * b.c.z;
        x = a.c.w * b.c.x + a.c.x * b.c.w + a.c.y * b.c.z - a.c.z * b.c.y;
        y = a.c.w * b.c.y - a.c.x * b.c.z + a.c.y * b.c.w + a.c.z * b.c.x;
        z = a.c.w * b.c.z + a.c.x * b.c.y - a.c.y * b.c.x + a.c.z * b.c.w;
        ref.c.w = w;
        ref.c.x = x;
        ref.c.y = y;
        ref.c.z = z;
        return ref;
    }

    /**
     * Sets the quaternion to the given axis rotation (in radians!)
     *
     * @param {number} ax The x rotation in radians
     * @param {number} ay The y rotation in radians
     * @param {number} az The z rotation in radians
     * @returns {Quaternion} A reference to this quaternion
     */
    public setAngles(ax: number = 0, ay: number = 0, az: number = 0) {
        var sinX = Math.sin(ax * 0.5);
        var cosX = Math.cos(ax * 0.5);
        var sinY = Math.sin(ay * 0.5);
        var cosY = Math.cos(ay * 0.5);
        var sinZ = Math.sin(az * 0.5);
        var cosZ = Math.cos(az * 0.5);
        var cosYZ = cosY * cosZ;
        var sinYZ = sinY * sinZ;
        this.c.x = sinX * cosYZ - cosX * sinYZ;
        this.c.y = cosX * sinY * cosZ + sinX * cosY * sinZ;
        this.c.z = cosX * cosY * sinZ - sinX * sinY * cosZ;
        this.c.w = cosX * cosYZ + sinX * sinYZ;
        return this;
    }

    /**
     * Sets the quaternion by a given rotation of a matrix
     *
     * @param m The matrix containing the rotation
     * @returns {Quaternion} A reference to this
     */
    public setMatrix(m: Matrix) {
        let m11 = m[0],
            m12 = m[1],
            m13 = m[2],
            m21 = m[4],
            m22 = m[5],
            m23 = m[6],
            m31 = m[8],
            m32 = m[9],
            m33 = m[10];

        var t = m[0] + m[5] + m[10];
        if (t > 0) {
            s = 2 * Math.sqrt(t + 1);
            this.c.w = s / 4;
            this.c.x = (m23 - m32) / s;
            this.c.y = (m31 - m12) / s;
            this.c.z = (m12 - m21) / s;
        } else if (m11 > m22 && m11 > m33) {
            var s = Math.sqrt(1.0 + m11 - m22 - m33) * 2;
            var ins = 1 / s;
            this.c.x = 0.25 * s;
            this.c.y = (m21 + m12) * ins;
            this.c.z = (m31 + m13) * ins;
            this.c.w = (m23 - m32) * ins;
        } else if (m22 > m33) {
            var s = Math.sqrt(1.0 + m22 - m11 - m33) * 2;
            var ins = 1 / s;
            this.c.x = (m21 + m12) * ins;
            this.c.y = 0.25 * s;
            this.c.z = (m32 + m23) * ins;
            this.c.w = (m31 - m13) * ins;
        } else {
            var s = Math.sqrt(1.0 + m33 - m11 - m22) * 2;
            var ins = 1 / s;
            this.c.x = (m31 + m13) * ins;
            this.c.y = (m32 + m23) * ins;
            this.c.z = 0.25 * s;
            this.c.w = (m12 - m21) * ins;
        }
        return this;
    }

    /**
     * Gets the current rotation matrix of the quaternion.
     *
     * @returns {Matrix} The rotation matrix
     */
    public matrix(): Matrix {
        return [
            1 - 2 * (this.c.y * this.c.y + this.c.z * this.c.z),
            2 * (this.c.x * this.c.y - this.c.z * this.c.w),
            2 * (this.c.x * this.c.z + this.c.y * this.c.w),
            0, // end
            2 * (this.c.x * this.c.y + this.c.z * this.c.w),
            1 - 2 * (this.c.x * this.c.x + this.c.z * this.c.z),
            2 * (this.c.y * this.c.z - this.c.x * this.c.w),
            0, // end
            2 * (this.c.x * this.c.z - this.c.y * this.c.w),
            2 * (this.c.y * this.c.z + this.c.x * this.c.w),
            1 - 2 * (this.c.x * this.c.x + this.c.y * this.c.y),
            0, // end
            0,
            0,
            0,
            1, // end
        ];
    }

    /* public get x(): number {
        return this.c.x;
    }
    public get y(): number {
        return this.c.y;
    }
    public get z(): number {
        return this.c.z;
    }

    //private static tmp: Quaternion = new Quaternion();
    public set x(v: number) {
        this.c.x = v;
        //Quaternion.multiply(this, Quaternion.tmp.setAnglesRad(v, 0, 0), this);
    }
    public set y(v: number) {
        this.c.y = v;
        //Quaternion.multiply(this, Quaternion.tmp.setAnglesRad(0, v, 0), this);
    }
    public set z(v: number) {
        this.c.z = v;
        //Quaternion.multiply(this, Quaternion.tmp.setAnglesRad(0, 0, v), this);
    } */
}
export { Quaternion };
