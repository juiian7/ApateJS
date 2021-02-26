//

export default class Entity {
    constructor() {
        this.isInitialized = false;
        this.isActive = true;
        this.priority = 0;
    }

    /**
     * @param {'start' | 'update' | 'draw' | 'lastUpdate' | 'exit' | 'save' | 'load' | 'click' | 'rightClick'} event
     * @param {() => void} callback
     */
    on(event, callback) {
        this[event] = callback;
    }

    /**
     * @param {any} obj loads a object into the entity and make a 'backup'
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
}
