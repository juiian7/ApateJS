//



export default class ECS {

    constructor() {
        this.ids = 0;
        this.entities = {};
        this.components = {};
        this.systems = {};

    }

    createEntity() {
        this.ids++;
        this.entities[this.ids] = [];
        return this.ids;
    }

    /**
     * @param {number} entity 
     * @param {string} type 
     * @param {any} component 
     */
    addComponent(entity, type, component) {
        if (!this.entities[entity]) this.entities[entity] = [];
        if (!this.components[type]) this.components[type] = [];

        this.entities[entity].push(component);
        this.components[type].push(component);
    }

    /**
     * @param {string} type 
     * @param {any} system 
     */
    addSystem(type, system) {
        this.systems[type] = system;
    }

    /**
     * @param {string} type 
     */
    updateComponents(type) {
        for (let i = 0; i < this.components[type].length; i++) {
            this.systems[type](this.components[type][i]);
        }
    }

    updateAll() { 
        let keys = Object.keys(this.components);
        for (let i = 0; i < keys.length; i++) {
            this.updateComponents(keys[i]);
        }
    }

    getEntityComponents(eid) {
        return this.entities[eid];
    }

    getEntityComponent(eid, type){
        let ecomps = this.getEntityComponents(eid);
        let comps = this.components[type];

        let component = comps.find((el) => ecomps.includes(el));
        return component;
    }
}

