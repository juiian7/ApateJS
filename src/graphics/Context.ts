import Apate from "../Apate.js";
import Renderer from "./webgl2/Renderer.js";

import Tile from "../core/Tile.js";
import Material, { Default3DMaterial, SpriteMaterial } from "./Material.js";

import Mesh from "./Mesh.js";
import Vec from "../core/Vec.js";
import Texture from "./Texture.js";
import default3d from "./webgl2/shader/default3d.js";
import Transform from "../core/Transform.js";
import { inverse, Matrix } from "../core/Matrix.js";
import { Viewport } from "../scene/index.js";

export interface ICamera {
    transform: Transform;
    projection: Matrix;
    bgColor: Vec;
    width: number;
    height: number;
}

export default class Context {
    public cameras: ICamera[] = [];
    public layers: number[] = [];

    public get camera(): ICamera {
        if (this.cameras.length == 0) throw new Error("No Camera defined!");
        return this.cameras[this.cameras.length - 1];
    }

    public engine: Apate;
    public renderer: Renderer;

    private planeAlignCenter: Mesh;
    private planeAlignCorner: Mesh;
    private white: Texture;
    private defaultMeshMat: Default3DMaterial;

    constructor(engine: Apate) {
        this.engine = engine;
        this.renderer = engine.renderer;

        this.planeAlignCenter = Mesh.plane2D("center");
        this.planeAlignCorner = Mesh.plane2D("corner");
        this.white = Texture.fromColor(Vec.fromHex(0xffffffff));
        this.defaultMeshMat = new Default3DMaterial();
    }

    pushCamera(camera: ICamera) {
        this.cameras.push(camera);
    }

    popCamera(): ICamera {
        return this.cameras.pop();
    }

    drawTile(transform: Transform, tile: Tile, material: SpriteMaterial, align: "center" | "corner" = "corner") {
        let slot = 0;
        let texture = tile.texture.compile(this.renderer, 0);
        let shader = material.compile(this.renderer);
        shader.use();

        shader.setUniforms({
            ...material.data(),
            uAtlas: slot,
            uAtlasSize: tile.texture.size,
            uClip: tile.clip.vec(),

            uModel: transform.matrix(),
            uView: inverse(this.camera.transform.matrix()),
            uProjection: this.camera.projection,
        });

        let arrays = (align == "center" ? this.planeAlignCenter : this.planeAlignCorner).compile(this.renderer);
        this.renderer.draw(arrays.count);
    }

    drawMesh(transform: Transform, mesh: Mesh, material?: Default3DMaterial) {
        let mat = mesh.material || material || this.defaultMeshMat;

        //(mat.texture.texture || this.white).compile(this.renderer, 1); // set texture

        let shader = mat.compile(this.renderer);
        shader.use();
        shader.setUniforms({
            ...material.data(),
            uAmbient: mat.ambient.color(),
            uDiffuse: mat.diffuse.color(),
            //uTexture: 1,

            uModel: transform.matrix(),
            uView: inverse(this.camera.transform.matrix()),
            uProjection: this.camera.projection,
        });

        // do before compile to set attribute location
        // mesh.arrays.find((a) => a.type == "position").attributeLocation = shader.attributeInfo["aVertPos"].location;

        let arrays = mesh.compile(this.renderer);
        this.renderer.draw(arrays.count, this.renderer.drawMode(mesh.drawMode)); // draw arrays
    }

    clear() {
        this.renderer.clearColor = this.camera.bgColor;
        this.renderer.clear();
    }
}
