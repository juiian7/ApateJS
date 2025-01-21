import Apate from "../Apate.js";
import Renderer from "./webgl2/Renderer.js";

import Tile from "../core/Tile.js";
import Material, { SpriteMaterial } from "./Material.js";

import { Scene, Sprite } from "../scene/index.js";
import Mesh from "./Mesh.js";

/* import Geometry from "./Mesh.js";
import Material from "./Material.js";
 */
export default class Context {
    public cameras: {}[] = [];

    engine: Apate;
    renderer: Renderer;

    constructor(engine: Apate) {
        this.engine = engine;
        this.renderer = engine.renderer;
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
        arrays.bind();

        this.renderer.draw(arrays.count);
    }

    drawMesh(transform: null, mesh: Mesh, material?: Material) {
        let mat = mesh.material || material || new Material();

        /* this.renderer.use(material.compile(this.renderer));
        this.renderer.draw(geometry.compile(this.renderer)); */
    }
}
