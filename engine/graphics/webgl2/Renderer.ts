import Vec from "../../core/Vec.js";
import VertexArray from "./VertexArray.js";
import Shader from "./Shader.js";

type DrawMode = "lines" | "line_loop" | "line_strip" | "points" | "triangles" | "triangle_fan" | "triangle_strip";

export default class Renderer {
    public readonly canvas: HTMLCanvasElement;
    public readonly ctx: WebGL2RenderingContext;

    private currentClearColor: Vec;
    private mask: number;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("webgl2");

        if (!this.ctx) throw new Error("WebGL2 not supported... :(");

        this.ctx.enable(this.ctx.DEPTH_TEST);

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
    }

    drawInstanced() {}
}
