export default class Tilemap {
    constructor(w, h) {
        this.tileWidth = w;
        this.tileHeight = h;
        this.tiles = [];
        this.tileMap = {};
    }
    addTile(name, sprite) {
        this.tileMap[name] = sprite;
    }
    setTile(x, y, name) {
        this.tiles.push({
            x,
            y,
            name
        });
    }
    removeTile(x, y) {
        let i = this.tiles.findIndex(t => t.x == x && t.y == y);
        if (i > -1) this.tiles.splice(i, 1);
    }
    getTile(x, y) {
        return this.tiles.find(t => t.x == x && t.y == y);
    }
}