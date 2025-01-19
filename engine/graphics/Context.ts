import Apate from "../Apate.js";
import Renderer from "./webgl2/Renderer.js";

import Tile from "../core/Tile.js";
import Scene from "../scene/Scene.js";

/* import Geometry from "./Mesh.js";
import Material from "./Material.js";
 */
export default class Context {
    engine: Apate;
    renderer: Renderer;

    constructor(engine: Apate) {
        this.engine = engine;
        this.renderer = engine.renderer;
    }

    drawScene(scene: Scene) {
        scene.render(this);
    }

    drawTile(tile: Tile) {}

    /* draw(mesh: Mesh) {
        this.renderer.use(material.compile(this.renderer));
        this.renderer.draw(geometry.compile(this.renderer));
    } */
}
