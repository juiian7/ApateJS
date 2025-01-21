import Apate from "../Apate.js";
import Renderer from "./webgl2/Renderer.js";

import Tile from "../core/Tile.js";
import Material, { SpriteMaterial } from "./Material.js";

import { Scene, Sprite } from "../scene/index.js";
import Mesh from "./Mesh.js";
import Vec from "../core/Vec.js";
import Texture from "./Texture.js";
import default3d from "./webgl2/shader/default3d.js";

/* import Geometry from "./Mesh.js";
import Material from "./Material.js";
 */
export default class Context {
    public cameras: {}[] = [];

    engine: Apate;
    renderer: Renderer;

    private white: Texture;
    private defaultMeshMat: Material;

    constructor(engine: Apate) {
        this.engine = engine;
        this.renderer = engine.renderer;

        this.white = Texture.fromColor(Vec.from(0xffffffff));
        this.defaultMeshMat = new Material(default3d);
    }

    pushCamera() {}

    popCamera() {}

    drawScene(scene: Scene) {
        scene.render(this);
    }

    drawTile(transform: null, tile: Tile, material: Material) {
        let slot = 0;
        let texture = tile.texture.compile(this.renderer, 0);
        let shader = material.compile(this.renderer);
        shader.use();

        shader.setUniforms({
            uColor: material.color.color(),
            uTile: slot,
        });

        let arrays = Mesh.plane2D().compile(this.renderer);
        this.renderer.draw(arrays.count);
    }

    drawMesh(transform: null, mesh: Mesh, material?: Material) {
        let mat = mesh.material || material || this.defaultMeshMat;

        (false || this.white).compile(this.renderer, 1); // set texture

        let shader = mat.compile(this.renderer);
        shader.use();
        shader.setUniforms({
            uColor: mat.color.color(),
            uTexture: 1,
        });

        // do before compile to set attribute location
        // mesh.arrays.find((a) => a.type == "position").attributeLocation = shader.attributeInfo["aVertPos"].location;

        let arrays = mesh.compile(this.renderer);
        this.renderer.draw(arrays.count); // draw arrays
    }
}
