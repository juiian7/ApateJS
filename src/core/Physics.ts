import { Body, Collider, Shapes } from "../scene/index.js";
import { Ray } from "./Ray.js";

export interface CollisionInfo {
    self: Collider;
    other: Collider;
    ownShape: Shapes.Shape;
    otherShape: Shapes.Shape;
}

export interface RayHit {
    distance: number;
    collider: Collider;
    shape: Shapes.Shape;
}

export interface RaycastInfo {
    nearest: number;
    hits: RayHit[];
}

export type CollisionLayer = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

class Physics {
    private colliders: Collider[] = [];

    constructor() {}

    public add(collider: Collider) {
        if (this.colliders.includes(collider)) console.warn(`"${collider.name}" already in physics body list -> skipping`);
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

    public layerUpdated(collider: Collider) {
        this.cleanCache(collider.layer);
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

    public static mask(...layers: CollisionLayer[]): number {
        let m = 0;
        for (const l of layers) m += 2 ** l;
        return m;
    }

    public mask(...layers: CollisionLayer[]) {
        return Physics.mask(...layers);
    }

    public collisions(collider: Collider): number {
        let possible = this.get(collider.mask);
        collider.collisions.length = 0;

        for (let i = 0; i < possible.length; i++) {
            if (collider == possible[i]) continue;
            collider.checkAgainst(possible[i]);
        }
        return collider.collisions.length;
    }

    public resolve(collider: Collider) {
        let info: CollisionInfo;
        while ((info = collider.collisions.pop())) info.ownShape.resolve(info);
    }

    public raycast(ray: Ray, mask: number, /* ignore: Collider[] = [], */ stopAfterFirst: boolean = true): RaycastInfo {
        let info: RaycastInfo = { nearest: Infinity, hits: [] };
        let possible = this.get(mask);
        for (let i = 0; i < possible.length; i++) {
            /* if (ignore.includes(possible[i])) continue; */
            let hit = possible[i].checkAgainstRay(ray);
            if (hit) {
                if (hit.distance < info.nearest) info.nearest = hit.distance;
                info.hits.push(hit);
                if (stopAfterFirst) return info;
            }
        }
        return info;
    }
}
export { Physics };
