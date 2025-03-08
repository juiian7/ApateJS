import { Model } from "../../scene/index.js";

export async function load(path: string) {
    let req = await fetch(path);
    loadSync(await req.json());
}

export function loadSync(tf: any): Model {
    console.log(tf);

    return null as any;
}

export var glTF = {
    load,
    loadSync,
};
