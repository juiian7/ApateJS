import { World, Tile } from "../engine/index.js";

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
        new World.Sprite(null, this, "Sprite");
        // collider
        // physic

        // input handling
        // movement
    }
}
