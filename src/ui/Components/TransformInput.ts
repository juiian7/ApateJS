import { Transform } from "../../core/Transform.js";
import VecInput from "./VecInput.js";

import { Container } from "../WebUI/src/index.js";

export default class TransformInput extends Container {
    private inputs: VecInput[] = [];

    constructor(ref: Transform, size: number = 3) {
        super();

        this.inputs = [
            new VecInput(ref.position, "position", size),
            new VecInput(ref.rotation.c, "rotation", size),
            new VecInput(ref.size, "scale", size),
        ];

        this.append(...this.inputs);
        this.update();
    }

    public update() {
        for (let i = 0; i < this.inputs.length; i++) this.inputs[i].update();
    }
}
