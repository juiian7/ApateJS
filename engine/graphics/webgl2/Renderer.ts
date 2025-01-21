import Vec from "../../core/Vec.js";
import VertexArray from "./VertexArray.js";
import Shader from "./Shader.js";

export default class Renderer {
    public readonly canvas: HTMLCanvasElement;
    public readonly ctx: WebGL2RenderingContext;

    private currentClearColor: Vec;
    private mask: number;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("webgl2");

        if (!this.ctx) throw new Error("WebGL2 not supported... :(");

        this.clearColor(new Vec([0, 0, 0, 1]));
        this.mask = this.clearMask();
    }

    clear(mask?: number, color?: Vec) {
        if (mask !== undefined) this.mask = mask;
        if (color) this.clearColor(color);

        this.ctx.clear(this.mask);
    }

    clearColor(color: Vec): void {
        if (color.r > 1) {
            color.r /= 255;
            color.g /= 255;
            color.b /= 255;
            color.a /= 255;
        }
        this.ctx.clearColor(color.r, color.g, color.b, color.a);
        this.currentClearColor = color;
    }

    clearMask(color: boolean = true, depth: boolean = true, stencil: boolean = false): number {
        return (
            (color ? this.ctx.COLOR_BUFFER_BIT : 0) | //
            (depth ? this.ctx.DEPTH_BUFFER_BIT : 0) |
            (stencil ? this.ctx.STENCIL_BUFFER_BIT : 0)
        );
    }

    begin() {
        // called on frame start
    }

    flush() {
        // called on frame end
    }

    createTarget() {}

    pushTarget() {}

    popTarget() {}

    draw(count: number) {
        this.ctx.drawArrays(this.ctx.TRIANGLE_STRIP, 0, count);
    }

    drawInstanced() {}
}
