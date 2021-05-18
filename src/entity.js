//

export default class Entity {
    constructor() {
        this.isInitialized = false;
        this.isActive = true;
        this.priority = 0;
    }

    /**
     * @param {'init' | 'update' | 'draw' | 'click' | 'mouseDown' | 'mouseUp'  | 'btnDown' | 'btnUp'} event
     * @param {() => void} callback
     */
    on(event, callback) {
        this[event] = callback;
    }

    /**
     * @param {any} obj loads a object into the entity and makes a 'backup'
     */
    loadAttributes(obj) {
        this.backup = obj;
        let keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            this[keys[i]] = obj[keys[i]];
        }
    }

    /**
     * Jump back to the last 'backup'
     */
    reset() {
        this.isInitialized = false;
        this.isActive = true;

        this.loadAttributes(this.backup);
    }

    /**
     * Once called on start
     */
    init() {}
    /**
     * Called every tick
     * @param {number} delta Time since last call
     */
    update(delta) {}
    /**
     * Called every frame
     */
    draw() {}
    /**
     * @param {{isLeftClick: boolean}} clickInfo
     */
    click(clickInfo) {}
    /**
     * Triggered when left mouse button is pressed down
     */
    mouseDown() {}
    /**
     * Triggered when left mouse button is released
     */
    mouseUp() {}
    /**
     * Triggered when any key pressed down
     * @param {{key: string, shift: boolean, metaKey: boolean}} keyInfo
     */
    btnDown(keyInfo) {}
    /**
     * Triggered when any key is released
     * @param {{key: string, shift: boolean, metaKey: boolean}} keyInfo
     */
    btnUp(keyInfo) {}
}
