import Obj from "../Obj.js";

import Material from "../../graphics/Material.js";
import Mesh from "../../graphics/Mesh.js";
import Context from "../../graphics/Context.js";

export default class Model extends Obj {
    private material?: Material;
    public meshes: Mesh[];

    constructor(parent?: Obj) {
        super(parent);
    }

    public addMesh(mesh: Mesh): this {
        this.meshes.push(mesh);
        return this;
    }

    public draw(context: Context): void {
        for (let i = 0; i < this.meshes.length; i++) {
            context.drawMesh(null, this.meshes[i], this.material);
        }
    }
}

export function loadObj(file: string): Model {
    // load meshes

    let model = new Model();
    //model.addMesh()
    return model;
}
