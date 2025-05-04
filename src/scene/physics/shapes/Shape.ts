import { Vec } from "../../../core/Vec.js";
import { Transform } from "../../../core/Transform.js";

import { Context } from "../../../graphics/Context.js";
import { Tile } from "../../../core/Tile.js";
import { SpriteMaterial } from "../../../graphics/Material.js";
import { CollisionInfo } from "../../../core/Physics.js";

const white = Tile.fromColor(Vec.fromHex(0xffff, 4));
abstract class Shape {
    public transform: Transform = new Transform();

    public abstract contains(point: Vec): boolean;

    public collides(other: Shape): boolean {
        throw new Error("Collision not implemented for this type: " + Shape.name);
    }

    public resolve<T extends CollisionInfo>(collisionInfo: T) {
        throw new Error("Collision resolving  not implemented for this type: " + Shape.name);
    }

    public debugColor: Vec = Vec.fromHex(0x00ff00bb);
    private debugSpriteMat: SpriteMaterial = new SpriteMaterial();
    public debugDraw(ctx: Context) {
        this.debugSpriteMat.color = this.debugColor;
        ctx.drawTile(this.transform, white, this.debugSpriteMat, "corner");
    }
}

export { Shape };
