//

export default class Scene {
    constructor() {
        this.entities = [];
    }

    /**
     * Instanciates an entity in a current scene
     * @param {Entity} entity 
     */
    init(entity) {
        this.entities.push(entity);

        this.entities = this.entities.sort((a, b) => a.priority - b.priority);
    }

    /**
     * Destroys the gives entity
     * @param {Entity} entity 
     */
    delete(entity) {
        let i = this.entities.findIndex((e) => e == entity);
        if (i >= 0) this.entities.splice(i, 1);
    }

    /**
     * Executes the given event for all currently active entities with the given args
     * @param {string} event 
     * @param {*} args 
     */
    async run(event, args) {
        for (let i = 0; i < this.entities.length; i++) {
            if ((!this.entities[i].isInitialized || event == 'init') && this.entities[i]['init']) {
                await this.entities[i]['init'](args);
                this.entities[i].isInitialized = true;
                if (event == 'init') return;
            }
            if (this.entities[i][event] && this.entities[i].isActive) this.entities[i][event](args);
        }
    }
}
