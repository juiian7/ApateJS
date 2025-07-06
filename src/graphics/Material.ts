// specifies how geometry is rendered (defines shader and holds data) -> at runtime converted to shader
import default3d from "./webgl2/shader/default3d.js";
import pbr3d from "./webgl2/shader/pbr3d.js";
import sprite2d from "./webgl2/shader/sprite2d.js";
import batch2d from "./webgl2/shader/batch2d.js";
import postprocessing from "./webgl2/shader/postprocessing.js";

import { Tile } from "../core/Tile.js";
import { Vec4 } from "../core/Vec4.js";

import { Renderer } from "./webgl2/Renderer.js";
import { Shader, ShaderSource } from "./webgl2/Shader.js";
import { Color } from "../core/Color.js";
import { Texture } from "./Texture.js";

export class BaseMaterial {
    public readonly source: ShaderSource;

    //public color: Vec4 = Vec4.fromHex(0xffffffff);

    constructor(source?: ShaderSource) {
        if (!source) {
            // use default 3d shader
            source = default3d;
        }

        this.source = source;
    }

    private _runtime: Shader;
    public compile(renderer: Renderer): Shader {
        if (!this._runtime) this._runtime = Shader.cache(renderer, this.source);
        return this._runtime;
    }

    public data() {
        return {};
    }
}

export class SpriteMaterial extends BaseMaterial {
    public tile: Tile;
    public color: Color = Color.fromHex(0xffffffff);
    public flipH: boolean = false;
    public flipV: boolean = false;

    constructor(source: ShaderSource = sprite2d) {
        super(source);
    }

    data() {
        return {
            uColor: this.color.color(),
            uFlipH: +this.flipH,
            uFlipV: +this.flipV,
        };
    }
}

export class SpriteBatchMaterial extends BaseMaterial {
    public atlas: Tile;
    public color: Color = Color.fromHex(0xffffffff);

    constructor() {
        super(batch2d);
    }
}

export class Default3DMaterial extends BaseMaterial {
    /* public ambient: Color = Color.fromHex(0x000000ff); */

    public base?: Color;

    /* public diffuseTexture?: Texture; */

    constructor(base?: Color, shaderSource: ShaderSource = default3d) {
        super(shaderSource);

        if (base) this.base = base;
    }

    public data(): any {
        const data = { ...super.data() };
        if (this.base) data["uBaseColor"] = this.base.color();
        return data;
    }
}

export class PBR3DMaterial extends Default3DMaterial {
    /* public ambient: Color = Color.fromHex(0x000000ff); */

    public baseTexture?: Texture;
    public normalTexture?: Texture;
    public metallicRoughnessTexture?: Texture;
    public emissiveTexture?: Texture;
    public emissiveFactor?: Color;

    constructor(base?: Color) {
        super(base, pbr3d);
    }

    public data(): any {
        const data = { ...super.data() };
        if (this.baseTexture) data["uBaseTexture"] = this.baseTexture;
        if (this.normalTexture) data["uNormalTexture"] = this.normalTexture;
        if (this.metallicRoughnessTexture) data["uMetallicRoughnessTexture"] = this.metallicRoughnessTexture;
        if (this.emissiveTexture) data["uEmissiveTexture"] = this.emissiveTexture;
        if (this.emissiveFactor) data["uEmissiveFactor"] = this.emissiveFactor.color();
        return data;
    }
}

export class PostprocessingMaterial extends BaseMaterial {
    constructor(glsl_fragment: string = "") {
        super(postprocessing);
        this.source.fragment = this.source.fragment.replace("//#inject", glsl_fragment);
    }
}
