// vertex data (pos, color) -> at runtime converted to VertexArray

import { isBufferView } from "./Context.js";
import { BaseMaterial, Default3DMaterial } from "./Material.js";
import { Buffer, BufferUsage, BufferView } from "./webgl2/Buffer.js";
import { Renderer, DrawMode } from "./webgl2/Renderer.js";
import { type Shader } from "./webgl2/Shader.js";
import { VertexArray } from "./webgl2/VertexArray.js";

// ONLY USED FOR GEOMETRY RENDERING -> use buffers directly instead if more control needed

type VertexType = "position" | "texture" | "normal" | "color";
//type VertexDataType = "float" | "uint8" | "int8" | "float64";
//type Layout = { size: number; type: VertexDataType }[];

interface VertexData {
    type: VertexType;
    data: number[] | BufferView;
    vertexSize: number;
    material?: BaseMaterial;
    attributeLocation?: number;
}

export class Mesh {
    public name: string;
    public indices?: number[] | BufferView;
    public readonly arrays: VertexData[] = [];
    public drawMode: DrawMode = "triangle_strip";
    public material?: Default3DMaterial;

    public static plane2D(align: "center" | "bottom left"): Mesh {
        let mesh = new Mesh();

        let pos = [0, 0, 0, 1, 1, 0, 1, 1];
        let uv = [0, 1, 0, 0, 1, 1, 1, 0];
        if (align == "center") for (let i = 0; i < pos.length; i++) pos[i] -= 0.5;

        mesh.arrays.push({ type: "position", data: pos, vertexSize: 2 }, { type: "texture", data: uv, vertexSize: 2 });
        return mesh;
    }

    private _runtime: VertexArray;
    private _buffers: BufferView[];
    public compile(renderer: Renderer): VertexArray {
        if (!this._buffers) {
            this._buffers = [];
            for (const arr of this.arrays) {
                if (!isBufferView(arr.data)) {
                    const data = new Float32Array(arr.data);
                    const count = data.length / arr.vertexSize;
                    arr.data = new Buffer("array", "static_draw", data, renderer.ctx).view(0, 0, renderer.ctx.FLOAT, count);
                } else arr.data.buffer.compile(renderer);
                this._buffers.push(arr.data);
            }
        }

        if (!this._runtime) {
            this._runtime = new VertexArray(renderer.ctx);

            for (let i = 0, b = 0; i < this._buffers.length; i++, b++) {
                const { loc, layout } = getAttrLocAndLayout(this.arrays[i], this._buffers[b], this.material?.compile(renderer));
                this._runtime.setBuffer(this._buffers[b], layout, loc === undefined ? i : loc);
            }
        }
        this._runtime.bind();

        /* if (this.needsUpdate) {
            // do update // new data to buffers
            this._runtime.setBuffers(this._buffers, []);
            } */
        if (this.indices) {
            // bind
            if (!isBufferView(this.indices)) {
                let data = new Float32Array(this.indices);
                this.indices = new Buffer("element", "static_draw", data, renderer.ctx).view(0, 0, renderer.ctx.UNSIGNED_BYTE);
            } else this.indices.buffer.compile(renderer);
            this.indices.buffer.bind();
        }
        return this._runtime;
    }
}

const possibleAttributeNames: { [key in VertexType]: string[] } = {
    color: ["col"],
    position: ["aVertexPos", "pos"],
    normal: ["aNormal", "normal"],
    texture: ["aTextCoord", "text", "uv"],
};
function getAttrLocAndLayout(data: VertexData, buffer: BufferView, shader: Shader) {
    const map: { [key in VertexType]: number } = { color: 3, position: 0, normal: 2, texture: 1 };
    const layout = [];
    if (shader) {
        for (const name in shader.attributeInfo) {
            for (const possibility of possibleAttributeNames[data.type]) {
                if (name.includes(possibility)) {
                    const loc = shader.attributeInfo[name].location;
                    map[data.type] = loc;
                    layout.push(shader.attrLayout[loc]);
                    break;
                }
            }
            if (layout.length > 0) break;
        }
    } else layout.push({ size: data.vertexSize, typeSize: buffer.typeSize });
    return { loc: map[data.type], layout };
}
