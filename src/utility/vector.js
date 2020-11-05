//Hello This is a JavaScript Turtle 
/**
 * @typedef IVector
 * @property {number} x
 * @property {number} y
 */

export default class Vector {
    /**
     * @param {number} x x-value of vector
     * @param {number} y y-value of vector
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    //#region operators
    /**
     * @param {IVector} v vector format: {x, y}
     */
    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    /**
     * @param {Vector} v vector format: {x, y} 
     */
    sub(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    /**
     * @param {Vector} v vector format: {x, y} 
     */
    multiply(v) {
        return new Vector(this.x * v.x, this.y * v.y);
    }

    /**
     * @param {Vector} v vector format: {x, y} 
     */
    divide(v) {
        return new Vector(this.x / v.x, this.y / v.y);
    }
    
    /**
     * @param {Vector} v vector format: {x, y} 
     */
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    //#endregion

    get normalized() {
        let l = this.abs;
        return new Vector(this.x / l, this.y / l);
    }

    get abs(){
        return Math.sqrt(this.x^2+this.y^2);
    }
}