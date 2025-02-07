import Sprite from "./Sprite.js";

import Tile from "../../core/Tile.js";
import { Obj } from "../index.js";
import Context from "../../graphics/Context.js";

export default class ASprite extends Sprite {
    public frame: number = 0;
    public fps: number = 10;
    public animation: Tile[];

    private next: number = 0;

    constructor(animation: Tile[] = [], parent?: Obj, name?: string) {
        super(animation[0], parent, name);

        this.animation = animation;
    }

    public draw(context: Context): void {
        if (this.animation.length == 0) return;

        this.next -= context.engine.delta;
        if (this.next < 0) {
            this.frame++;
            if (this.frame > this.animation.length - 1) this.frame = 0;
            if (this.frame < 0) this.frame = this.animation.length;
            this.next = 1000 / 10;

            this.material.tile = this.animation[this.frame];
        }

        context.drawTile(this.absolutTransform(), this.animation[this.frame], this.material);
    }
}
