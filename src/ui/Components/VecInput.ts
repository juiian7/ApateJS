import { Vec4 } from "../../core/Vec4.js";
import NumberInput from "./NumberInput.js";

import { Container, container, text } from "../WebUI/src/index.js";

export default class VecInput extends Container {
    private ref: Vec4;
    private inputs: NumberInput[] = [];

    constructor(ref: Vec4, name: string = "", size?: number) {
        super();

        this.ref = ref;
        size = size || ref.dimension;

        for (let i = 0; i < size; i++) {
            let input = new NumberInput().style("width", "8ch");
            input.on("input", () => {
                ref.vec()[i] = input.num;
            });
            this.inputs.push(input);
        }

        this.append(text(name), container(...this.inputs).style("display", "flex"));
        this.update();
    }

    public update() {
        let vec = this.ref.vec();
        for (let i = 0; i < this.inputs.length; i++) {
            if (!this.inputs[i].isFocused) {
                this.inputs[i].value = vec[i].toLocaleString();
            }
        }
    }
}
