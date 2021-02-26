import { apate } from '../../src/apate.js';
import Entity from '../../src/entity.js';
import ParticleSystem from '../../src/utility/particleSystem.js';
import { rgb } from './main.js';

let starColors = [
    rgb(230, 230, 200),
    rgb(230, 230, 230),
    rgb(165, 165, 165),
    rgb(215, 210, 215)
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

/*
starMap.on('init', () => {
    let amount = 100;
    starMap.stars = [];
    for (let i = 0; i < amount; i++) {
        let x = Math.round(apate.random.between(0, 128));
        let y = Math.round(apate.random.between(0, 128));
        let c = starColors[Math.round(apate.random.between(0, 3))];
        starMap.stars.push({ x, y, c, tmpY: 0 });
    }
});

starMap.on('update', (delta) => {
    for (let i = 0; i < starMap.stars.length; i++) {
        starMap.stars[i].tmpY += starMap.speed;
        if (starMap.stars[i].y + starMap.stars[i].tmpY > 128) starMap.stars[i].tmpY = 0 - starMap.stars[i].y;
    }
});

starMap.on('draw', () => {
    for (let i = 0; i < starMap.stars.length; i++) {
        apate.screen.pixel(starMap.stars[i].x, starMap.stars[i].y + Math.round(starMap.stars[i].tmpY), starMap.stars[i].c);
    }
});
*/
