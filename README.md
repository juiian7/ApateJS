<span class="note warn">
This documentation is under heavy development. It approximately covers 15% of the functionality, but about 70% of the theory behind core features.
</span>

ApateJS is a small game and rendering engine for the web inspired by Heaps and Godot. It is designed and written to run with vanilla javascript with an object-like oriented approach of a scene graph.

`Important:`
This project is not released, it is in early development! Don't assume things should work ;). Feel free to contribute! Apate is designed to be a 3D engine, but mostly only tested for 2D.

Take a look at the [Docs](https://juiian7.github.io/ApateJS/) for better insights.

## Introduction

The introduction should give a basic understanding how to use Apate.
The most important part is the **scene** with the entities (represented as **Obj**)

### Scene Graph (engine.scene)

As the name says it's a graph, which is leading to a tree structure. Every node inherits the "Obj" class. A simple container class for storing other nodes within the tree. An Obj also contains a certain position and the behaviour how it gets displayed. The Obj class itself doesn't implement this draw method since it's the root of the inheritance and not designed to be used for rendering content. To actually display stuff there are multiple other Obj-inherited classes. Lets look at a simple scene graph as an example:

```
The type of the node in the tree is written inside brackets.

> Scene (Obj)
|--> Player (Obj)
|  |--> Image (Sprite)
|  |--> Body (Body)
|     |--> Collider (Collider)
|
|--> Background (Sprite)
|--> Enemy (Body)
|  |--> Collider (Collider)
|  |--> Image (Sprite)
```

### Types of Nodes - Obj inheritance

**Obj** - the root of inheritance. Stores a Transform object.

_Drawing_:

-   **Sprite** - renders a single Tile
-   **ASprite** - renders an animation (Tile[])
-   **Model** - renders 3D mesh
-   **SpriteBatch** - renders multiple Tiles of the same texture on different positions (instanced drawing)
-   **Text** - renders Text (not finished)
-   **Viewport** - renders children to a texture before rendering to screen (postprocessing)

_Physics (2D)_:

-   **Body** - used for physics
-   **Collider** - used representing the solid surface of a Body (consists of Shapes)

### Other Helper Objects

**Vec**: just a simple 4-dimensional Vector (x,y,z,w), but also designed to be used for colors (r,g,b,a -> same as x,y,...). Actually it could be used for more dimensions, but all mathematical operations only work on the first four.

**Transform**: an object that describes a transformation. Stores vectors for position, rotation and scale.

**Texture**: the thing (mostly a real image) that gets uploaded to the GPU. (not really relevant for game devs, but still important to know how things work together behind the mask)

**Tile**: an abstraction of Texture. Why? Multiple Tiles could be different parts of the same image (cutouts). **Remember:** Images are always rendered as Tiles.

_Example:_ there is one sprite atlas (a big image containing other images) with all animations of a player. This image would be loaded as a Tile. The Tile would store the data of the image (as a texture) and the area that should be visible. So we can create Tiles for every frame of every animation. All of these tiles use the same Image (texture), but different cutouts, so they all look different.

### Bringing it all together (aka the main loop)

To bring it all together and finally be able to see something on the screen there is the **Apate** class which acts as the mount point of the engine. It stores the active scene graph (scene), manages timings and handles the main loop.

The function _init()_ and _update()_ can and need to be overwritten to inject own code to the engine.

**Before Loop**:
_init()_ is only called once at the start of the engine. At this point the main loop isn't executed. It is designed to load the data needed to run the game. It should return a promise, which will be awaited before the game starts.

**Main loop**:
Once the game loop is entered it runs again for every frame. At first _update()_ is called to change the Objs in the active scene. Then the active scene will be drawn. The delta time (time since last update in ms) can be accessed within _update()_ by `this.delta`.

## Tutorial

To get a better understanding how things work together lets jump right into an example.

### Simple sprite rendering

```html
<!-- index.html -->
<!-- Load the own "entry" script -->
<script src="main.js" type="module"></script>
<!-- ...few lines... -->
<!-- Adding a canvas isn't required, the engine could do it for you -->
<canvas></canvas>
<!-- Add some images offscreen or load them in the script -->
<img src="player.png" style="display:none;"></img>
```

```ts
// main.js
import Apate, { Tile, World } from "./apate/index.js";

// get the canvas
const canvas = document.querySelector("canvas");

// Extend Apate to inject own behaviour
class Game extends Apate {
    constructor() {
        super({ screen: { canvas } }); // set the canvas
    }

    // gets called once on start
    async init() {
        // load necessary game data (images, music, ...)
        const img = document.querySelector("img");

        // create a tile to render the img
        const playerTile = Tile.fromImage(img);

        // create the Obj which is actually rendered
        // "World" imports all types of predefined Objs
        // for this example we want to render a sprite
        // we can init it like this or pass the values later
        new World.Sprite(playerTile, this.scene, "Player");
        // there is now a "Player" Obj in our scene graph
        // if you don't want to insert it directly you can do:
        // this.scene.add(<Obj to insert>)
        // at any point later
    }

    // gets called every frame
    update() {
        // for this example we don't want to update our sprite
        // the sprite should be visible
        // - if not make sure it is added to the scene graph
    }
}
new Game(); // run game
```

### Animated Sprites

The first steps are the same as in normal sprite rendering. Create your script entry point, extend Apate behaviour and load your images. As said in the introduction animated sprites are just like sprite but instead of Tiles they store each frame of the animation as separate Tile. Seems right, doesn't it?

```ts
// somewhere in main.js

async init() {
    // ... tile1: Tile, tile2: Tile, spriteSheet: Tile

    // create an animation from two sprites
    new World.ASprite({ frames: [tile1, tile2] }, 20, this.scene);

    // create an animation from a sprite sheet
    // the sheet has a size of 64x8
    // so there are 8 frames aligned in a horizontal order
    // we split these frames to separate tiles
    const frames = spriteSheet.split(8);
    new World.ASprite({ frames }, 20, this.scene);


    // we now assume that the sheet has a size of 64x16
    // in the first row there are idle and attack animations
    // the second row is a walk animation
    const [row1, row2] = spriteSheet.splitV(8);
    const idle = { frames: row1.sub(0, 0, 16, 8).split(8) };
    const attack = { frames: row1.sub(16, 0, 48, 8).split(8), repeat: "once" };
    const walk = { frames: row2.split(8) };
    // create an animated sprite and start the walk animation
    const anim = new World.ASprite(walk, 20, this.scene);

    // ... at a later point
    anim.play(idle);
}

```

### Updating stuff

```ts
// somewhere in main.js

private sprite: World.Sprite;

async init() {
    // ...
    this.sprite = new World.Sprite(player, this.scene);

    // by default a perspective projection is used
    // while it would work for 2d games it is more common to use pixel coords (orthographic projection)
    // specify the view box of the projection (could use window.width instead of 160 to have real pixels)
    this.context.camera.projection = orthographic(0, 160, 90, 0, -10, 10);
}

update() {
    // move sprite
    // include delta for same speed on every frame rate
    this.sprite.transform.position.x += this.delta * 0.01;

    // reset position when out of screen
    if (this.sprite.transform.position.x > 160) {
        this.sprite.transform.position.x = 0;
    }

    // if space key is pressed
    if (this.input.key("Space")) {
        // spin sprite
        this.sprite.transform.rotation.z += this.delta * 0.1;
    }
}
```
