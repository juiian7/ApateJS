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
    protected offset: number;

    public constructor(data: number[], offset: number = 0) {
        this.data = data;
        this.offset = offset;
    }

    public vec() {
        return this.data;
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
