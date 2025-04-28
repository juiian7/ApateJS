This introduction should give a basic understanding how to use Apate.
The most important part is the {@link Apate#scene | scene} with the entities (represented as {@link World.Obj | Obj})

## Scene Graph ({@link Apate#scene | engine.scene})

Starting with the scene graph as it is the most suitable way to create different types of game objects. As the name says it's a graph, which is leading to a tree structure. Every node inherits the {@link World.Obj} class. This {@link World.Obj | Obj} is a simple container class for storing other nodes within the tree. It also also contains the position relative to the parent node and the behaviour how it gets displayed. The plain {@link World.Obj | Obj} class itself doesn't implement this draw method since it's the root of the inheritance and not designed to be used for rendering content. To actually display stuff there are multiple other {@link World.Obj | Obj}-inherited classes which we take a look at later.

Lets look at a simple scene graph as an example to understand it:

```txt
The type of the node in the tree is written inside brackets.

> Scene ({@link World.Obj | Obj}) - The root of the graph, no direct behaviour
|--> Player ({@link World.Obj | Obj}) - An empty container (used to move the player)
|  |--> Image ({@link World.Sprite | Sprite}) - The sprite of the "Player"
|  |--> Body ({@link World.Body | Body}) - A physics object
|     |--> Collider ({@link World.Collider | Collider}) - with a corresponding collider
|
|--> Background ({@link World.Sprite | Sprite})
|--> Enemy ({@link World.Body | Body})
|  |--> Collider ({@link World.Collider | Collider})
|  |--> Image ({@link World.Sprite | Sprite})
```

## Types of Nodes - {@link World.Obj | Obj's} inheritance

To get a detailed explanation of all different scene graph's node types take a look at the documentation of {@link World}.

## Other Helper Objects

A general overview of the core classes can be found here: {@link Core}

**{@link Core.Vec | Vec}**: just a simple 4-dimensional Vector (x,y,z,w), but also designed to be used for colors (r,g,b,a -> same as x,y,...). Actually it could be used for more dimensions, but all mathematical operations only work on the first four.

**{@link Core.Transform | Transform}**: an object that describes a transformation. Stores vectors for position, rotation and scale.

**{@link Core.Texture | Texture}**: the thing (mostly a real image) that gets uploaded to the GPU. (not really relevant for game devs, but still important to know how things work together behind the mask)

**{@link Core.Tile | Tile}**: an abstraction of an image. Why? Multiple {@link Core.Tile | Tiles} could be different parts of the same image (cutouts). **Remember:** Images are always rendered as {@link Core.Tile | Tiles}.

<div class="note">
<i>Example:</i> there is one sprite atlas (a big image containing other images) with all animations of a player. This image would be loaded as a {@link Core.Tile | Tile}. The {@link Core.Tile | Tile} would store the data of the image (as a {@link Core.Texture | Texture}) and the area that should be visible. So we can create {@link Core.Tile | Tiles} for every frame of every animation. All of these tiles use the same Image ({@link Core.Texture | Texture}), but different cutouts, so they all look different.
</div>

## Bringing it all together (aka the main loop)

To bring it all together and finally be able to see something on the screen there is the {@link Apate} class which acts as the mount point of the engine. It stores the active scene graph ({@link Apate#scene | scene}), manages timings and handles the {@link Apate#\_loop | main loop}.

The function _{@link Apate#init | init()}_ and _{@link Apate#update | update()}_ can and need to be overwritten to inject own code to the engine.

**Before Loop**:
_{@link Apate#init | init()}_ is only called once at the start of the engine. At this point the main loop isn't executed. It is designed to load the data needed to run the game. It should return a promise, which will be awaited before the game starts.

**Main loop**:
Once the game loop is entered it runs for every frame. At first _{@link Apate#update | update()}_ is called to change values of Obj properties within the active scene. Then the active scene will be drawn. For handling deferent frame rates the same use the delta time (time since last update in ms), which can be accessed within _{@link Apate | Apate}_ by `this.delta`.

## Examples

Let's walk through some basic examples, to understand the concepts.
At first: Drawing Sprites

#### [Next Page >>]{@tutorial 2-sprites}
