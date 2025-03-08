import Obj from "../Obj.js";
import Transform from "../../core/Transform.js";
import Context from "../../graphics/Context.js";
import Collider from "./Collider.js";
import Vec from "../../core/Vec.js";
import Tile from "../../core/Tile.js";
import { SpriteMaterial } from "../../graphics/Material.js";
import { transform } from "../../core/Matrix.js";

const mat = new SpriteMaterial();

export default abstract class Shape {
    public abstract readonly type: string;

    private _color: Vec = Vec.fromHex(0x00ff00aa);
    private _cache: Tile;

    public get color(): Vec {
        this._cache = null;
        return this._color;
    }
    public set color(color: Vec) {
        this._cache = null;
        this._color = color;
    }

    public abstract collision(self: Transform, shape: Shape, other: Transform): boolean;
    public abstract info(self: Transform, shape: Shape, other: Transform): any;

    public draw(context: Context, transform: Transform) {
        if (!this._cache) this._cache = Tile.fromColor(this.color);
        context.drawTile(transform, this._cache, mat);
    }
}

export class BoxShape extends Shape {
    public readonly type: string = "box";

    public offset: Vec;
    private clone: Transform = new Transform();

    constructor(offset: Vec = Vec.from(0, 0)) {
        super();

        this.offset = offset;
    }

    collision(self: Transform, shape: BoxShape, other: Transform) {
        if (shape.type != "box") return shape.info(self, this, other);

        this.clone.setTo(self.position, null, self.scale).position.add(this.offset);
        let { x: ax, y: ay } = this.clone.position;
        let { x: aw, y: ah } = this.clone.scale;

        this.clone.setTo(other.position, null, other.scale).position.add(shape.offset);
        let { x: bx, y: by } = this.clone.position;
        let { x: bw, y: bh } = this.clone.scale;

        return !(ax + aw <= bx || bx + bw <= ax || ay + ah <= by || by + bh <= ay);
    }

    info(self: Transform, shape: BoxShape, other: Transform) {
        if (shape.type != "box") return shape.info(self, this, other);

        this.clone.setTo(self.position, null, self.scale).position.add(this.offset);
        let { x: ax, y: ay } = this.clone.position;
        let { x: aw, y: ah } = this.clone.scale;

        this.clone.setTo(other.position, null, other.scale).position.add(shape.offset);
        let { x: bx, y: by } = this.clone.position;
        let { x: bw, y: bh } = this.clone.scale;

        return { top: ay + ah - by, right: bx + bw - ax, bottom: by + bh - ay, left: ax + aw - bx };
    }

    public draw(context: Context, transform: Transform): void {
        this.clone.setTo(transform.position, null, transform.scale).position.add(this.offset);
        super.draw(context, this.clone);
    }
}
