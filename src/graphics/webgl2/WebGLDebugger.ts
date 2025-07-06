import * as UI from "../../ui/index.js";

import type { Texture } from "../Texture.js";
import type { Buffer } from "./Buffer.js";
import type { Shader } from "./Shader.js";
import type { VertexArray } from "./VertexArray.js";

type ElementMap<T> = { [id: number]: { data: T; element: UI.Element<HTMLElement> } };

interface ListTypeMap {
    buffers: Buffer;
    vertexArrays: VertexArray;
    shaders: Shader;
    textures: Texture;
}

class WebGLDebugger {
    buffers: ElementMap<Buffer> = {};
    vertexArrays: ElementMap<VertexArray> = {};
    shaders: ElementMap<Shader> = {};
    textures: ElementMap<Texture> = {};

    public readonly rootElement: UI.Container;
    constructor() {
        this.rootElement = UI.container().class("webgl-inspector");
    }

    watch<T extends keyof ListTypeMap>(typeList: T, obj: ListTypeMap[T]) {
        //@ts-ignore
        this[typeList][obj.id] = { data: obj, element: null };
    }

    update() {
        for (const sid in this.buffers) {
            const id = +sid;
            if (!this.buffers[id].element) this.buffers[id].element = this.createContainer("buffer", +id);
            const buffer = this.buffers[id].data.data.buffer;
            const values = new Uint8Array(buffer.slice(0, 10));
            this.buffers[id].element
                .querySelector('[data-id="buffer-data"]')
                .clear()
                .append(UI.div("Len: " + buffer.byteLength), values.join(", "));
        }

        for (const sid in this.vertexArrays) {
            const id = +sid;
            if (!this.vertexArrays[id].element) this.vertexArrays[id].element = this.createContainer("vertex_array", id);
            const cols = ["id", "offset", "len", "size", "buffer"];
            const tbody = UI.element("tbody");
            this.vertexArrays[id].element
                .querySelector('[data-id="vertex-arrays"]')
                .clear()
                .append(UI.element("table").append(UI.element("thead").append(...cols.map((c) => UI.element("td").text(c))), tbody));

            const state = this.vertexArrays[id].data.debugState;
            for (let i = 0; i < state.length; i++) {
                const attr = state[i];
                if (!attr) continue;
                const c = [i, attr.view.offset, attr.view.length, attr.layout.size, this.buffers[attr.view.buffer.id].element];
                tbody.append(UI.element("tr").append(...c.map((i) => UI.element("td").append(i))));
            }
        }
    }

    info() {
        /* gl.getParameter(gl.ARRAY_BUFFER_BINDING);
        gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING); */
        /* for (const array of this.vertexArrays) {
            console.info(`Vertex Array (${array.debug.id})`);

            for (let i = 0; i < array.debug.state.length; i++) {
                const attr = array.debug.state[i];
                if (!attr) continue;
                console.log(
                    `[${i}]: buffer(${attr.view.buffer.id}), ` +
                        `offset: ${attr.view.offset}, ` +
                        `len: ${attr.view.length}, ` +
                        `count: ${attr.view.count}`
                );
                console.log(attr.view.buffer.data);
            }
        } */
    }

    createContainer(type: "buffer" | "vertex_array" | "shader" | "texture", id: number) {
        let element: UI.Element<HTMLDivElement> = UI.container().class(type, "webgl-debug-element");
        switch (type) {
            case "buffer":
                element.append(UI.h1(`Buffer (${id})`), UI.container().attribute("data-id", "buffer-data"));
                break;
            case "vertex_array":
                element.append(UI.h1(`Vertex Array (${id})`), UI.container().attribute("data-id", "vertex-arrays"));
                break;
            case "shader":
            case "texture":
                break;
        }
        this.rootElement.append(element);
        return element;
    }
}

const webglDebugger = new WebGLDebugger();

export { webglDebugger };
