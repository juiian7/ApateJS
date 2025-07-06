//import DataArray, { DataArrayType } from "../DataArray.js";

import { Renderer } from "./Renderer";

type TypeArray = Float32Array | Uint8Array;

type BufferTarget = "array" | "element";
type BufferUsage = "static_draw" | "dynamic_draw";

export class Buffer<T extends TypeArray> {
    private gl: WebGL2RenderingContext;
    public buf: WebGLBuffer;

    private glTarget: number;
    private _target: BufferTarget;
    public set target(v: BufferTarget) {
        this._target = v;
        if (this.gl) this.glTarget = v === "array" ? this.gl.ARRAY_BUFFER : this.gl.ELEMENT_ARRAY_BUFFER;
    }
    public get target(): BufferTarget {
        return this._target;
    }

    private glUsage: number;
    public _usage: BufferUsage;
    public set usage(v: BufferUsage) {
        this._usage = v;
        if (this.gl) this.glUsage = v === "static_draw" ? this.gl.STATIC_DRAW : this.gl.DYNAMIC_DRAW;
    }
    public get usage(): BufferUsage {
        return this._usage;
    }

    public data: T;

    public get len() {
        return this.data.length;
    }

    constructor(target: BufferTarget = "array", usage: BufferUsage = "static_draw", gl?: WebGL2RenderingContext) {
        this.target = target;
        this.usage = usage;

        //@ts-ignore
        if (gl) this.compile({ ctx: gl });
    }

    public compile(renderer: Renderer) {
        if (this.gl) return;

        this.gl = renderer.ctx;
        this.target = this._target;
        this.usage = this._usage;

        this.buf = this.gl.createBuffer()!;
        if (!this.buf) throw new Error("Can't create buffer!");
        this.bind();
        if (this.data) this.upload(this.data);
    }

    public upload(data: T): this {
        if (this.gl) {
            this.gl.bindBuffer(this.glTarget, this.buf);
            this.gl.bufferData(this.glTarget, data, this.glUsage);
        }
        this.data = data;

        return this;
    }

    public allocSize(size: number): this {
        // @ts-ignore
        return this.upload(size);
    }

    public update(): this {
        if (!this.gl) throw new Error("Buffer not yet compiled!");
        this.gl.bindBuffer(this.glTarget, this.buf);
        this.gl.bufferSubData(this.glTarget, 0, this.data);

        return this;
    }

    public bind() {
        if (!this.gl) throw new Error("Buffer not yet compiled!");
        this.gl.bindBuffer(this.glTarget, this.buf);
    }
}
