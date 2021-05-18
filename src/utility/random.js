//

export default class Random {
    /**
     * @param {number} seed
     */
    constructor(seed) {
        this.setSeed(seed ?? new Date().getTime());
    }

    /**
     * Set the seed with is used by the random generator
     * @param {number} seed
     */
    setSeed(seed) {
        this.a = seed;
        this.b = seed;
        this.c = seed;
        this.seed = seed;
    }

    /**
     * Generates a random number
     * @returns {number}
     */
    next() {
        this.a = (171 * this.a) % 30269;
        this.b = (172 * this.b) % 30307;
        this.c = (170 * this.c) % 30323;
        return (this.a / 30269 + this.b / 30307 + this.c / 30323) % 1;
    }

    /**
     * Generates a random number in the given range
     * @param {number} min minimum
     * @param {number} max maximum
     * @returns {number}
     */
    between(min, max) {
        return this.next() * (max - min) + min;
    }
}

/**
 * Generates a random number with JS random
 * @param {number} max
 * @returns {number}
 */
export function seedlessRand(max) {
    return Math.floor(Math.random() * (max + 1));
}
