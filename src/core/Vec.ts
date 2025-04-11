// use for color and pos
export default class Vec {
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

    public static from(x: number, y: number, z?: number, w?: number): Vec {
        return new Vec([x, y, z || 0, w || 0]);
    }

    protected data: number[];
    protected offset: number = 0;
    protected end: number = 4;

    public get dimension(): number {
        return this.end - this.offset;
    }

    public constructor(data: number[], offset: number = 0, end: number = 4) {
        this.data = data;
        this.offset = offset;
        this.end = end;
    }

    public setTo(vec: Vec): this {
        this.data[this.offset + 0] = vec.x;
        this.data[this.offset + 1] = vec.y;
        this.data[this.offset + 2] = vec.z;
        this.data[this.offset + 3] = vec.w;
        return this;
    }

    public setXYZ(x: number, y: number, z: number = 0, w: number = 0): this {
        this.data[this.offset + 0] = x;
        this.data[this.offset + 1] = y;
        this.data[this.offset + 2] = z;
        this.data[this.offset + 3] = w;
        return this;
    }

    public add(vec: Vec): this {
        this.data[this.offset + 0] += vec.x;
        this.data[this.offset + 1] += vec.y;
        this.data[this.offset + 2] += vec.z;
        this.data[this.offset + 3] += vec.w;
        return this;
    }

    public subtract(vec: Vec): this {
        this.data[this.offset + 0] -= vec.x;
        this.data[this.offset + 1] -= vec.y;
        this.data[this.offset + 2] -= vec.z;
        this.data[this.offset + 3] -= vec.w;
        return this;
    }

    public multiply(vec: Vec): this {
        this.data[this.offset + 0] *= vec.x;
        this.data[this.offset + 1] *= vec.y;
        this.data[this.offset + 2] *= vec.z;
        this.data[this.offset + 3] *= vec.w;
        return this;
    }

    public multiplyScalar(f: number): this {
        this.data[this.offset + 0] *= f;
        this.data[this.offset + 1] *= f;
        this.data[this.offset + 2] *= f;
        this.data[this.offset + 3] *= f;
        return this;
    }

    public divide(v: number): this {
        this.data[this.offset + 0] /= v;
        this.data[this.offset + 1] /= v;
        this.data[this.offset + 2] /= v;
        this.data[this.offset + 3] /= v;
        return this;
    }

    public vec(): number[] {
        return this.data;
    }

    public color(): number[] {
        if (this.r > 1 || this.g > 1 || this.b > 1 || this.a > 1) this.divide(255);
        return this.vec();
    }

    // Getter & Setter

    public get x(): number {
        return this.data[this.offset + 0];
    }
    public get y(): number {
        return this.data[this.offset + 1];
    }
    public get z(): number {
        return this.data[this.offset + 2];
    }
    public get w(): number {
        return this.data[this.offset + 3];
    }
    public get r(): number {
        return this.data[this.offset + 0];
    }
    public get g(): number {
        return this.data[this.offset + 1];
    }
    public get b(): number {
        return this.data[this.offset + 2];
    }
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
