import Obj from "../Obj.js";

import Material, { Default3DMaterial } from "../../graphics/Material.js";
import Mesh from "../../graphics/Mesh.js";
import Context from "../../graphics/Context.js";
import Vec from "../../core/Vec.js";
import Apate from "../../Apate.js";

type MatLib = { [name: string]: Default3DMaterial };

export default class Model<E extends Apate = Apate> extends Obj<E> {
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
            context.drawMesh(this.absolut(), this.meshes[i], this.material);
        }
    }

    public static async loadObj(path: string): Promise<Model> {
        let contents = await (await fetch(path)).text();
        let matLib: MatLib = {};
        if (contents.includes("mtllib")) {
            let libs: Promise<MatLib>[] = [];
            for (const match of contents.matchAll(/^mtllib (.*)$/gm)) {
                let i = path.lastIndexOf("/");
                libs.push(this.loadMaterials(path.slice(0, i + 1) + match[1]));
            }
            let matLibs = await Promise.all(libs);
            for (const lib of matLibs) {
                for (const name in lib) {
                    matLib[name] = lib[name];
                }
            }
        }
        return this.loadObjSync(contents, matLib);
    }

    public static loadObjSync(content: string, matLib: MatLib = {}): Model {
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
                }
                mesh.arrays.push({ type: "position", data: position, vertexSize: store["v"][0].length });
                if (texture.length > 0) mesh.arrays.push({ type: "texture", data: texture, vertexSize: store["vt"][0].length });
                if (normal.length > 0) mesh.arrays.push({ type: "normal", data: normal, vertexSize: store["vn"][0].length });

                mesh.material = store.mtl;
                model.addMesh(mesh);
                store.f = [];
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
            } else if (c == "usemtl") store.mtl = matLib[params[0]];
            else if (store[c]) store[c].push(params);
        }
        submit();

        return model;
    }

    public static async loadMaterials(path: string): Promise<MatLib> {
        return this.loadMaterialsSync(await (await fetch(path)).text());
    }
    public static loadMaterialsSync(content: string): MatLib {
        const lines = content.split("\n");
        const lib: MatLib = {};

        let name: string, diffuse: Vec, ambient: Vec;
        for (const line of lines) {
            let [c, ...params] = line.split(" ");
            if (c == "newmtl") {
                lib[name] = new Default3DMaterial(diffuse);
                name = params[0];
            }
            if (c == "Kd") diffuse = Vec.from(+params[0], +params[1], +params[2], 1);
            if (c == "Ka") ambient = Vec.from(+params[0], +params[1], +params[2], 1);
        }
        return lib;
    }
}
