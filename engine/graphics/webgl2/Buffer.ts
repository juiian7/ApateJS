//import DataArray, { DataArrayType } from "../DataArray.js";

type TypeArray = Float32Array | Uint8Array;

type BufferTarget = "array" | "element";
type BufferUsage = "static_draw" | "dynamic_draw";

export default class Buffer<T extends TypeArray> {
    private gl: WebGL2RenderingContext;
    public readonly buf: WebGLBuffer;

    public readonly target: BufferTarget;
    private readonly glTarget: number;

    public readonly usage: BufferUsage;
    private readonly glUsage: number;

    public data: T;
    public vertices: number = 0;

    constructor(gl: WebGL2RenderingContext, target: BufferTarget = "array", usage: BufferUsage = "static_draw") {
        this.gl = gl;
        this.buf = gl.createBuffer()!;
        if (!this.buf) throw new Error("Can't create buffer!");

        this.target = target;
        this.glTarget = target === "array" ? gl.ARRAY_BUFFER : gl.ELEMENT_ARRAY_BUFFER;

        this.usage = usage;
        this.glUsage = usage === "static_draw" ? gl.STATIC_DRAW : gl.DYNAMIC_DRAW;
    }

    public upload(data: T, vertices: number = 0) {
        this.gl.bindBuffer(this.glTarget, this.buf);
        this.gl.bufferData(this.glTarget, data, this.glUsage);
        this.data = data;
        this.vertices = vertices;
        return this;
    }

    public allocSize(size: number, vertices: number = 0) {
        // @ts-ignore
        return this.upload(size, vertices);
    }

    public update() {
        this.gl.bindBuffer(this.glTarget, this.buf);
        this.gl.bufferSubData(this.glTarget, 0, this.data);
        return this;
    }

    public bind() {
        this.gl.bindBuffer(this.glTarget, this.buf);
    }
}
