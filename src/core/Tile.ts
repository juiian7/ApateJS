import Vec from "./Vec.js";
import Texture from "../graphics/Texture.js";

// abstraction for images
export default class Tile {
    static fromImage(img: HTMLImageElement): Tile {
        return new Tile(Texture.fromSource(img));
    }

    static fromColor(color: Vec): Tile {
        return new Tile(Texture.fromColor(color));
    }

    public clip: Vec;
    public readonly texture: Texture;

    constructor(texture: Texture, clip?: Vec) {
        this.texture = texture;
        if (!clip) clip = new Vec([0, 0, texture.width, texture.height]);
        this.clip = clip;
    }

    public split(px: number, gap: number = 0): Tile[] {
        let tiles: Tile[] = [];
        for (let i = this.clip.x; i < this.clip.x + this.clip.z; i += px + gap)
            tiles.push(new Tile(this.texture, new Vec([i, this.clip.y, px, this.clip.w])));
        return tiles;
    }

    public splitV(px: number, gap: number = 0): Tile[] {
        let tiles: Tile[] = [];
        for (let i = this.clip.y; i < this.clip.y + this.clip.w; i += px + gap)
            tiles.push(new Tile(this.texture, new Vec([this.clip.x, i, this.clip.z, px])));
        return tiles;
    }

    public grid(width: number, height: number, gap: number = 0): Tile[][] {
        return this.splitV(height, gap).map((row) => row.split(width, gap));
    }

    public sub(clip: Vec) {
        return new Tile(this.texture, clip);
    }
}
