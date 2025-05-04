import { Vec } from "../../../../core/Vec.js";
import { CollisionInfo } from "../../../../core/Physics.js";

import { Shape2D } from "./Shape2D.js";
import { Circle } from "./Circle.js";
import { Shape } from "../Shape.js";

class Rect extends Shape2D {
    constructor(width: number = 1, height: number = 1, x: number = 0, y: number = 0) {
        super();

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public get x(): number {
        return this.transform.position.x;
    }
    public get y(): number {
        return this.transform.position.y;
    }
    public get width(): number {
        return this.transform.size.x;
    }
    public get height(): number {
        return this.transform.size.y;
    }

    public set x(v: number) {
        this.transform.position.x = v;
    }
    public set y(v: number) {
        this.transform.position.y = v;
    }
    public set width(v: number) {
        this.transform.size.x = v;
    }
    public set height(v: number) {
        this.transform.size.y = v;
    }

    public contains(point: Vec): boolean {
        let self = this.transform.absolute();
        return (
            point.x >= self.position.x &&
            point.x <= self.position.x + self.size.x &&
            point.y >= self.position.y &&
            point.y <= self.position.y + self.size.y
        );
    }

    public collideRect(rect: Rect): boolean {
        let a = this.transform.absolute();
        let b = rect.transform.absolute();

        return (
            a.position.x + a.size.x > b.position.x &&
            a.position.x < b.position.x + b.size.x &&
            a.position.y + a.size.y > b.position.y &&
            a.position.y < b.position.y + b.size.y
        );
    }
    public collideCircle(circle: Circle): boolean {
        let a = this.transform.absolute();
        let b = circle.transform.absolute();

        // distance between center and nearest point of box;
        let distanceX = b.position.x - Math.max(a.position.x, Math.min(b.position.x, a.position.x + a.size.x));
        let distanceY = b.position.y - Math.max(a.position.y, Math.min(b.position.y, a.position.y + a.size.y));

        // Check if the distance is less than or equal to the radius
        return distanceX * distanceX + distanceY * distanceY <= b.size.x * b.size.y;
    }

    public collides(other: Shape): boolean {
        if (other instanceof Rect) return this.collideRect(other);
        else if (other instanceof Circle) return this.collideCircle(other);

        super.collides(other);
    }
}
export { Rect };
