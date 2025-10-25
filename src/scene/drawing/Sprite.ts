import { Obj } from "../Obj.js";

import { Tile } from "../../core/Tile.js";
import { Color } from "../../core/Color.js";
import { Vec4 } from "../../core/Vec4.js";

import { Context } from "../../graphics/Context.js";
import { SpriteMaterial } from "../../graphics/Material.js";
import { Apate } from "../../Apate.js";

/**
 * This class acts as node type for drawing sprites.
 * A sprite is build for rendering a single image in form of a {@link Tile}.
 * If you are looking for animated sprites, tile maps or particles check out {@link ASprite}, {@link SpriteBatch}.
 *
 * <div>
 * For basic usage see: [Tutorial - Drawing Sprites]{@tutorial 2-sprites}
 * </div>
 * @example
 * // add a sprite to the scene (could be found in {@link Apate#init})
 * new World.Sprite(Tile.fromImage(<img>), this.scene, "demo-sprite")
 *
 * @extends Obj
 * @memberof World
 */
class Sprite<E extends Apate = Apate> extends Obj<E> {
    /**
     * The material of the sprite used for drawing.
     *
     * @type {SpriteMaterial}
     */
    public material: SpriteMaterial = new SpriteMaterial();

    /**
     * The alignment of the sprite. Where the center of sprite is.
     */
    public align: "center" | "bottom-left" = "bottom-left";

    /**
     * The tile of the sprite. Shorthand for tile.material.sprite.
     *
     * @type {Tile}
     */
    public get tile(): Tile {
        return this.material.tile;
    }

    public set tile(value: Tile) {
        this.material.tile = value;
    }

    /**
     * Constructs a new Sprite type node.
     *
     * @constructs
     * @param {Tile} tile - The initial tile of the sprite
     * @param {Obj} parent - The parent node of the newly created. Adds the created to the parents children (same as in {@link Obj#constructor})
     * @param {string} name - The name of the node (see {@link Obj#constructor})
     */
    constructor(tile?: Tile, parent?: Obj, name?: string) {
        super(parent, name);

        if (!tile) tile = Tile.fromColor(Color.fromHex(0xf0ff, 4));
        this.tile = tile;

        // to size
        this.transform.size.x = tile.clip.z;
        this.transform.size.y = tile.clip.w;
    }

    fromTexture() {}

    public draw(context: Context): void {
        context.drawTile(this.transform, this.material.tile, this.material, this.align);
    }

    public onSerialize(): { [field: string]: any } {
        return {
            ...super.onSerialize(),
            tile: this.tile,
        };
    }

    public onDeserialize(data: { [field: string]: any }, children: Obj[]): void {
        super.onDeserialize(data, children);
        this.tile = data.tile;
    }
}
export { Sprite };
