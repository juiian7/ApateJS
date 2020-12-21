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

        this.addComponent(this.ids, 'position', {
            x: 0,
            y: 0
        });

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

        component.eid = entity;
    }

    /**
     * @param {string} type 
     * @param {(comp: any)=>void} system
     */
    addSystem(type, system) {
        this.systems[type] = system;
    }

    /**
     * @param {string} type 
     */
    updateComponents(type) {
        if (!this.systems[type]) return;
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

    getEntityComponent(eid, type) {
        let ecomps = this.getEntityComponents(eid);
        let comps = this.components[type];

        let component = comps.find((el) => ecomps.includes(el));
        return component;
    }

    loadDefaultsSystems(engine) {
        this.addSystem('sprite', (comp) => {
            let p = this.getEntityComponent(comp.eid, 'position');
            engine.screen.pixelSprite(p.x, p.y, comp.scale, comp.sprite, comp.layer)
        })
    }
}