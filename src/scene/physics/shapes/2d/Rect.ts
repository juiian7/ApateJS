import { Vec4 } from "../../../../core/Vec4.js";
import { Transform } from "../../../../core/Transform.js";
import { CollisionInfo } from "../../../../core/Physics.js";

import { Shape2D } from "./Shape2D.js";
import { Circle } from "./Circle.js";
import { Shape } from "../Shape.js";
import { Ray } from "../../../../core/Ray.js";

class Rect extends Shape2D {
    private align: "center" | "corner" = "corner";
    private localX: number;
    private localY: number;

    private absoluteSelf: Transform = new Transform();

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
        let a = this.transform.absolute(this.absoluteSelf);
        let b = rect.transform.absolute();

        return (
            a.position.x + a.size.x > b.position.x &&
            a.position.x < b.position.x + b.size.x &&
            a.position.y + a.size.y > b.position.y &&
            a.position.y < b.position.y + b.size.y
        );
    }
    public collideCircle(circle: Circle): boolean {
        let a = this.transform.absolute(this.absoluteSelf);
        let b = circle.transform.absolute();

        // distance between center and nearest point of box;
        let distanceX = b.position.x - Math.max(a.position.x, Math.min(b.position.x, a.position.x + a.size.x));
        let distanceY = b.position.y - Math.max(a.position.y, Math.min(b.position.y, a.position.y + a.size.y));

        // Check if the distance is less than or equal to the radius
        return distanceX * distanceX + distanceY * distanceY <= b.size.x * b.size.y;
    }

    public resolveRect(other: Rect, transform: Transform) {
        let a = this.transform.absolute(this.absoluteSelf);
        let b = other.transform.absolute();

        let ox = Math.min(a.position.x + a.size.x - b.position.x, b.position.x + b.size.x - a.position.x);
        let oy = Math.min(a.position.y + a.size.y - b.position.y, b.position.y + b.size.y - a.position.y);

        if (ox < oy) transform.position.x += a.position.x < b.position.x ? -ox : ox;
        else transform.position.y += a.position.y < b.position.y ? -oy : oy;
    }

    public resolveCircle(other: Circle, transform: Transform) {}

    public static lineIntersectsLine(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2): { x: number; y: number; dist: number } {
        let bx2bx1 = bx2 - bx1;
        let by2by1 = by2 - by1;
        let ax2ax1 = ax2 - ax1;
        let ay2ay1 = ay2 - ay1;
        let d = by2by1 * ax2ax1 - bx2bx1 * ay2ay1;
        let t = (bx2bx1 * (ay1 - by1) - by2by1 * (ax1 - bx1)) / d;
        let u = (ax2ax1 * (ay1 - by1) - ay2ay1 * (ax1 - bx1)) / d;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            let point = {
                x: ax1 + t * ax2ax1,
                y: ay1 + u * ay2ay1,
                dist: null,
            };

            point.dist = Math.sqrt((point.x - ax1) ** 2 + (point.y - ay1) ** 2);
            return point;
        }
        return null;
    }

    public raycast(ray: Ray): number {
        const origin = ray.origin;
        const end = Vec4.multiply(ray.direction, ray.len);
        end.add(origin);

        this.transform.absolute(this.absoluteSelf);
        const a = this.absoluteSelf.position;
        const s = this.absoluteSelf.size;

        let bottomSide = a.y + s.y;
        let rightSide = a.x + s.x;
        let top = Rect.lineIntersectsLine(origin.x, origin.y, end.x, end.y, a.x, a.y, a.x + s.x, a.y);
        let bottom = Rect.lineIntersectsLine(origin.x, origin.y, end.x, end.y, a.x, bottomSide, a.x + s.x, bottomSide);
        let left = Rect.lineIntersectsLine(origin.x, origin.y, end.x, end.y, a.x, a.y, a.x, bottomSide);
        let right = Rect.lineIntersectsLine(origin.x, origin.y, end.x, end.y, rightSide, a.y, rightSide, bottomSide);

        if (top || bottom || left || right) {
            let min = Infinity;
            for (const side of [top, bottom, left, right]) if (side && side.dist < min) min = side.dist;
            return min;
        }

        return null;
    }

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
