/* import Material from "./Material.js";
import Buffer from "./webgl2/Buffer.js";
import Renderer from "./webgl2/Renderer.js";
import VertexArray from "./webgl2/VertexArray.js";

type VertexType = "float" | "int8" | "uint8";
type Layout = { size: number; type: VertexType }[];

interface Surface {
    arrays: { data: number; layout: Layout }[];
    material?: Material;
}

// vertex data (pos, color) -> at runtime converted to VertexArray
export default class Mesh {
    public readonly surfaces: Surface[] = [];
    public material?: Material;

    public static plane2D(): Mesh {
        let mesh = new Mesh();
        mesh.surfaces.push({ data: [0, 0, 0, 1, 1, 0, 1, 1], layout: [{ size: 4, type: "float" }] });
        return mesh;
    }

    private _runtime: VertexArray;
    private _buffers: Buffer<any>[];
    public draw(renderer: Renderer) {
        if (!this._buffers) {
            this._buffers = [];
            for (const name in this.arrays) {
                let data = this.arrays[name];
                // create buffers
                // this._buffers.push(new Buffer(renderer.ctx, "array", "static_draw").upload());
            }
        }
        if (!this._runtime) this._runtime = new VertexArray(renderer.ctx);
        if (this.needsUpdate) {
            // do update // new data to buffers
            this._runtime.setBuffers(this._buffers, []);
        }
        return this._runtime;
    }
}
 */
