import { Apate } from "../Apate.js";
import { Transform } from "../core/Transform.js";
import { Context } from "../graphics/Context.js";

/**
 * @deprecated
 */
export interface Drawable {
    render(context: Context): void;
}

/**
 *
 * This class is the root of the inheritance used for the nodes of the scene graph.
 *
 * Obj is an node only consisting of a {@link Core.Transform | Transform} for saving its position
 * and the nodes children (an array of {@link World.Obj | Objs})
 *
 * It has no direct drawing behaviour. If you are looking for drawable node types see: Sprite, Model, Text
 *
 * @memberof World
 */
class Obj<E extends Apate = Apate> implements Drawable {
    public static Layers: string[] = ["bg", "default", "foreground", "ui", "debug"];

    /**
     * The engine in wich context the Obj is executed.
     *
     * Could be undefined if the node is not in an active scene graph or the {@link Obj#on_scene_enter} event is not propagated.
     *
     * @type {Apate}
     * @public
     */
    public engine?: E;

    /**
     * The name of the Object. Suitable for debugging purposes.
     *
     * @type {string}
     * @public
     */
    public name: string = "unnamed";

    /**
     * The number of the layer it gets drawn to. Used to handle the order of drawing.
     *
     * @default 1 - meaning it gets drawn after the background (layer 0) but before ui (layer 2)
     * @public
     */
    public layer: number = Obj.Layers.indexOf("default");

    /**
     * The parent node in the scene graph.
     *
     * @type {World.Obj}
     * @public
     */
    public parent?: Obj<E> = null;

    /**
     * The children of this node.
     *
     * @type {World.Obj[]}
     */
    public children: Obj<E>[] = [];

    /**
     * The transform object of the node. It stores the transformations of a node in relation to the parent.
     *
     * @example
     * // move this node by 10 units and rotate it by 180 deg
     * this.transform.postion.x += 10;
     * this.transform.rotation.z += Math.PI;
     *
     * @type {Core.Transform}
     * @public
     */
    public transform: Transform;

    /**
     * Cache only! Used to cache the absolute transform within the scene.
     *
     * @type {Core.Transform}
     * @private
     */
    private _absolut: Transform;

    /**
     * Constructs a new Obj with an optional parent and display name.
     * When the parent is set the Obj will be automatically added as a child of the parent.
     *
     * @param {World.Obj} parent - The parent of the newly created scene graph node
     * @param {string} name - The name of the Obj (helpful for debugging)
     * @constructs
     */
    constructor(parent?: Obj, name?: string) {
        if (name) this.name = name;
        if (parent) parent.add(this);

        this.transform = new Transform();
        this._absolut = new Transform();
    }

    /**
     * Adds children to this node.
     * @param {World.Obj[]} children - The children to add
     */
    public add(...children: Obj<E>[]): void {
        this.children.push(...children);
        for (const c of children) {
            c.parent = this;
            if (this.engine) c.recCall("on_scene_enter", this.engine);
        }
    }

    public ref(): this {
        return this;
    }

    /**
     * Remove this node from the scene graph. The nodes parent will have one children less when the node was removed.
     */
    public remove() {
        if (this.parent) {
            let i = this.parent.children.indexOf(this);
            if (i >= 0) this.parent.children.splice(i, 1);
            this.parent = null;
        }
        if (this.engine) this.recCall("on_scene_exit", this.engine);
    }

    /**
     * Override to define draw behaviour. After this method was executed all children will be drawn (recursively).
     *
     * @example
     * // could be inside draw() {...}
     * // draw a tile with the current context
     * const tile = Tile.fromColor(Vec.fromHex(0xFF00FFFF)); // create magenta tile
     * const material = new Materials.SpriteMaterial(); // create a sprite material
     * // ...
     * context.drawTile(this.transform, tile, material);
     *
     * @param {Context} context - The context of the draw operations
     */
    public draw(context: Context) {}

    /**
     * Override to define behaviour after drawing. Could be used to clean up cameras, targets
     * or simply to draw own Obj after the children
     *
     * @param {Context} context - The context of the draw operations
     */
    public drawAfter(context: Context) {}

    /**
     * This method is used to propagate the draw through all children of this node.
     *
     * @param {Context} context - The context of the draw operations
     * @param {number} layer - The current layer which should be drawn
     * @protected
     */
    protected drawRec(context: Context, layer: number) {
        // render self
        if (layer == this.layer) this.draw(context);

        // render children
        let i = this.children.length;
        while (i-- > 0) this.children[i].drawRec(context, layer);

        if (layer == this.layer) this.drawAfter(context);
    }

    /**
     * @deprecated use {@link Obj#draw} instead.
     *
     * Used for engine internal drawing.
     *
     * @param {Context} context - The context of the draw instructions
     */
    public render(context: Context) {
        for (let i = 0; i < Obj.Layers.length; i++) {
            this.drawRec(context, i);
        }
    }

    /**
     * Calculates the absolute position of this node within the scene
     *
     * @returns {Core.Transform} the transformations object
     */
    public absolut(): Transform {
        if (!this.parent) {
            this._absolut.setTo(this.transform.position, this.transform.rotation, this.transform.scale);
            return this._absolut;
        }

        this.parent._absolut = this.parent.absolut();
        this._absolut.setTo(this.parent._absolut.position, this.parent._absolut.rotation, this.parent._absolut.scale);
        this._absolut.add(this.transform.position, this.transform.rotation, this.transform.scale);

        return this._absolut;
    }

    /**
     * Gets the root node of the graph
     *
     * @returns {World.Obj} the obj wich acts as root node
     */
    public root(): Obj<E> {
        return this.parent ? this.parent.root() : this;
    }

    /**
     * Recursively calls a function of this Obj given by a name and arguments.
     * Used for traversing the graph, and propagating events.
     *
     * @param {string} name - The name of the function
     * @param {any[]} params - The parameters of the function
     */
    public recCall(name: keyof Obj, ...params: any[]) {
        //@ts-ignore
        this[name](...params);
        let i = this.children.length;
        while (i-- > 0) this.children[i].recCall(name, ...params);
    }

    /**
     * An event wich gets called when this node enters the scene graph.
     * When injecting own code, make sure to call `super.on_scene_enter(engine)`
     * to ensure the {@link World.Obj#engine} is set.
     * @param {Apate} engine - The engine of the active scene graph
     */
    on_scene_enter(engine: E) {
        this.engine = engine;
    }

    /**
     * An event wich gets called when this node is removed from the scene graph.
     * When injecting own code, make sure to call `super.on_scene_exit(engine)`
     * to ensure the {@link World.Obj#engine} property is set to undefined.
     * @param {Apate} engine - The engine where the scene graph was active
     */
    on_scene_exit(engine: E) {
        this.engine = undefined;
    }
}
export { Obj };
