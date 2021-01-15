//

/*
entity:
{
    id:[comp1,comp2,...],
    ...
}
component:
{
    type: [comp1,comp2,...],
    ...
}

system:
{
    name: {
        targets: [comp1.type,comp2.type,...?],
        update: (comps)
    }
}

*/

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
        component.type = type;
    }

    /**
     * @param {string} type 
     * @param {(comps: any[])=>void} system
     */
    setSystem(name, targets, system) {
        this.systems[name] = {
            targets,
            update: system
        };
    }

    runSystem(name) {
        let targets = this.systems[name].targets; // ['position', 'sprite']

        let entitiesIDs = Object.keys(this.entities);
        for (let i = 0; i < entitiesIDs.length; i++) {
            let comps = this.entities[entitiesIDs[i]].filter(obj => {
                for (const type of targets) {
                    if (obj.type == type) return true;
                }
                return false;
            });

            if (comps.length == targets.length) {
                let sortcomps=  {};
                for (const type of targets) {
                    sortcomps[type] = this.entities[entitiesIDs[i]].find(comp => comp.type == type);
                }

                this.systems[name].update(sortcomps);
            }
        }
        
    }

    updateAll() {
        let systemNames = Object.keys(this.systems);
        for (let i = 0; i < systemNames.length; i++) {
            this.runSystem(systemNames[i]);
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
        this.setSystem('sprite', ['position', 'sprite'], (comps) => {
            engine.screen.sprite(comps['position'].x, comps['position'].y, comps['sprite'].sprite, comps['sprite'].scale);
        });
    }
}