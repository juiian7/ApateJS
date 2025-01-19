import { World } from "../engine/index.js";

export default class Room extends World.Obj {
    constructor(data: any, parent?: World.Obj) {
        super(parent, data._room_name);
        // load tilemap by data
        // new World.Tilemap(this, data.name);
    }

    public static load(args: any): Room {
        // get room data from args
        let data = { _room_name: "Demo" };
        return new Room(data);
    }
}
