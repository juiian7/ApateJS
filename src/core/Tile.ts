import { Vec } from "./Vec.js";
import { Texture } from "../graphics/Texture.js";

/**
 * This class is an abstraction of an image. In Apate almost all images get drawn as tiles.
 * Think of a {@link Core.Tile | Tile} as a wrapper around images which also stores the part of the image should be visible.
 * With this wrapper its possible to have multiple references with different parts of the same image.
 * An image itself is represented by a {@link Texture}
 *
 * @example
 * // load a simple image as sprite
 * const player = Tile.fromImg(<img>);
 * // or load a sprite atlas / sheet with multiple sub images
 * const spriteAtlas = Tile.fromImg(<img>);
 * // in the first row of 8 pixel in the atlas is a walk animation
 * const walkFrames = spriteAtlas.sub(Vec.from(0,0,64,8)).split(8);
 *
 * @memberof Core
 */
class Tile {
    /**
     * Constructs a new Tile from a given html image element as source
     *
     * @example
     * // create a tile from a HTMLImageElement
     * const img = document.queySelector("img"); // could be loaded from dom
     * const tile = Tile.fromImage(img);
     *
     * @param {HTMLImageElement} img - The image of the tile
     * @returns {Core.Tile} The tile with the full image of the HTMLImageElement.
     */
    static fromImage(img: HTMLImageElement): Tile {
        return new Tile(Texture.fromSource(img));
    }

    /**
     * Constructs a new Tile from a given color
     *
     * @param {Core.Vec} color - The color of the tile
     * @returns The tile with the color and the size of one pixel.
     */
    static fromColor(color: Vec): Tile {
        return new Tile(Texture.fromColor(color));
    }

    /**
     * The clip of the Tile. In other words: the visible part of the image.
     *
     * @type {Core.Vec}
     */
    public clip: Vec;

    /**
     * The Texture behind this Tile.
     *
     * @type {Texture}
     */
    public readonly texture: Texture;

    /**
     * Constructs a Tile from with a given texture and an optional clip.
     *
     * @param {Texture} texture - The image texture of the Tile
     * @param {Core.Vec} clip - The visible area of the image
     */
    constructor(texture: Texture, clip?: Vec) {
        this.texture = texture;
        if (!clip) clip = new Vec([0, 0, texture.width, texture.height]);
        this.clip = clip;
    }

    /**
     * Horizontally splits the current tile in sub tiles.
     * All returned tiles make use of the same texture but have different visible areas of it.
     *
     * @param {number} px - The width of a single sub tile
     * @param {number} gap - The gap between 2 sub tiles in the texture
     * @returns {Core.Tile} The splitted Tiles.
     */
    public split(px: number, gap: number = 0): Tile[] {
        let tiles: Tile[] = [];
        for (let i = this.clip.x; i < this.clip.x + this.clip.z; i += px + gap)
            tiles.push(new Tile(this.texture, new Vec([i, this.clip.y, px, this.clip.w])));
        return tiles;
    }

    /**
     * Vertically splits the current tile in sub tiles.
     * All returned tiles make use of the same texture but have different visible areas of it.
     *
     * @param {number} px - The height of a single sub tile
     * @param {number} gap - The gap between 2 sub tiles in the texture
     * @returns {Core.Tile} The splitted Tiles.
     */
    public splitV(px: number, gap: number = 0): Tile[] {
        let tiles: Tile[] = [];
        for (let i = this.clip.y; i < this.clip.y + this.clip.w; i += px + gap)
            tiles.push(new Tile(this.texture, new Vec([this.clip.x, i, this.clip.z, px])));
        return tiles;
    }

    /**
     * Horizontally and vertically splits the current tile in sub tiles.
     * All returned tiles make use of the same texture but have different visible areas of it.
     *
     * @param {number} width - The width of a single sub tile
     * @param {number} height - The height of a single sub tile
     * @param {number} gap - The gap between 2 sub tiles in the texture
     * @returns {Core.Tile} The splitted Tiles.
     */
    public grid(width: number, height: number, gap: number = 0): Tile[][] {
        return this.splitV(height, gap).map((row) => row.split(width, gap));
    }

    /**
     * Creates a new Tile with the given visible area.
     *
     * @param {Core.Vec} clip - The visible area of the created texture
     * @returns {Core.Tile} The created sub Tile.
     */
    public sub(clip: Vec) {
        return new Tile(this.texture, clip);
    }
}

export { Tile };
