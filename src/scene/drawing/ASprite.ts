import Sprite from "./Sprite.js";

import Tile from "../../core/Tile.js";
import { Obj } from "../index.js";
import Context from "../../graphics/Context.js";
import Apate from "../../Apate.js";

export default class ASprite<E extends Apate = Apate> extends Sprite<E> {
    public frame: number = 0;
    public fps: number = 10;
    public animation: Tile[];
    public after: "loop" | "end" = "loop";
    public isPaused: boolean = false;

    private next: number = 0;

    constructor(animation: Tile[] = [], parent?: Obj, name?: string) {
        super((animation || [])[0], parent, name);

        this.animation = animation;
    }

    public run(animation: Tile[], fps: number = this.fps, startFrame: number = 0) {
        // wait for last anim to finish?
        // play loop | reverse_loop | once | zigzag?
        this.animation = animation;
        this.frame = startFrame;
        this.fps = fps;

        this.next = 1000 / this.fps;
        return this;
    }

    public play(animation?: Tile[] | null, fps: number = 10): this {
        if (animation && animation != this.animation) {
            // set animation
            this.animation = animation;
            this.frame = 0;
        }
        this.fps = fps;
        this.isPaused = false;
        return this;
    }
    public pause() {}
    public queue() {}

    public draw(context: Context): void {
        if (this.isPaused || !this.animation || this.animation.length == 0) return;

        this.next -= context.engine.delta;
        if (this.next < 0) {
            this.next = 1000 / this.fps;
            this.frame++;
            switch (this.after) {
                case "loop":
                    if (this.frame > this.animation.length - 1) this.frame = 0;
                    if (this.frame < 0) this.frame = this.animation.length;
                    break;
                case "end":
                    if (this.frame > this.animation.length - 1) this.frame--;
                    break;
            }
            this.material.tile = this.animation[this.frame];
        }

        context.drawTile(this.absolut(), this.animation[this.frame], this.material);
    }
}
