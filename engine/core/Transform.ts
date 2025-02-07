import { Matrix, transform } from "./Matrix.js";
import Vec from "./Vec.js";

const rFac = Math.PI / 180;

export default class Transform {
    public position: Vec;
    public rotation: Vec;
    public scale: Vec;

    constructor(x?: number, y?: number, z?: number) {
        this.position = Vec.from(x || 0, y || 0, z || 0, 0);
        this.rotation = Vec.from(0, 0, 0, 0);
        this.scale = Vec.from(1, 1, 1, 0);
    }

    public setTo(position: Vec, rotation?: Vec, scale?: Vec) {
        this.position.setTo(position);
        if (rotation) this.rotation.setTo(rotation);
        if (scale) this.scale.setTo(scale);
    }

    public add(translation: Vec, rotation?: Vec, scale?: Vec) {
        this.position.add(translation);
        if (rotation) this.rotation.add(rotation);
        if (scale) this.scale.multiply(scale);
    }

    public move(x: number = 0, y: number = 0, z: number = 0) {
        this.position.x += x;
        this.position.y += y;
        this.position.z += z;
    }

    public rotate(x: number = 0, y: number = 0, z: number = 0) {
        this.rotation.x += x * rFac;
        this.rotation.y += y * rFac;
        this.rotation.z += z * rFac;
    }

    public size(x: number = 1, y: number = 1, z: number = 1) {
        this.scale.x *= x;
        this.scale.y *= y;
        this.scale.z *= z;
    }

    public matrix(): Matrix {
        return transform(this);
    }
}
