import { World, Tile, Vec } from "../engine/index.js";

const charactersImage = document.querySelector("#characters") as HTMLImageElement;

const atlas = Tile.fromImage(charactersImage).grid(8, 8);
const animations = {
    idle: [atlas[0][0]],
    walk: atlas[0],
    jump: [atlas[1][0]],
    fall: [atlas[2][0]],
    die: [atlas[3][2]],
};

export default class Player extends World.Obj {
    constructor(parent?: World.Obj) {
        super(parent, "Player");

        // sprite
        let sprite = new World.ASprite(animations.walk, this, "Sprite");
        sprite.transform.move(100, 0, 0);
        sprite.transform.scale = Vec.from(8 * 2, 8 * 2, 1);
        // collider
        // physic

        // input handling
        // movement
    }
}
