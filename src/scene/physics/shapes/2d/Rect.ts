import { Vec4 } from "../../../../core/Vec4.js";
import { Transform } from "../../../../core/Transform.js";
import { CollisionInfo } from "../../../../core/Physics.js";

import { Shape2D } from "./Shape2D.js";
import { Circle } from "./Circle.js";
import { Shape } from "../Shape.js";

class Rect extends Shape2D {
    private align: "center" | "corner" = "corner";
    private localX: number;
    private localY: number;

    constructor(width: number = 1, height: number = 1, x: number = 0, y: number = 0, align: "center" | "corner" = "corner") {
        super();

        this.align = align;

        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
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
        if (this.align == "corner") this.transform.position.x = v;
        else this.transform.position.x = v - this.width / 2; // center
        this.localX = v;
    }
    public set y(v: number) {
        if (this.align == "corner") this.transform.position.y = v;
        else this.transform.position.y = v - this.height / 2; // center
        this.localY = v;
    }
    public set width(v: number) {
        this.transform.size.x = v;
        if (this.align == "center") this.x = this.localX;
    }
    public set height(v: number) {
        this.transform.size.y = v;
        if (this.align == "center") this.y = this.localY;
    }

    public contains(point: Vec4): boolean {
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

    public resolveRect(other: Rect, transform: Transform) {
        let a = this.transform.absolute();
        let b = other.transform.absolute();

        let ox = Math.min(a.position.x + a.size.x - b.position.x, b.position.x + b.size.x - a.position.x);
        let oy = Math.min(a.position.y + a.size.y - b.position.y, b.position.y + b.size.y - a.position.y);

        if (ox < oy) transform.position.x += a.position.x < b.position.x ? -ox : ox;
        else transform.position.y += a.position.y < b.position.y ? -oy : oy;
    }

    public resolveCircle(other: Circle, transform: Transform) {}

    public collides(other: Shape): boolean {
        if (other instanceof Rect) return this.collideRect(other);
        else if (other instanceof Circle) return this.collideCircle(other);

        super.collides(other);
    }

    public resolve(collisionInfo: CollisionInfo): void {
        if (collisionInfo.otherShape instanceof Rect)
            return this.resolveRect(collisionInfo.otherShape, (collisionInfo.self.belongsTo || collisionInfo.self).transform);
        else if (collisionInfo.otherShape instanceof Circle)
            return this.resolveCircle(collisionInfo.otherShape, (collisionInfo.self.belongsTo || collisionInfo.self).transform);

        super.resolve(collisionInfo);
    }
}
export { Rect };
