//
import Entity from '../entity.js';
import Random from './random.js';

export default class ParticleSystem {

    constructor(properties) {
        this.isInitialized = true;
        this.isActive = false;
        this.priority = 0;

        this.random = new Random();

        this.backup = properties;
        this.loadProperties(properties);


        this.particles = [];
    }

    loadProperties(properties) {
        if (properties.seed) this.random.setSeed(properties.seed);

        this.amount = properties.amount ? properties.amount : Infinity;
        this.emitDelay = properties.emitDelay ? properties.emitDelay : 0;
        this.nextEmit = this.emitDelay;

        this.origin = {
            x: 0,
            y: -20,
            w: 128,
            h: 0
        };
        this.origin = {
            ...this.origin,
            ...properties.origin
        };
        if (properties.origin && !properties.origin.w) this.origin.w = 0;
        if (properties.origin && !properties.origin.h) this.origin.h = 0;

        this.lifetime = properties.lifetime ? properties.lifetime : Infinity;
        this.velocity = {
            x: 0,
            y: 0
        };
        this.velocity = {
            ...this.velocity,
            ...properties.velocity
        };
        this.colors = properties.colors;

        this.gravity = {
            x: 0,
            y: 0
        };
        this.gravity = {
            ...this.gravity,
            ...properties.gravity
        };
    }

    start() {
        this.isActive = true;
    }

    pause() {
        this.isActive = false;
    }

    reset() {
        this.isActive = false;
        loadProperties(this.backup);
    }

    update(delta) {
        this.nextEmit -= delta;

        // create particle
        if (this.amount && this.nextEmit < 0) {
            this.amount--;
            this.nextEmit = this.emitDelay;

            let x = this.origin.x;
            let y = this.origin.y;


            if (this.origin.w) x += this.random.between(0, this.origin.w);
            if (this.origin.h) y += this.random.between(0, this.origin.h);

            let vx = this.velocity.randomMinX ? this.random.betweenNegative(this.velocity.randomMinX, this.velocity.randomMaxX) : this.velocity.x;
            let vy = this.velocity.randomMinY ? this.random.betweenNegative(this.velocity.randomMinY, this.velocity.randomMaxY) : this.velocity.y;

            let c = this.colors[Math.floor(this.random.between(0,this.colors.length))];
            
            this.particles.push({
                x,
                y,
                vx,
                vy,
                lifetime: this.lifetime,
                c,
            });
        }

        // update all particles
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].vx += this.gravity.x;
            this.particles[i].vy += this.gravity.y;


            this.particles[i].x += this.particles[i].vx * delta / 1000;
            this.particles[i].y += this.particles[i].vy * delta / 1000;



            this.particles[i].lifetime--;
            if (this.particles[i].lifetime <= 0) {
                this.particles.splice(i, 1);
                i--;
            }
        }
    }

    draw(screen) {
        for (let i = 0; i < this.particles.length; i++) {
            screen.pixel(Math.round(this.particles[i].x), Math.round(this.particles[i].y), this.particles[i].c);
        }
    }
}
/*
let blood = {
    amount: 20,
    origin: {
        x: 64,
        y: 64
    },
    lifetime: 1000,
    velocity: {
        x: 0,
        y: 3
    },
    emitDelay: 0,
    gravity: {
        x: 0,
        y: 0.6
    },
    color: {
        r: 255,
        g: 0,
        b: 0
    }
};*/