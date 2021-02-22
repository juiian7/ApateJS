//

export default class Scene {
    constructor() {
        this.entities = [];
    }

    init(entity) {
        this.entities.push(entity);

        this.entities = this.entities.sort((a, b) => a.priority - b.priority);
    }

    delete(entity) {
        let i = this.entities.findIndex((e) => e == entity);
        if (i >= 0) this.entities.splice(i, 1);
    }
    
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
