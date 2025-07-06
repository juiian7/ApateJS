import { Renderer } from "./Renderer.js";
import { webglDebugger } from "./WebGLDebugger.js";

export type BufferTarget = keyof typeof BufferTarget;
export const BufferTarget = {
    array: 34962,
    element: 34963,
};

export type BufferUsage = keyof typeof BufferUsage;
export const BufferUsage = {
    static_draw: 35044,
    dynamic_draw: 35048,
};

const sizeOf = { 0x1400: 1, 0x1401: 1, 0x1402: 2, 0x1403: 2, 0x1404: 4, 0x1405: 4, 0x1406: 4 };

export interface BufferView {
    buffer: Buffer;
    offset: number;
    length: number;
    type: number;
    typeSize: number;
    count: number;
}

export class Buffer {
    private static debugId: number = 0;
    public readonly id: number = Buffer.debugId++;

    private gl: WebGL2RenderingContext;
    private buffer: WebGLBuffer;

    private target: number;
    private usage: number;
    public data: ArrayBufferView;

    constructor(target: BufferTarget, usage: BufferUsage, data?: ArrayBufferView, gl?: WebGL2RenderingContext);
    constructor(target: number, usage: number, data?: ArrayBufferView, gl?: WebGL2RenderingContext);
    constructor(...args: any[]) {
        webglDebugger.watch("buffers", this);

        this.target = typeof args[0] == "string" ? BufferTarget[args[0]] : args[0];
        this.usage = typeof args[1] == "string" ? BufferUsage[args[1]] : args[1];
        if (args[2]) this.data = args[2];
        if (args[3]) this.compile(args[3]);
    }

    compile(renderer: Renderer | WebGL2RenderingContext) {
        if (this.gl) return;

        this.gl = (renderer as any).ctx || renderer;
        this.buffer = this.gl.createBuffer()!;
        if (!this.buffer) throw new Error("Can't create buffer!");

        if (this.data) this.upload(this.data);
    }

    public upload(data: ArrayBufferView): this {
        if (this.gl) {
            // target doesn't matter for uploading, only for using
            this.gl.bindBuffer(this.target, this.buffer);
            this.gl.bufferData(this.target, data, this.usage);
        }
        this.data = data;

        return this;
    }

    public allocSize(size: number): this {
        // @ts-ignore
        return this.upload(size);
    }

    public update(dstOffset: number = 0, srcOffset: number = 0, length: number = 0): this {
        if (!this.gl) throw new Error("Buffer not yet compiled!");
        this.gl.bindBuffer(this.target, this.buffer);
        this.gl.bufferSubData(this.target, dstOffset, this.data, srcOffset, length); // length 0 means auto
        return this;
    }

    public view(offset: number = 0, length: number = 0, type: number = 5126, count: number = 0): BufferView {
        return {
            buffer: this,
            offset,
            length: length || this.data.byteLength,
            type,
            typeSize: sizeOf[type] || 4,
            count: count || (length || this.data.byteLength) / (sizeOf[type] || 4),
        };
    }

    public bind() {
        if (!this.gl) throw new Error("Buffer not yet compiled!");
        this.gl.bindBuffer(this.target, this.buffer);
    }
}
