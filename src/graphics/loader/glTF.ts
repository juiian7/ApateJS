import { Model } from "../../scene/index.js";
import { BufferUsage, Buffer, BufferView } from "../webgl2/Buffer.js";
import { Mesh } from "../Mesh.js";
import { Default3DMaterial, PBR3DMaterial } from "../Material.js";
import { Color } from "../../core/Color.js";
import { Texture } from "../Texture.js";

interface Accessor {
    bufferView: {
        byteLength: number;
        byteOffset: number;
        buffer: Buffer;
    };
    componentType: number;
    count: number;
    type: "VEC3" | "SCALAR";
}

interface MatDesc {
    doubleSided: boolean;
    name: string;
    pbrMetallicRoughness?: {
        baseColorFactor?: number[];
        baseColorTexture?: { index: number };
        metallicFactor: number;
        roughnessFactor: number;
        metallicRoughnessTexture?: { index: number };
    };
    normalTexture?: { index: number };
    emissiveFactor?: number[];
    emissiveTexture?: { index: number };
    occlusionTexture?: { index: number };
}

export async function loadBin(path: string): Promise<Model[]> {
    const req = await fetch(path);
    const bin = await req.arrayBuffer();

    const [magic, version, length] = new Uint32Array(bin.slice(0, 3 * 4));
    if (magic != 0x46546c67) throw new Error("File is not a gl bin file!");

    let ptr = 3 * 4;
    let json = {};
    let buffers = [];
    while (ptr < length) {
        const [len, type] = new Uint32Array(bin.slice(ptr, ptr + 2 * 4));
        ptr += 2 * 4;

        if (type == 0x4e4f534a) {
            const str = new TextDecoder().decode(bin.slice(ptr, ptr + len));
            json = JSON.parse(str);
        } else if (type == 0x004e4942) {
            buffers.push(bin.slice(ptr, ptr + len));
        }
        ptr += len;
    }

    return loadSync(json, buffers);
}

export async function load(path: string): Promise<Model[]> {
    const req = await fetch(path);
    const content = await req.json();
    const buffers = await Promise.all((content.buffers || []).map((b) => fetch(b.uri).then((r) => r.arrayBuffer())));

    return loadSync(content, buffers);
}

const attrNameMap = {
    POSITION: "position",
    NORMAL: "normal",
    TEXCOORD_0: "texture",
};

const sizeMap = {
    VEC4: 4,
    VEC3: 3,
    VEC2: 2,
    SCALAR: 1,
};

export function loadSync(tf: any, buffers: ArrayBuffer[]): Model[] {
    function loadImage(textureNdx: number) {
        const { sampler, source } = tf.textures[textureNdx];
        let { uri, bufferView, mimeType } = tf.images[source];

        if (bufferView !== undefined) {
            const { buffer, byteOffset, byteLength } = tf.bufferViews[bufferView];
            const arr = buffers[buffer].slice(byteOffset, byteOffset + byteLength);
            const file = new Blob([arr], { type: mimeType });
            uri = URL.createObjectURL(file);
        }
        const img = new Image();
        img.src = uri;

        document.body.appendChild(img);
        return img;
    }

    const accessors: Accessor[] = tf.accessors.map((a) => {
        let { buffer: buf, byteLength, byteOffset, target } = tf.bufferViews[a.bufferView];
        const byteEnd = byteOffset + byteLength;
        if (!target) target = a.type == "SCALAR" ? "element" : "array";
        const buffer = new Buffer(target, "static_draw", new Uint8Array(buffers[buf].slice(byteOffset, byteEnd)));
        return { ...a, bufferView: { ...tf.bufferViews[a.bufferView], buffer } };
    });
    const materials: MatDesc[] = tf.materials;

    const models: Model[] = [];

    console.log(tf);

    for (const node of tf.nodes) {
        // create a model
        if (node.mesh === undefined) {
            //if (node.camera) {}
            continue;
        }
        const mesh = tf.meshes[node.mesh];

        const model = new Model();
        model.name = mesh.name;

        const { translation, scale, rotation, matrix } = node;
        if (translation) model.transform.move(translation[0], translation[1], translation[2]);
        if (rotation) model.transform.rotate(rotation[0], rotation[1], rotation[2]);
        if (scale) model.transform.scale(scale[0], scale[1], scale[2]);
        //if (matrix) model.transform.setMatrix(matrix);

        // create a mesh
        for (let p = 0; p < mesh.primitives.length; p++) {
            const _mesh = new Mesh();
            _mesh.drawMode = mesh.mode || "triangles"; //"line_strip";
            _mesh.name = `${node.name}-primitive-${p}`;

            const { material, indices, attributes } = mesh.primitives[p];

            // a single attribute buffer
            for (const attrName in attributes) {
                const accessor = accessors[attributes[attrName]];

                if (!attrNameMap[attrName]) {
                    console.warn(`Unknown array type "${attrName}", skipping!`);
                    continue;
                }

                _mesh.arrays.push({
                    type: attrNameMap[attrName],
                    data: accessor.bufferView.buffer.view(0, 0, accessor.componentType, accessor.count),
                    vertexSize: sizeMap[accessor.type] || 1,
                });
            }

            // indexed geometry
            if (indices !== undefined) {
                const v = accessors[indices].bufferView;
                _mesh.indices = v.buffer.view(0, 0, accessors[indices].componentType, accessors[indices].count);
            }

            if (material !== undefined) {
                _mesh.material = new PBR3DMaterial();
                if (materials[material].pbrMetallicRoughness?.baseColorFactor) {
                    const [r, g, b, a] = materials[material].pbrMetallicRoughness.baseColorFactor;
                    _mesh.material.base = Color.fromRGBA(r, g, b, a);
                }

                // base color texture
                if (materials[material].pbrMetallicRoughness?.baseColorTexture) {
                    const img = loadImage(materials[material].pbrMetallicRoughness.baseColorTexture.index);
                    img.onload = () => ((_mesh.material as PBR3DMaterial).baseTexture = Texture.fromSource(img));
                }

                // roughness texture
                if (materials[material].pbrMetallicRoughness?.metallicRoughnessTexture) {
                    const img = loadImage(materials[material].pbrMetallicRoughness.metallicRoughnessTexture.index);
                    img.onload = () => ((_mesh.material as PBR3DMaterial).metallicRoughnessTexture = Texture.fromSource(img));
                }

                // normal texture
                if (materials[material].normalTexture) {
                    const img = loadImage(materials[material].normalTexture.index);
                    img.onload = () => ((_mesh.material as PBR3DMaterial).normalTexture = Texture.fromSource(img));
                }

                // emissive texture
                if (materials[material].emissiveTexture) {
                    const img = loadImage(materials[material].emissiveTexture.index);
                    img.onload = () => ((_mesh.material as PBR3DMaterial).emissiveTexture = Texture.fromSource(img));
                }

                // emissive texture
                if (materials[material].emissiveFactor) {
                    const [r, g, b, a] = materials[material].emissiveFactor;
                    (_mesh.material as PBR3DMaterial).emissiveFactor = Color.fromRGBA(r, g, b, a || 1);
                }
            }

            model.addMesh(_mesh);
        }

        models.push(model);
    }

    //console.log(models[0]);

    return models;
}

/* export var glTF = {
    load,
    loadSync,
};
 */
