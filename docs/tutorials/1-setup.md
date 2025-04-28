There are 3 different recommended ways of using Apate.

### Prebuild

Prebuild sources can be found in the <a href="https://github.com/juiian7/ApateJS/releases">releases page</a> of this repository.

### Building

Dependencies:

-   npm (for tsc and jsdoc when building docs)

To build the project start by cloning it (including submodules) with

```
git clone --recurse-submodules https://github.com/juiian7/ApateJS.git
```

and then run

```
npm i
npm run build
```

Rename the dist/ folder and move it wherever you need it.

### Using the source

If you are planning to work on a typescript project using the source code directly can also be a suitable option. Clone Apate directly as submodule of your project or locate the source code of the Apate repo there.

## Project structure

A typical project structure could look like this:

```txt
my-game/
    apate/...
    assets/
        player.png
        tile-atlas.png
        ...

    scripts/
        player.js
        enemy.js

    scenes/
        level1.js
        ...

    index.html
    main.js
```

This structure is only an example. If you want to organize your code completely different, feel free! There is no need to follow this structure.

#### [Learn the basics >>]{@tutorial 2-intro}
