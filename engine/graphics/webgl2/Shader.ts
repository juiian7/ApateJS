import Renderer from "./Renderer.js";

export interface ShaderSource {
    vertex: string;
    fragment: string;
}

type AttributeLayout = { size: number; typeSize: number; divisor?: number }[];
type UniformInfo = { [name: string]: { type: string; location: WebGLUniformLocation } };
type AttributeInfo = { [name: string]: { /* type: string; */ location: number } };

const uniformTypeMap = {
    0x8b50: "2f",
    0x8b51: "3f",
    0x8b52: "4f",
    0x8b53: "2i",
    0x8b54: "3i",
    0x8b55: "4i",
    0x8b56: "1ui",
    0x8b57: "2ui",
    0x8b58: "3ui",
    0x8b59: "4ui",
    0x8b5a: "Matrix2f",
    0x8b5b: "Matrix3f",
    0x8b5c: "Matrix4f",
    0x8b5e: "T",
    0x8b60: "SAMPLER_CUBE??",
};

export default class Shader {
    private readonly gl: WebGL2RenderingContext;
    private readonly program: WebGLProgram;

    public readonly source: ShaderSource;

    public readonly attrLayout: AttributeLayout = [];
    //private numOfCompPerVertex: number = 0;
    public readonly uniformInfo: UniformInfo = {};
    public readonly attributeInfo: AttributeInfo = {};

    constructor(gl: WebGL2RenderingContext, source: ShaderSource) {
        this.gl = gl;
        this.program = gl.createProgram()!;
        if (!this.program) throw new Error("Can't create shader program!");

        this.source = source;

        this.compile();
        this.readAttributeLayout();
        this.readUniformTypes();
    }

    private readUniformTypes() {
        let num = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < num; i++) {
            let uni = this.gl.getActiveUniform(this.program, i);
            if (!uni) throw new Error("Error reading uniform!");

            let type = uniformTypeMap[uni.type];
            if (!type) {
                console.warn("Couldn't auto get uniform type!");
                return;
            }
            this.uniformInfo[uni.name] = { type, location: this.gl.getUniformLocation(this.program, uni.name)! };
        }
    }

    private readAttributeLayout() {
        let num = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_ATTRIBUTES);
        const sizeOf = { 0x8b50: 2, 0x8b51: 3, 0x8b52: 4 }; // only supports float vec 2,3,4
        for (let i = 0; i < num; i++) {
            let attr = this.gl.getActiveAttrib(this.program, i);
            if (!attr) throw new Error("Error reading attribute!");

            let compSize = sizeOf[attr.type];
            if (!compSize) {
                console.warn("Couldn't auto generate attribute layout!");
                return;
            }

            this.attributeInfo[attr.name] = { /* type: attr.type,  */ location: this.gl.getAttribLocation(this.program, attr.name) };
            //this.numOfCompPerVertex += compSize;
            this.attrLayout.push({ size: compSize, typeSize: 4 /* only floats */ });
        }
    }

    private createShader(type: number, source: string) {
        let s = this.gl.createShader(type);
        if (!s) throw new Error("Can't create shader!");

        this.gl.shaderSource(s, source);
        this.gl.compileShader(s);
        if (!this.gl.getShaderParameter(s, this.gl.COMPILE_STATUS)) {
            console.error("Error compiling shader");
            throw new Error(this.gl.getShaderInfoLog(s) || "Shader error!");
        }

        return s;
    }

    private compile() {
        let vs = this.createShader(this.gl.VERTEX_SHADER, this.source.vertex);
        let fs = this.createShader(this.gl.FRAGMENT_SHADER, this.source.fragment);

        this.gl.attachShader(this.program, vs);
        this.gl.attachShader(this.program, fs);
        this.gl.linkProgram(this.program);

        // delete shaders?
    }

    public use() {
        this.gl.useProgram(this.program);
        // uniforms should be set
    }

    public setUniform(name: string, value: number | number[]) {
        let uniform = this.uniformInfo[name];
        if (uniform) {
            if (uniform.type[0] == "M") this.gl[`uniform${uniform.type}v`](uniform.location, false, value); //matrix
            else if (uniform.type[0] == "T") this.gl.uniform1i(uniform.location, value as any); // texture
            else this.gl[`uniform${uniform.type}v`](uniform.location, value); // vec
        }
    }

    public setUniforms(uniforms: { [name: string]: number | number[] }) {
        for (const name in uniforms) this.setUniform(name, uniforms[name]);
    }

    private applyUniforms() {
        /* let uniforms = this.material.getUniforms();
        for (const name in uniforms) {
            let setter = this.uniformTypes[name];
            if (!setter) {
                console.warn(`Can't find uniform: "${name}"`);
                continue;
            }

            if (setter.type[0] == "M") {
                //matrix
                this.gl[`uniform${setter.type}v`](setter.location, false, uniforms[name]);
            } else if (setter.type[0] == "T") {
                // texture
                this.gl.uniform1i(setter.location, uniforms[name]);
            } else {
                this.gl[`uniform${setter.type}v`](setter.location, uniforms[name]);
            }
        } */
    }
}
