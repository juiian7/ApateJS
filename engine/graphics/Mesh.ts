// vertex data (pos, color) -> at runtime converted to VertexArray

import Material from "./Material.js";
import Buffer from "./webgl2/Buffer.js";
import Renderer from "./webgl2/Renderer.js";
import VertexArray from "./webgl2/VertexArray.js";

// ONLY USED FOR GEOMETRY RENDERING -> use buffers directly instead if more control needed

type VertexType = "position" | "texture" | "normal" | "color";
//type VertexDataType = "float" | "uint8" | "int8" | "float64";
//type Layout = { size: number; type: VertexDataType }[];

interface VertexData {
    type: VertexType;
    data: number[];
    vertexSize: number;
    material?: Material;
}

export default class Mesh {
    public readonly arrays: VertexData[] = [];
    public material?: Material;

    public static plane2D(): Mesh {
        let mesh = new Mesh();
        mesh.arrays.push(
            { type: "position", data: [0, 0, 0, 1, 1, 0, 1, 1], vertexSize: 2 },
            { type: "texture", data: [0, 0, 0, 1, 1, 0, 1, 1], vertexSize: 2 }
        );
        return mesh;
    }

    private _runtime: VertexArray;
    private _buffers: Buffer<any>[];
    public compile(renderer: Renderer): VertexArray {
        if (!this._buffers) {
            this._buffers = [];
            for (const arr of this.arrays) {
                let data = new Float32Array(arr.data);
                this._buffers.push(new Buffer(renderer.ctx, "array", "static_draw").upload(data));
            }
        }
        if (!this._runtime) {
            this._runtime = new VertexArray(renderer.ctx);
            for (let i = 0; i < this._buffers.length; i++) {
                this._runtime.setBuffer(this._buffers[i], [{ size: this.arrays[i].vertexSize, typeSize: 4 }], i);
            }
        }
        /* if (this.needsUpdate) {
            // do update // new data to buffers
            this._runtime.setBuffers(this._buffers, []);
        } */
        return this._runtime;
    }
}
