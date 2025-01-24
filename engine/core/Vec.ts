// use for color and pos
export default class Vec {
    public static from(num: number, bit?: number): Vec;
    public static from(x: number, y: number, z: number, w?: number): Vec;
    public static from(...args: any[]) {
        if (args.length <= 2) return this.numToVec(args[0], args[1]);

        return new Vec([args[0], args[1], args[2], args[3] || 0]);
    }

    private static numToVec(num: number, bit: number = 8) {
        let mask = 2 ** bit - 1;
        let v = new Vec([
            (num >> (bit * 3)) & mask,
            (num >> (bit * 2)) & mask,
            (num >> bit) & mask,
            num & mask, //
        ]);
        return v;
    }

    protected data: number[];
    protected offset: number = 0;
    protected end: number = 4;

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
