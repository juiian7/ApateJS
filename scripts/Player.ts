import { World, Tile, Vec, Input } from "../engine/index.js";

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
        sprite.transform.move(0, 0, 10);
        sprite.transform.scale = Vec.from(8, 8, 1);
        // collider
        // physic

        // input handling
        // movement
    }

    public update(delta: number, input: Input) {
        let axis = { h: 0, v: 0 };

        if (input.key("KeyW")) axis.v++;
        if (input.key("KeyS")) axis.v--;
        if (input.key("KeyA")) axis.h--;
        if (input.key("KeyD")) axis.h++;

        this.transform.move(axis.h, axis.v, 0);
    }
}
