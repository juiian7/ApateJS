export default class Random {
    /**
     * @param {Number?} seed 
     */
    constructor(seed) {
        if (!seed) seed = new Date().getTime();
        this.setSeed(seed);
    }

    /**
     * @returns {Number} 
     */
    next() {
        this.a = (171 * this.a) % 30269;
        this.b = (172 * this.b) % 30307;
        this.c = (170 * this.c) % 30323;
        return (this.a / 30269 + this.b / 30307 + this.c / 30323) % 1;
    }
    /**
     * @param {Number} min
     * @param {Number} max
     * @returns {Number} 
     */
    between(min, max) {
        return (this.next() * max) + min;
    }

    betweenNegative(min, max) {
        if (min < 0) {
            let d = Math.abs(max) + Math.abs(min);
            return (this.next() * d) - Math.abs(min);
        }
        return this.between(min, max);
    }

    setSeed(seed) {
        this.a = seed
        this.b = seed
        this.c = seed
        this.seed = seed;
    }
}

/**
 * @param {Number} max 
 * @returns {Number} 
 */
export function seedlessRand(max) {
    return Math.floor(Math.random() * (max + 1));
}