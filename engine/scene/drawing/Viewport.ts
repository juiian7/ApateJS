import Apate from "../../Apate.js";

import Obj from "../Obj.js";
import Camera from "./Camera.js";

import Context from "../../graphics/Context.js";
import Renderer, { RenderTarget } from "../../graphics/webgl2/Renderer.js";
import Texture from "../../graphics/Texture.js";
import Tile from "../../core/Tile.js";
import Sprite from "./Sprite.js";
import Vec from "../../core/Vec.js";
import Transform from "../../core/Transform.js";
import Material, { SpriteMaterial } from "../../graphics/Material.js";

export default class Viewport extends Obj {
    public camera: Camera;

    public material: Material = new SpriteMaterial();

    public texture: Texture;
    private tile: Tile;

    private target: RenderTarget;

    public autoDraw: boolean = true;

    constructor(width: number, height: number, parent?: Obj, name?: string) {
        super(parent, name);

        this.texture = new Texture(width, height, "rgba", "rgba");
        this.tile = new Tile(this.texture);

        this.camera = new Camera(width, height, null, null, "Viewport Camera");

        this.transform.scale.x = this.texture.width;
        this.transform.scale.y = this.texture.height;
    }

    protected drawRec(context: Context, layer: number): void {
        if (layer == this.layer) {
            this.draw(context);
            this.drawAfter(context);
        }
    }

    public draw(context: Context): void {
        if (!this.camera) throw new Error("No camera set for viewport!");

        if (!this.target) this.target = context.renderer.createTarget(this.texture);

        if (this.texture.width != this.camera.width || this.texture.height != this.camera.height)
            this.texture.resize(this.camera.width, this.camera.height);

        context.pushCamera(this.camera);
        context.renderer.pushTarget(this.target);

        context.clear();

        let i = this.children.length; // @ts-ignore
        while (i-- > 0) for (let l = 0; l < Viewport.Layers.length; l++) this.children[i].drawRec(context, l);

        context.renderer.popTarget();
        context.popCamera();

        if (this.autoDraw) context.drawTile(this.transform, this.tile, this.material);
    }

    private nullTransformation: Transform = new Transform();
    public absolutTransform(): Transform {
        return this.nullTransformation;
    }
}
