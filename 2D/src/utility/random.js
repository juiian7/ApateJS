export default class Random {
    /**
     * @param {Number} seed 
     */
    constructor(seed) {
        this.setSeed(seed ?? new Date().getTime());
    }

    /**
     * @param {Number} seed 
     */
    setSeed(seed) {
        this.a = seed
        this.b = seed
        this.c = seed
        this.seed = seed;
    }

    /**
     * Generates a number with the specified seed
     * @returns {Number} 
     */
    next() {
        this.a = (171 * this.a) % 30269;
        this.b = (172 * this.b) % 30307;
        this.c = (170 * this.c) % 30323;
        return (this.a / 30269 + this.b / 30307 + this.c / 30323) % 1;
    }

    /**
     * Generates a number with the specified seed in the given range
     * @param {Number} min minimum
     * @param {Number} max maximum
     * @returns {Number} 
     */
    between(min, max) {
        return (this.next() * (max - min)) + min;
    }
}

/**
 * Generates a random number
 * @param {Number} max 
 * @returns {Number} 
 */
export function seedlessRand(max) {
    return Math.floor(Math.random() * (max + 1));
}