import { Tile } from "../core/Tile.js";
import { Transform } from "../core/Transform.js";
import { Obj } from "./Obj.js";
import * as InternalNodes from "./index.js";
import { Vec4 } from "../core/Vec4.js";

type FieldSerializer<T> = (field: T) => any;
type FieldDeserializer<T> = (data: any) => T;
type FieldFunctions<T> = { serialize: FieldSerializer<T>; deserialize: FieldDeserializer<T> };
type FieldFactory = { [type: string]: FieldFunctions<any> };

type ObjConstructor<T extends Obj = Obj> = { new (...params: any): T };

class Persistence {
    public static Nodes: { [type: string]: ObjConstructor } = {};

    private static fieldFuncs: FieldFactory = {
        nodes: { serialize: (a) => a, deserialize: (a) => a },
        transform: {
            serialize(field: Transform) {
                const s = {};
                if (!field.position.isZero()) s["position"] = field.position.vec();
                //if (!field.rotation.getAngles().isZero()) s["position"] = field.position.vec();
                if (!field.size.allOne()) s["size"] = field.size.vec();
                return s;
            },
            deserialize(field: any) {
                const t = new Transform();
                if (field.position) t.move(...field.position);
                if (field.rotation) t.rotate(...field.rotation);
                if (field.size) t.scale(...field.size);
                return t;
            },
        },
        tile: {
            serialize(field: Tile) {
                const s: any = {};
                // set clip
                if (field.clip.z != field.texture.width || field.clip.w != field.texture.height) {
                    s.clip = field.clip.vec();
                }
                s["source"] = field.texture.origin.source;
                s["res"] = field.texture.origin.res;
                return s;
            },
            deserialize(field: any) {
                let tile: Tile;
                if (field.source == "dom") {
                    tile = Tile.fromImage(document.querySelector(field.res) as HTMLImageElement);
                } else if (field.source == "url") {
                    const img = new Image();
                    img.src = field.res;
                    tile = Tile.fromImage(img);
                }
                if (field.clip) {
                    field.clip.length = 4;
                    tile.clip = new Vec4(field.clip.map((n) => +n || 0));
                }
                return tile;
            },
        },
    };

    public static serialize(obj: Obj): any {
        const fields = obj.onSerialize() as any;
        const serialized: any = { _type: obj.constructor.name };
        for (const id in fields) {
            if (Persistence.fieldFuncs[id]) {
                if (fields[id].length) serialized[id] = fields[id].map((f) => Persistence.fieldFuncs[id].serialize(f));
                else serialized[id] = Persistence.fieldFuncs[id].serialize(fields[id]);
                continue;
            }
            switch (typeof fields[id]) {
                case "object":
                    try {
                        // just try if it would work
                        JSON.stringify(fields[id]);
                    } catch (error) {
                        console.error(`Error: Can't serialize field '${id}' in ${serialized._type}`, error);
                    }
                case "string":
                case "number":
                case "boolean":
                    serialized[id] = fields[id];
                    break;
                case "symbol": // can't serialize (yet?)
                case "undefined":
                case "bigint":
                case "function":
                    break;
            }
        }

        serialized.children = obj.children.map(Persistence.serialize);
        return serialized;
    }

    public static deserialize(data: any): Obj {
        const deserialized = new (Persistence.Nodes[data._type] || InternalNodes[data._type])() as Obj;
        const fields: any = {};
        for (const id in data) {
            if (Persistence.fieldFuncs[id]) {
                if (data[id].length) fields[id] = data[id].map((f) => Persistence.fieldFuncs[id].deserialize(f));
                else fields[id] = Persistence.fieldFuncs[id].deserialize(data[id]);
                continue;
            }
            fields[id] = data[id];
        }
        const children = data.children.map(Persistence.deserialize);
        deserialized.add(...children);

        deserialized.onDeserialize(fields, children);

        return deserialized;
    }

    public static addType(type: ObjConstructor) {
        this.Nodes[type.name] = type;
    }
}

export { Persistence };
