import Geometry from "./Geometry.js";
import Material from "./Material.js";
import Renderer from "./webgl2/Renderer.js";

class Context {
    renderer: Renderer;

    draw(geometry: Geometry, material: Material) {
        this.renderer.use(material.compile(this.renderer));
        this.renderer.draw(geometry.compile(this.renderer));
    }
}
