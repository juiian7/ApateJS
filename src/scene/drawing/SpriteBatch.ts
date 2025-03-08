// draw a single Tile to multiple positions

import { Obj } from "../index.js";

import Tile from "../../core/Tile.js";
import Transform from "../../core/Transform.js";
import Context from "../../graphics/Context.js";
import Vec from "../../core/Vec.js";
import { SpriteBatchMaterial } from "../../graphics/Material.js";
import VertexArray from "../../graphics/webgl2/VertexArray.js";
import Buffer from "../../graphics/webgl2/Buffer.js";
import { inverse } from "../../core/Matrix.js";
import Apate from "../../Apate.js";

const plane = {
    data: new Float32Array([0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0]),
    layout: [
        { size: 2, typeSize: 4 },
        { size: 2, typeSize: 4 },
    ],
};

export default class SpriteBatch<E extends Apate = Apate> extends Obj<E> {
    public material: SpriteBatchMaterial = new SpriteBatchMaterial();

    public tiles: Tile[] = [];
    public transforms: Transform[] = [];

    private clips: Float32Array;
    private matrices: Float32Array;

    private maxSize: number = 128;
    private needsUpdate: boolean = false;

    constructor(atlas?: Tile, maxSize: number = 128, parent?: Obj, name?: string) {
        super(parent, name);

        if (atlas) this.material.atlas = atlas;

        this.resize(maxSize);
    }

    public resize(size: number) {
        this.maxSize = size;
        this.clips = new Float32Array(size * 4);
        this.matrices = new Float32Array(size * 16);

        this.sync();
    }

    public batch(tile: Tile, transform: Transform) {
        if (this.material.atlas.texture != tile.texture) throw new Error("Wrong texture!");
        if (this.tiles.length == this.maxSize) throw new Error("Out of mem!");

        this.tiles.push(tile);
        this.transforms.push(transform);

        this.sync();
    }

    public clear() {
        this.tiles.length = 0;
        this.transforms.length = 0;

        this.sync();
    }

    public sync(start: number = 0, end: number = this.maxSize) {
        this.needsUpdate = true;
        if (this.tiles.length < end) end = this.tiles.length;

        for (let i = start; i < end; i++) {
            let clip = this.tiles[i].clip.vec();
            let matrix = this.transforms[i].matrix();
            let offset = i * 4;
            for (let j = 0; j < 4; j++) this.clips[offset + j] = clip[j];
            offset = i * 16;
            for (let j = 0; j < 16; j++) this.matrices[offset + j] = matrix[j];
        }
    }

    private _runtime: VertexArray;
    private _buffers: Buffer<any>[] = [];
    public draw(context: Context): void {
        if (this.tiles.length == 0) return;

        let mat = this.material.compile(context.renderer);
        if (!this._runtime) {
            let gl = context.renderer.ctx;
            this._buffers = [
                new Buffer(gl, "array", "static_draw"),
                new Buffer(gl, "array", "dynamic_draw"),
                new Buffer(gl, "array", "dynamic_draw"),
            ];
            this._buffers[0].upload(plane.data); // could be static
            this._buffers[1].upload(this.clips);
            this._buffers[2].upload(this.matrices);

            this._runtime = new VertexArray(gl);
            let layout = { size: 4, divisor: 1, typeSize: 4 };
            let attrs = mat.attributeInfo;
            console.log(attrs);

            this._runtime.setBuffer(this._buffers[0], plane.layout, attrs["aVertexPos"].location);
            this._runtime.setBuffer(this._buffers[1], [layout], attrs["aClip"].location);
            this._runtime.setBuffer(this._buffers[2], [layout, layout, layout, layout], attrs["aMatrix"].location);
            //this._runtime.setBuffers(this._buffers, [plane.layout, [layout], [layout, layout, layout, layout]]);
            this.needsUpdate = false;
        }

        if (this.needsUpdate) {
            this._buffers[1].update();
            this._buffers[2].update();
            this.needsUpdate = false;
        }
        this.material.atlas.texture.compile(context.renderer, 5);
        mat.use();
        mat.setUniforms({
            uColor: this.material.color.color(),
            uAtlasSize: this.material.atlas.texture.size,
            uAtlas: 5,

            uModel: this.absolut().matrix(),
            uView: inverse(context.camera.transform.matrix()),
            uProjection: context.camera.projection,
        });
        this._runtime.bind();
        context.renderer.drawInstanced(4, this.tiles.length, context.renderer.drawMode("triangle_strip"));
    }
}
