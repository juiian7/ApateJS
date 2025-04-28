<span class="note bug">
TODO: Finish this tutorial
</span>

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
