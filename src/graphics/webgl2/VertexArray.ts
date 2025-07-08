import { Buffer, BufferTarget, BufferView } from "./Buffer.js";
import { webglDebugger } from "./WebGLDebugger.js";

type Layout = { size: number; typeSize: number; divisor?: number };
type AttributeLayout = Layout[];
type VertexDebugInfo = { view: BufferView; layout: Layout };

export class VertexArray {
    private static debugId: number = 0;
    public readonly id: number = VertexArray.debugId++;
    public readonly debugState: VertexDebugInfo[] = new Array(9);

    private readonly gl: WebGL2RenderingContext;
    private readonly vao: WebGLVertexArrayObject;

    public desiredLayout: AttributeLayout;
    public indices?: BufferView;

    private vertexCount: number = 0;

    get count(): number {
        if (!this.vertexCount) console.warn("Vertex count is zero!");
        return this.vertexCount;
    }

    constructor(gl: WebGL2RenderingContext) {
        webglDebugger.watch("vertexArrays", this);

        this.gl = gl;
        this.vao = gl.createVertexArray()!;
        if (!this.vao) throw new Error("Can't create Vertex Array!");
    }

    bind() {
        this.gl.bindVertexArray(this.vao);
    }

    public setBuffer(view: BufferView, layout: AttributeLayout = this.desiredLayout, index: number = 0) {
        //if (buffer.len / buffer.vertices != this.numOfCompPerVertex) throw new Error("Wrong buffer layout!");

        this.bind();
        view.buffer.bind();

        let size = 0;
        let offset = view.offset;
        let stride = 0;
        let vertexCount = view.count;
        for (const attr of layout) stride += attr.size * attr.typeSize;
        for (const attr of layout) {
            this.gl.enableVertexAttribArray(index);
            this.gl.vertexAttribPointer(index, attr.size, view.type, false, stride, offset);
            if (attr.divisor) {
                this.gl.vertexAttribDivisor(index, attr.divisor);
                vertexCount = this.vertexCount;
            } else size += attr.size;
            offset += attr.size * attr.typeSize;
            this.debugState[index] = { view, layout: attr };
            index++;
        }
        if (this.vertexCount == 0) this.vertexCount = vertexCount;
        else if (this.vertexCount != vertexCount) console.warn("Different vertex counts in one array. Is this desired??");
    }

    public setBuffers(buffers: BufferView[], layouts: AttributeLayout[]) {
        if (buffers.length != layouts.length) throw new Error("Buffers differs from layouts... can't set buffers");

        let ndx = 0;
        for (let i = 0; i < buffers.length; i++) {
            this.setBuffer(buffers[i], layouts[i], ndx);
            ndx += layouts[i].length;
        }
    }
}
