export default class Renderer {
    public readonly canvas: HTMLCanvasElement;
    public readonly ctx: WebGL2RenderingContext;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("webgl2");

        if (!this.ctx) throw new Error("WebGL2 not supported... :(");
    }

    clear() {
        this.ctx.clearColor(0, 0, 0, 1);
        this.ctx.clear(this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT);
    }

    begin() {
        // called on frame start
    }

    flush() {
        // called on frame end
    }

    pushTarget() {}

    popTarget() {}

    drawBuffer() {}
}
