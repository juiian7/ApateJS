import Renderer from "./webgl2/Renderer.js";
import VertexArray from "./webgl2/VertexArray.js";

// vertex data (pos, color) -> at runtime converted to VertexArray
export default class Geometry {
    data: number[][] = [];

    public static plane2D(): Geometry {
        return new Geometry();
    }

    private _runtime: VertexArray;
    public compile(renderer: Renderer) {
        if (!this._runtime) this._runtime = new VertexArray(renderer.ctx);
        return this._runtime;
    }
}
