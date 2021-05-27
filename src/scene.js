import Entity from './entity.js';

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
     * Copies all entities from another scene to this scene
     * @param {Scene} scene Scene to copy from
     */
    merge(scene) {
        for (let i = 0; i < scene.entities.length; i++) {
            this.entities.push(scene.entities[i]);
        }
    }

    /**
     * Executes the given event for all currently active entities with the given args
     * TODO: Fix (async)'init' being called mutliple times
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
