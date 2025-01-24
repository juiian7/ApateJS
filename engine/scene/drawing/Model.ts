import Obj from "../Obj.js";

import { Default3DMaterial } from "../../graphics/Material.js";
import Mesh from "../../graphics/Mesh.js";
import Context from "../../graphics/Context.js";

export default class Model extends Obj {
    public material?: Default3DMaterial;
    public meshes: Mesh[] = [];

    constructor(parent?: Obj) {
        super(parent);
    }

    public addMesh(mesh: Mesh): this {
        this.meshes.push(mesh);
        return this;
    }

    public draw(context: Context): void {
        for (let i = 0; i < this.meshes.length; i++) {
            context.drawMesh(this.absolutTransform(), this.meshes[i], this.material);
        }
    }

    public static async loadObj(path: string): Promise<Model> {
        let contents = await (await fetch(path)).text();
        return this.loadObjSync(contents);
    }

    public static loadObjSync(content: string): Model {
        // load meshes

        let model = new Model();
        let mesh = new Mesh();
        let store: any = { v: [], vn: [], vt: [], f: [] };

        let submit = () => {
            if (store["f"].length > 0) {
                // save
                let position: number[] = [];
                let texture: number[] = [];
                let normal: number[] = [];
                for (const face of store["f"]) {
                    let [v1, v2, v3, ...vn] = face.map((v) => v.split("/"));
                    position.push(...store["v"][v1[0] - 1], ...store["v"][v2[0] - 1], ...store["v"][v3[0] - 1]);
                    if (v2) texture.push(...store["vt"][v1[1] - 1], ...store["vt"][v2[1] - 1], ...store["vt"][v3[1] - 1]);
                    if (v3) normal.push(...store["vn"][v1[2] - 1], ...store["vn"][v2[2] - 1], ...store["vn"][v3[2] - 1]);
                    if (vn.length > 0) {
                        /* for (let i = 2; i < vn.length - 1; i++) {
                            position.push(...store["v"][v1[0] - 1], ...store["v"][vn[i][0] - 1], ...store["v"][vn[i + 1][0] - 1]);
                            texture.push(...store["v"][v1[1] - 1], ...store["v"][vn[i][1] - 1], ...store["v"][vn[i + 1][1] - 1]);
                            normal.push(...store["v"][v1[2] - 1], ...store["v"][vn[i][2] - 1], ...store["v"][vn[i + 1][2] - 1]);
                        } */
                        /* position.push(...store["v"][v1[0] - 1], ...store["v"][v4[0] - 1]);
                        texture.push(...store["vt"][v1[1] - 1], ...store["vt"][v4[1] - 1]);
                        normal.push(...store["vn"][v1[2] - 1], ...store["vn"][v4[2] - 1]); */
                    }
                }
                mesh.arrays.push({ type: "position", data: position, vertexSize: store["v"][0].length });
                if (texture.length > 0) mesh.arrays.push({ type: "texture", data: texture, vertexSize: store["vt"][0].length });
                if (normal.length > 0) mesh.arrays.push({ type: "normal", data: normal, vertexSize: store["vn"][0].length });

                model.addMesh(mesh);
            }
        };

        let lines = content.split("\n");
        for (const l of lines) {
            let [c, ...params] = l.split(" ");
            if (c == "o") {
                submit();
                mesh = new Mesh();
                mesh.name = params[0];
                mesh.drawMode = "triangles";
                store = { v: [], vn: [], vt: [], f: [] };
            } else if (store[c]) store[c].push(params);
        }
        submit();

        return model;
    }
}
