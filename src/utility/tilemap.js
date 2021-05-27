import SpriteMgr from './spriteMgr.js';

export default class Tilemap {
    /**
     * @param {number} width
     * @param {number} height
     */
    constructor(width, height) {
        this.tileWidth = width;
        this.tileHeight = height;
        this.tiles = [];
        this.tileMap = {};
    }

    /**
     * @param {string} name
     * @param {SpriteMgr} sprite
     */
    addSprite(name, sprite) {
        this.tileMap[name] = sprite;
    }

    /**
     * @param {number} x x-pos
     * @param {number} y y-pos
     * @param {string} name
     */
    setTile(x, y, name) {
        this.tiles.push({ x, y, name });
    }

    /**
     * @param {number} x x-pos
     * @param {number} y y-pos
     */
    removeTile(x, y) {
        let i = this.tiles.findIndex((t) => t.x == x && t.y == y);
        if (i > -1) this.tiles.splice(i, 1);
    }

    /**
     * @param {number} x x-pos
     * @param {number} y y-pos
     * @returns {{x: number, y: number, name: string}}
     */
    getTile(x, y) {
        return this.tiles.find((t) => t.x == x && t.y == y);
    }

    /**
     * @returns {JSON}
     */
    toJSON() {
        return {
            sprites: this.tileMap,
            tiles: this.tiles
        };
    }

    /**
     * @param {JSON} json
     */
    fromJSON(json) {
        this.tileMap = json.sprites;
        this.tiles = json.tiles;
    }
}

/*
{
    sprites: {
        name: [...sprite...],
        ...
    },
    tiles: [
        {x,y,name},
        ...
    ]
}
*/
