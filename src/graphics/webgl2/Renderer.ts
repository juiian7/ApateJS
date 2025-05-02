import { Vec } from "../../core/Vec.js";
import { VertexArray } from "./VertexArray.js";
import { Shader } from "./Shader.js";
import { Texture } from "../Texture.js";

export type DrawMode = "lines" | "line_loop" | "line_strip" | "points" | "triangles" | "triangle_fan" | "triangle_strip";

export interface RenderTarget {
    framebuffer: WebGLFramebuffer;
    texture: Texture;
}

export class Renderer {
    public readonly canvas: HTMLCanvasElement;
    public readonly ctx: WebGL2RenderingContext;

    public stats = {
        fps: 0,
        drawCalls: 0,
    };

    private currentClearColor: Vec;
    private mask: number;

    private targets: RenderTarget[] = [];

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("webgl2");

        if (!this.ctx) throw new Error("WebGL2 not supported... :(");

        this.ctx.enable(this.ctx.DEPTH_TEST);

        this.ctx.enable(this.ctx.BLEND);
        this.ctx.blendFunc(this.ctx.SRC_ALPHA, this.ctx.ONE_MINUS_SRC_ALPHA);

        this.clearColor = new Vec([0, 0, 0, 1]);
        this.mask = this.clearMask();
    }

    clear(mask?: number, color?: Vec) {
        if (mask !== undefined) this.mask = mask;
        if (color) this.clearColor = color;

        this.ctx.clear(this.mask);
    }

    public set clearColor(color: Vec) {
        if (color.r > 1) {
            color.r /= 255;
            color.g /= 255;
            color.b /= 255;
            color.a /= 255;
        }
        this.ctx.clearColor(color.r, color.g, color.b, color.a);
        this.currentClearColor = color;
    }

    public get clearColor(): Vec {
        return this.currentClearColor;
    }

    clearMask(color: boolean = true, depth: boolean = true, stencil: boolean = false): number {
        return (
            (color ? this.ctx.COLOR_BUFFER_BIT : 0) | //
            (depth ? this.ctx.DEPTH_BUFFER_BIT : 0) |
            (stencil ? this.ctx.STENCIL_BUFFER_BIT : 0)
        );
    }

    private _second: number = 1000;
    private _frames: number = 0;
    private _drawCalls: number = 0;
    public begin(dt: number) {
        // called on frame start
        this._second -= dt;
        if (this._second <= 0) {
            this._second = 1000;

            this.stats.fps = this._frames;
            this._frames = 0;
        }
        this._drawCalls = 0;
    }

    public flush() {
        // called on frame end
        this._frames++;
        this.stats.drawCalls = this._drawCalls;
    }

    createTarget(): RenderTarget;
    createTarget(width: number, height: number): RenderTarget;
    createTarget(texture: Texture): RenderTarget;
    createTarget(...args: any[]) {
        if (args.length == 0) args = [this.canvas.clientWidth, this.canvas.clientHeight];

        let texture = args[0] as Texture;
        if (!(texture instanceof Texture)) texture = new Texture(args[0], args[1], "rgba", "rgba");

        const target: RenderTarget = {
            framebuffer: this.ctx.createFramebuffer(),
            texture,
        };
        this.ctx.bindFramebuffer(this.ctx.FRAMEBUFFER, target.framebuffer);
        this.ctx.framebufferTexture2D(this.ctx.FRAMEBUFFER, this.ctx.COLOR_ATTACHMENT0, this.ctx.TEXTURE_2D, texture.compile(this, 7), 0);

        return target;
    }

    private setTarget(target: RenderTarget | null) {
        if (target === null) {
            this.ctx.bindFramebuffer(this.ctx.FRAMEBUFFER, null);
            this.ctx.viewport(0, 0, this.canvas.width, this.canvas.height);
            return;
        }
        this.ctx.bindFramebuffer(this.ctx.FRAMEBUFFER, target.framebuffer);
        this.ctx.viewport(0, 0, target.texture?.width || 0, target.texture?.height || 0);
    }

    pushTarget(target: RenderTarget) {
        this.targets.push(target);
        this.setTarget(target);
    }

    popTarget() {
        if (this.targets.length == 0) throw new Error("No targets to pop left!");

        this.targets.pop();
        if (this.targets.length == 0) this.setTarget(null);
        else this.setTarget(this.targets[this.targets.length - 1]);
    }

    drawMode(mode: DrawMode): number {
        switch (mode) {
            case "lines":
                return this.ctx.LINES;
            case "line_loop":
                return this.ctx.LINE_LOOP;
            case "line_strip":
                return this.ctx.LINE_STRIP;
            case "points":
                return this.ctx.POINTS;
            case "triangle_fan":
                return this.ctx.TRIANGLE_FAN;
            case "triangle_strip":
                return this.ctx.TRIANGLE_STRIP;
            case "triangles":
                return this.ctx.TRIANGLES;
        }
    }

    draw(count: number, drawMode: number = 5) {
        this.ctx.drawArrays(drawMode, 0, count);
        this._drawCalls++;
    }

    drawInstanced(count: number, instances: number, drawMode: number = 5) {
        this.ctx.drawArraysInstanced(drawMode, 0, count, instances);
        this._drawCalls++;
    }
}
