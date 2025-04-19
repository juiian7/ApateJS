import Sprite from "./Sprite.js";

import Tile from "../../core/Tile.js";
import { Obj } from "../index.js";
import Context from "../../graphics/Context.js";
import Apate from "../../Apate.js";

export interface Anim {
    speed?: number;
    name?: string;
    frames: Tile[];
    frame?: number;
    startAt?: number;
    repeat?: "loop" | "once";
}

export default class ASprite<E extends Apate = Apate> extends Sprite<E> {
    public fps: number = 20;
    public animation: Anim;
    public isPaused: boolean = false;

    private _finished: boolean = false;
    public get finished() {
        return this._finished;
    }

    private next: number = 0;

    private animQueue: Anim[] = [];

    constructor(animation: Anim = { frames: [] }, fps: number = 20, parent?: Obj, name?: string) {
        super(animation.frames[0], parent, name);
        this.fps = fps;

        this.run(animation);
    }

    public run(animation: Anim) {
        this.animation = animation;
        this.animation.frame = animation.startAt || 0;
        if (!this.animation.speed) this.animation.speed = 1;
        this.next = 1000 / (this.fps * this.animation.speed);
        this._finished = false;
        return this;
    }

    public play(animation?: Anim | null): this {
        if (animation && animation != this.animation) {
            this.run(animation);
        }
        this.isPaused = false;
        return this;
    }

    public pause() {
        this.isPaused = true;
    }

    public queue(...animations: Anim[]) {
        this.animQueue.unshift(...animations);
    }

    public draw(context: Context): void {
        if (!this.animation || this.animation.frames.length == 0) {
            if (this.animQueue.length == 0) return;

            let anim = this.animQueue.pop();
            if (anim) this.run(anim);
        }

        if (!this.isPaused) this.next -= context.engine.delta;
        if (this.next < 0) {
            this.next = 1000 / (this.fps * this.animation.speed);
            if (!this._finished) this.animation.frame++;
            switch (this.animation.repeat || "loop") {
                case "loop":
                    if (this.animation.frame > this.animation.frames.length - 1) this.animation.frame = 0;
                    break;
                case "once":
                    if (this.animation.frame > this.animation.frames.length - 1) {
                        this._finished = true;
                        this.animation.frame--;
                        let anim = this.animQueue.pop();
                        if (anim) this.run(anim);
                    }
                    break;
            }
        }

        this.material.tile = this.animation.frames[this.animation.frame];
        super.draw(context);
    }
}
