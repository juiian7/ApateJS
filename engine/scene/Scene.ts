import Obj from "./Obj.js";

import Renderer from "../graphics/webgl2/Renderer.js";
import Context from "../graphics/Context.js";

// like a Godot "viewport" -> render children to this render target
export default class Scene extends Obj {
    // public camera: Camera;

    public render(context: Context): void {
        // push target
        this.renderAll(context);
        // pop target
    }
}
