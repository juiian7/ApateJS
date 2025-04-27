import { Buffer } from "./Buffer.js";

type AttributeLayout = { size: number; typeSize: number; divisor?: number }[];

export class VertexArray {
    private readonly gl: WebGL2RenderingContext;
    private readonly vao: WebGLVertexArrayObject;

    desiredLayout: AttributeLayout;

    private vertexCount: number = 0;

    get count(): number {
        if (this.vertexCount == 0) console.warn("Vertex count is zero!");
        return this.vertexCount;
    }

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
        this.vao = gl.createVertexArray()!;
        if (!this.vao) throw new Error("Can't create Vertex Array!");
    }

    bind() {
        this.gl.bindVertexArray(this.vao);
    }

    public setBuffer(buffer: Buffer<any>, layout: AttributeLayout = this.desiredLayout, index: number = 0) {
        //if (buffer.len / buffer.vertices != this.numOfCompPerVertex) throw new Error("Wrong buffer layout!");

        this.bind();
        buffer.bind();

        let size = 0;
        let offset = 0;
        let stride = 0;
        for (const attr of layout) stride += attr.size * attr.typeSize;
        for (const attr of layout) {
            this.gl.enableVertexAttribArray(index);
            this.gl.vertexAttribPointer(index, attr.size, this.gl.FLOAT, false, stride, offset);
            if (attr.divisor) this.gl.vertexAttribDivisor(index, attr.divisor);
            else size += attr.size;
            offset += attr.size * attr.typeSize;
            index++;
        }
        if (size > 0) this.vertexCount = buffer.len / size; // FIXME wrong size when divisor
    }

    public setBuffers(buffers: Buffer<any>[], layouts: AttributeLayout[]) {
        if (buffers.length != layouts.length) throw new Error("Buffers differs from layouts... can't set buffers");

        let ndx = 0;
        for (let i = 0; i < buffers.length; i++) {
            this.setBuffer(buffers[i], layouts[i], ndx);
            ndx += layouts[i].length;
        }
    }
}
