import { Vec4 } from "./Vec4.js";

class Ray {
    public static left(origin: Vec4, len?: number) {
        return new Ray(origin, Vec4.from(-1, 0), len);
    }
    public static right(origin: Vec4, len?: number) {
        return new Ray(origin, Vec4.from(1, 0), len);
    }

    public origin: Vec4;
    public direction: Vec4;
    public len: number = 1_000;

    constructor(origin: Vec4, direction: Vec4, len?: number) {
        this.direction = direction;
        this.origin = origin;
        if (len) this.len = len;
    }
}

export { Ray };
