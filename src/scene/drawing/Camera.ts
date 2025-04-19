import Obj from "../Obj.js";

import { Matrix, orthographic, perspective } from "../../core/Matrix.js";
import Context, { ICamera } from "../../graphics/Context.js";
import Vec from "../../core/Vec.js";
import Apate from "../../Apate.js";

export default class Camera<E extends Apate = Apate> extends Obj<E> implements ICamera {
    public projection: Matrix;

    public bgColor: Vec = Vec.from(0, 0, 0, 0);

    public width: number;
    public height: number;

    constructor(width: number, height: number, projection: Matrix, parent?: Obj, name?: string) {
        super(parent, name);

        this.projection = projection;
    }

    public static orthographic(width: number, height: number, anchor: "center" | "bottom left" | "top left" = "center") {
        switch (anchor) {
            case "bottom left":
                return new Camera(width, height, orthographic(0, width, height, 0, -100, 100));
            case "center":
                return new Camera(width, height, orthographic(-width / 2, width / 2, height / 2, -height / 2, -100, 100));
            case "top left":
                return new Camera(width, height, orthographic(0, width, 0, height, -100, 100));
        }
    }

    public static perspective(width: number, height: number, fov: number = 1.57) {
        return new Camera(width, height, perspective(fov, 1, 100, width / height));
    }

    public draw(context: Context): void {
        context.pushCamera(this);
    }

    public drawAfter(context: Context): void {
        context.popCamera();
    }
}
