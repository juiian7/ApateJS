import Obj from "../Obj.js";

import Context, { ICamera } from "../../graphics/Context.js";

import Transform from "../../core/Transform.js";
import { orthographic } from "../../core/Matrix.js";

export default class Viewport extends Obj {
    public camera: ICamera = {
        transform: new Transform(),
        projection: orthographic(-10, 10, 10, -10, -10, 10),
    };

    public render(context: Context): void {
        context.pushCamera(this.camera);

        // push target
        this.drawRec(context);
        // pop target

        context.popCamera();
    }
}
