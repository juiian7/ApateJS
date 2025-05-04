import { Shape } from "../Shape.js";

import { Circle } from "./Circle.js";
import { Rect } from "./Rect.js";

abstract class Shape2D extends Shape {
    public abstract collideRect(point: Rect): boolean;
    public abstract collideCircle(point: Circle): boolean;
}
export { Shape2D };
