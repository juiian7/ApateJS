import { Obj } from "../Obj.js";

import { inverse, Matrix, orthographic, perspective, screenToWorld, worldToScreen } from "../../core/Matrix.js";
import { Context, ICamera } from "../../graphics/Context.js";

import { Apate } from "../../Apate.js";
import { Color } from "../../core/Color.js";
import { Vec4 } from "../../core/Vec4.js";

export class Camera<E extends Apate = Apate> extends Obj<E> implements ICamera {
    public projection: Matrix;
    public clipSpace: number[] = [-1, 1, 1, -1];

    public bgColor: Color = Color.fromRGBA(0, 0, 0, 0);

    public width: number;
    public height: number;

    constructor(width: number, height: number, projection: Matrix, parent?: Obj, name?: string) {
        super(parent, name);

        this.width = width;
        this.height = height;

        this.projection = projection;
    }

    public static orthographic(width: number, height: number, anchor: "center" | "bottom left" | "top left" = "center") {
        let cam: Camera;
        switch (anchor) {
            case "bottom left":
                cam = new Camera(width, height, orthographic(0, width, height, 0, -100, 100));
                cam.clipSpace = [0, 1, 1, 0];
                return cam;
            case "center":
                return new Camera(width, height, orthographic(-width / 2, width / 2, height / 2, -height / 2, -100, 100));
            case "top left":
                cam = new Camera(width, height, orthographic(0, width, 0, height, -100, 100));
                cam.clipSpace = [0, 1, 0, 1];
                return cam;
        }
    }

    private cachedInverse: Matrix;
    view(): Matrix {
        if (this.transform.changed || !this.cachedInverse) this.cachedInverse = inverse(this.transform.matrix());
        return this.cachedInverse;
    }

    public static perspective(width: number, height: number, fov: number = 1.57) {
        return new Camera(width, height, perspective(fov, 0.001, 100, width / height));
    }

    public draw(context: Context): void {
        context.pushCamera(this);
    }

    public drawAfter(context: Context): void {
        context.popCamera();
    }

    public screenToWorld(screenPos: Vec4, screenSize: Vec4 = Vec4.from(this.width, this.height)) {
        return screenToWorld(screenPos, this.view(), this.projection, screenSize, this.clipSpace);
    }

    public worldToScreen(world: Vec4, screenSize: Vec4 = Vec4.from(this.width, this.height)) {
        throw new Error("Not implemented yet!");
    }
}
