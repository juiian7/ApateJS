import Apate from "../Apate.js";
import Renderer from "./webgl2/Renderer.js";

import Tile from "../core/Tile.js";
import Material, { Default3DMaterial, SpriteMaterial } from "./Material.js";

import { Scene, Sprite } from "../scene/index.js";
import Mesh from "./Mesh.js";
import Vec from "../core/Vec.js";
import Texture from "./Texture.js";
import default3d from "./webgl2/shader/default3d.js";
import Transform from "../core/Transform.js";
import { inverse, Matrix } from "../core/Matrix.js";

export interface ICamera {
    transform: Transform;
    projection: Matrix;
}

/* import Geometry from "./Mesh.js";
import Material from "./Material.js";
 */
export default class Context {
    public cameras: ICamera[] = [];

    public get camera(): ICamera {
        return this.cameras[this.cameras.length - 1];
    }

    public engine: Apate;
    public renderer: Renderer;

    private plane: Mesh;
    private white: Texture;
    private defaultMeshMat: Default3DMaterial;

    constructor(engine: Apate) {
        this.engine = engine;
        this.renderer = engine.renderer;

        this.plane = Mesh.plane2D();
        this.white = Texture.fromColor(Vec.from(0xffffffff));
        this.defaultMeshMat = new Default3DMaterial();
        this.defaultMeshMat.texture = new Tile(this.white);
    }

    pushCamera(camera: ICamera) {
        this.cameras.push(camera);
    }

    popCamera(): ICamera {
        return this.cameras.pop();
    }

    drawScene(scene: Scene) {
        scene.render(this);
    }

    drawTile(transform: Transform, tile: Tile, material: Material) {
        let slot = 0;
        let texture = tile.texture.compile(this.renderer, 0);
        let shader = material.compile(this.renderer);
        shader.use();

        shader.setUniforms({
            uColor: material.color.color(),
            uAtlas: slot,
            uAtlasSize: tile.texture.size,
            uClip: tile.clip.vec(),

            uModel: transform.matrix(),
            uView: inverse(this.camera.transform.matrix()),
            uProjection: this.camera.projection,
        });

        let arrays = this.plane.compile(this.renderer);
        this.renderer.draw(arrays.count);
    }

    drawMesh(transform: Transform, mesh: Mesh, material?: Default3DMaterial) {
        let mat = mesh.material || material || this.defaultMeshMat;

        (mat.texture.texture || this.white).compile(this.renderer, 1); // set texture

        let shader = mat.compile(this.renderer);
        shader.use();
        shader.setUniforms({
            uColor: mat.color.color(),
            uTexture: 1,

            uModel: transform.matrix(),
            uView: inverse(this.camera.transform.matrix()),
            uProjection: this.camera.projection,
        });

        // do before compile to set attribute location
        // mesh.arrays.find((a) => a.type == "position").attributeLocation = shader.attributeInfo["aVertPos"].location;

        let arrays = mesh.compile(this.renderer);
        this.renderer.draw(arrays.count, this.renderer.drawMode(mesh.drawMode)); // draw arrays
    }
}
