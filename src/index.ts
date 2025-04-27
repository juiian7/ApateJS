import { Apate } from "./Apate.js";

/**
 * The core functionality of Apate. It is not exported from the index as "Core". See below how to use members.
 * @example
 * import { Vec, Tile, ... } from "<path to engine>/index.js";
 * // create a vec for storing a color and a tile with this color
 * const color = Vec.fromHex(0xff0000ff);
 * const tile = Tile.fromColor(color);
 *
 * @namespace Core
 */
import { Input } from "./core/Input.js";
import { Vec } from "./core/Vec.js";
import * as Mat from "./core/Matrix.js";
import { Tile } from "./core/Tile.js";
import { Transform } from "./core/Transform.js";
import { Physics } from "./core/Physics.js";

/**
 * <p>This namespace is used to group together all scene graph node types.</p>
 *
 * <h3>Overview</h3>
 *
 * <p>{@link World.Obj | Obj} - The base of every node.</p>
 *
 * <p>
 * <b>Basic drawing:</b>
 * <ul>
 *  <li>{@link World.Sprite | Sprite} - For drawing a single image</li>
 *  <li>{@link World.ASprite | ASprite} - For drawing animated sprites (multiple images)</li>
 *  <li>{@link World.Text | Text} - For drawing bitmap rendered text</li>
 *  <li>{@link World.Model | Model} - For drawing more complex mesh then a plane ;)</li>
 *  <li>{@link World.Camera | Camera} - Not directly for drawing, but viewing from a different angle</li>
 * </ul>
 * </p>
 *
 * <p>
 * <b>Advanced drawing:</b>
 * <ul>
 *  <li>{@link World.SpriteBatch | SpriteBatch} - For drawing multiple {@link Tile | Tiles}
 *        with the same {@link Texture} but different {@link Transform | Transforms}.
 *        Useful for rendering tilemaps or sprite particles.
 *  </li>
 *  <li>{@link World.Viewport | Viewport} -
 *       Draws all children to a {@link Texture} ({@link RenderTarget}) with can than be used for drawing.
 *       Important for split screen rendering, post processing, drawing reflections, and tons of other things.
 *  </li>
 * </ul>
 * </p>
 *
 * <p>
 * <b>Physics 2D: </b> (only 2D physics is supported by now)
 * <ul>
 *  <li>{@link World.Body | Body} - Specifies physical properties. Handles movement and velocity</li>
 *  <li>{@link World.Collider | Collider} - For representing the solid surface of a {@link World.Body | Body}
 *   (consists of {@link World.Shapes | Shapes})</li>
 *  <li>{@link World.Shape | Shape} - Not a node type! Specifies the bounds of objects</li>
 * </ul>
 * </p>
 *
 *
 * @namespace World
 */
import * as World from "./scene/index.js";
import { Anim } from "./scene/drawing/ASprite.js";

// graphics
import * as Materials from "./graphics/Material.js";
import { Mesh } from "./graphics/Mesh.js";
import { Texture } from "./graphics/Texture.js";
import { Context } from "./graphics/Context.js";

// webgl
import { Renderer, RenderTarget } from "./graphics/webgl2/Renderer.js";

// html UI
import * as UI from "./ui/index.js";

export default Apate;
export { Anim, Mat, Tile, Transform, Vec, World };
export { Context, Input, Materials, Mesh, Physics, Renderer, RenderTarget, Texture, UI };
