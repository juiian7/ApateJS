import Vec from "../core/Vec.js";
import Renderer from "./webgl2/Renderer.js";

// the raw image used for rendering

export type TextureFormat = "rgb" | "rgba" | "luminance" | "alpha";
export type MinFilter =
    | "linear"
    | "nearest"
    | "nearest_mipmap_nearest"
    | "linear_mipmap_nearest"
    | "nearest_mipmap_linear"
    | "linear_mipmap_linear";

export interface TextureParameter {
    min: MinFilter;
    mag: "linear" | "nearest";
    warp_h: "repeat" | "clamp" | "mirror";
    warp_v: "repeat" | "clamp" | "mirror";
}

export type TextureSource = TexImageSource & { width: number; height: number };

const pixelTextureParameter: TextureParameter = {
    min: "nearest",
    mag: "nearest",
    warp_v: "clamp",
    warp_h: "clamp",
};

export default class Texture {
    public width: number;
    public height: number;

    public get size(): number[] {
        return [this.width, this.height];
    }

    private buffer: ArrayBufferView | null = null;

    private format: TextureFormat;
    private internalFormat: TextureFormat;

    public parameter: TextureParameter = {
        min: "nearest_mipmap_linear",
        mag: "linear",
        warp_h: "repeat",
        warp_v: "repeat",
    };

    private source: TextureSource;

    public constructor(width: number, height: number, format: TextureFormat, internalFormat: TextureFormat) {
        this.width = width;
        this.height = height;
        this.format = format;
        this.internalFormat = internalFormat;
        this.parameter = pixelTextureParameter;
    }

    public static fromSource(source: TextureSource, format: TextureFormat = "rgba", width: number = 1, height: number = 1): Texture {
        let text = new Texture(width, height, format, format);
        text.source = source;
        text.format = format;
        text.width = source.width;
        text.height = source.height;
        return text;
    }

    public static fromColor(color: Vec): Texture {
        let text = new Texture(1, 1, "rgba", "rgba");
        text.buffer = new Uint8Array(color.vec());
        return text;
    }

    public static fromPixels(pixels: number[], width: number, height: number, format: TextureFormat = "rgba") {
        let text = new Texture(width, height, format, format);
        text.format = format;
        text.buffer = new Uint8Array(pixels);
        return text;
    }

    // Renderer helper

    private _runtime: WebGLTexture;
    public compile(renderer: Renderer, slot: number): WebGLTexture {
        this._bindTexture(renderer.ctx, slot);
        return this._runtime;
    }

    private _init(gl: WebGL2RenderingContext) {
        this._runtime = gl.createTexture();
        if (!this._runtime) throw new Error("Couldn't create Texture!");
        gl.bindTexture(gl.TEXTURE_2D, this._runtime);

        let iFormat = matchFormat(this.internalFormat, gl);
        let format = matchFormat(this.format, gl);
        if (this.source) gl.texImage2D(gl.TEXTURE_2D, 0, iFormat, format, gl.UNSIGNED_BYTE, this.source);
        else gl.texImage2D(gl.TEXTURE_2D, 0, iFormat, this.width, this.height, 0, format, gl.UNSIGNED_BYTE, this.buffer);

        this._setTexParams(gl);

        return this._runtime;
    }

    private _bindTexture(gl: WebGL2RenderingContext, slot: number) {
        if (!this._runtime) this._init(gl);

        gl.activeTexture(gl.TEXTURE0 + slot);
        gl.bindTexture(gl.TEXTURE_2D, this._runtime);
    }

    private _setTexParams(gl: WebGL2RenderingContext) {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, matchFilter(this.parameter.min, gl));
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, matchFilter(this.parameter.mag, gl));
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, matchWrap(this.parameter.warp_h, gl));
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, matchWrap(this.parameter.warp_v, gl));
    }
}

// Renderer helper matching functions

function matchFilter(filter: MinFilter, gl: WebGL2RenderingContext) {
    switch (filter) {
        case "linear":
            return gl.LINEAR;
        case "nearest":
            return gl.NEAREST;
        case "nearest_mipmap_nearest":
            return gl.NEAREST_MIPMAP_LINEAR;
        case "linear_mipmap_nearest":
            return gl.LINEAR_MIPMAP_NEAREST;
        case "nearest_mipmap_linear":
            return gl.NEAREST_MIPMAP_LINEAR;
        case "linear_mipmap_linear":
            return gl.LINEAR_MIPMAP_LINEAR;
    }
}

function matchWrap(wrap: "repeat" | "clamp" | "mirror", gl: WebGL2RenderingContext) {
    switch (wrap) {
        case "repeat":
            return gl.REPEAT;
        case "clamp":
            return gl.CLAMP_TO_EDGE;
        case "mirror":
            return gl.MIRRORED_REPEAT;
    }
}

function matchFormat(format: TextureFormat, gl: WebGL2RenderingContext) {
    switch (format) {
        case "rgb":
            return gl.RGB;
        case "luminance":
            return gl.LUMINANCE;
        case "alpha":
            return gl.ALPHA;
        case "rgba":
        default:
            return gl.RGBA;
    }
}
