import { Vec } from "../../../../core/Vec.js";
import { CollisionInfo } from "../../../../core/Physics.js";

import { Rect } from "./Rect.js";
import { Shape2D } from "./Shape2D.js";

class Circle extends Shape2D {
    public center: Vec;

    public get x(): number {
        return this.transform.position.x;
    }
    public get y(): number {
        return this.transform.position.y;
    }
    public get r(): number {
        return this.transform.size.x;
    }

    public set x(v: number) {
        this.transform.position.x = v;
    }
    public set y(v: number) {
        this.transform.position.y = v;
    }
    public set r(v: number) {
        this.transform.size.x = v;
    }

    constructor(x: number = 0, y: number = 0, r: number = 1) {
        super();
        this.x = x;
        this.y = y;
        this.r = r;
    }

    public contains(point: Vec): boolean {
        let a = this.transform.absolute();

        let d = Math.sqrt((point.x - a.position.x) ** 2 + (point.y - a.position.y) ** 2);
        return d <= a.size.x;
    }
    public collideRect(rect: Rect): boolean {
        return rect.collideCircle(this);
    }
    public collideCircle(circle: Circle): boolean {
        let a = this.transform.absolute();
        let b = circle.transform.absolute();

        let d = Math.sqrt((b.position.x - a.position.x) ** 2 + (b.position.y - a.position.y) ** 2);
        return d <= a.size.x + b.size.y;
    }
}
export { Circle };
