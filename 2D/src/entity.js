//

export default class Entity {
    constructor() {
        this.isInitialized = false;
        this.isActive = true;
        this.priority = 0;
    }

    /**
     * @param {'init' | 'update' | 'draw'} event
     * @param {() => {}} callback
     */
    on(event, callback) {
        this[event] = callback;
    }

    loadAttributes(obj) {
        this.backup = obj;
        let keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            this[keys[i]] = obj[keys[i]];
        }
    }

    reset() {
        this.isInitialized = false;
        this.isActive = true;

        this.loadAttributes(this.backup);
    }
}
