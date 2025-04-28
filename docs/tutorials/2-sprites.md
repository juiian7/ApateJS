<span class="note bug">
TODO: Finish this tutorial
</span>

Lets look right into a code example to get a understanding how to get started!

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
