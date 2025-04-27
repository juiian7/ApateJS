import { Collider, Obj } from "../scene/index.js";

class Physics {
    private colliders: Collider[] = [];

    constructor() {}

    public add(collider: Collider) {
        if (this.colliders.includes(collider)) console.warn(`"${collider.name}" already in collision list -> skipping`);
        this.colliders.push(collider);
        this.cleanCache(collider.collisionLayer);
    }

    public remove(collider: Collider) {
        let i = this.colliders.indexOf(collider);
        if (i >= 0) {
            this.colliders.splice(i, 1);
            this.cleanCache(collider.collisionLayer);
        }
    }

    private cleanCache(layer: number) {
        for (const mask of Object.keys(this._cache)) if ((+mask & (2 ** layer)) == 2 ** layer) this._cache[mask] = null;
    }

    private _cache: { [mask: number]: Collider[] } = {};
    public get(mask: number) {
        if (!this._cache[mask]) {
            this._cache[mask] = this.colliders.filter((c) => (mask & (2 ** c.collisionLayer)) == 2 ** c.collisionLayer);
        }
        return this._cache[mask];
    }

    public static mask(...layers: number[]): number {
        let m = 0;
        for (const l of layers) m += 2 ** l;
        return m;
    }
}
export { Physics };
