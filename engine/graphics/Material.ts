// specifies how geometry is rendered (defines shader and holds data) -> at runtime converted to shader
import default3d from "./webgl2/shader/default3d.js";
import sprite2d from "./webgl2/shader/sprite2d.js";

import Tile from "../core/Tile.js";
import Vec from "../core/Vec.js";

import Renderer from "./webgl2/Renderer.js";
import Shader, { ShaderSource } from "./webgl2/Shader.js";

export default class Material {
    public readonly source: ShaderSource;

    public color: Vec = Vec.from(0xffffffff);

    constructor(source?: ShaderSource) {
        if (!source) {
            // use default 3d shader
            source = default3d;
        }

        this.source = source;
    }

    private _runtime: Shader;
    public compile(renderer: Renderer): Shader {
        if (!this._runtime) this._runtime = Shader.cache(renderer.ctx, this.source);
        return this._runtime;
    }
}

export class SpriteMaterial extends Material {
    public tile: Tile;

    constructor() {
        // use Sprite 2d shader
        super(sprite2d);

        this.color = Vec.from(0xffffffff);
    }
}
