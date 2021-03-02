import { color } from '../../src/apate.js';
import ParticleSystem from '../../src/utility/particleSystem.js';

const starColors = [
    color(230, 230, 200),
    color(230, 230, 230),
    color(165, 165, 165),
    color(215, 210, 215)
];

let starParticles = {
    velocity: {
        randomMinY: 70,
        randomMaxY: 75
    },
    colors: starColors,
    emitDelay: 20,
    lifetime: 1000
};

export var starMap = new ParticleSystem(starParticles);

starMap.start();
