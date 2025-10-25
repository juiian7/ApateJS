import { Vec4 } from "../../../core/Vec4.js";
import { Transform } from "../../../core/Transform.js";

import { Context } from "../../../graphics/Context.js";
import { Tile } from "../../../core/Tile.js";
import { SpriteMaterial } from "../../../graphics/Material.js";
import { CollisionInfo } from "../../../core/Physics.js";
import { Color } from "../../../core/Color.js";
import { Ray } from "../../../core/Ray.js";

const white = Tile.fromColor(Color.fromHex(0xffff, 4));
abstract class Shape {
    public transform: Transform = new Transform();

    public abstract contains(point: Vec4): boolean;

    public raycast(ray: Ray): number {
        throw new Error("Ray casting not implemented for this type: " + Shape.name);
    }

    public collides(other: Shape): boolean {
        throw new Error("Collision not implemented for this type: " + Shape.name);
    }

    public resolve<T extends CollisionInfo>(collisionInfo: T) {
        throw new Error("Collision resolving  not implemented for this type: " + Shape.name);
    }

    private debugSpriteMat: SpriteMaterial = new SpriteMaterial();
    public debugDraw(ctx: Context, color: Color) {
        this.debugSpriteMat.color = color;
        ctx.drawTile(this.transform, white, this.debugSpriteMat, "bottom-left");
    }
}

export { Shape };
