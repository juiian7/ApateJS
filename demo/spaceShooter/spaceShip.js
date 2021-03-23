import { apate } from '../../src/apate.js';
import Entity from '../../src/entity.js';
import { bulletSystem } from './bulletSystem.js';

export var spaceShip = new Entity();
spaceShip.priority = 10;

spaceShip.loadAttributes({
    x: 128 / 2 - 4,
    y: 110,
    scale: 1,
    speed: 0.1
});

var shootsPerSec = 5;
var nextShoot = 1000 / shootsPerSec;

spaceShip.on('init', () => {
    console.log('Initialized SpaceShip');
});

spaceShip.on('update', (delta) => {
    // movement
    if (apate.isButtonPressed('Left')) spaceShip.x -= delta * spaceShip.speed;
    if (apate.isButtonPressed('Right')) spaceShip.x += delta * spaceShip.speed;

    if (spaceShip.x < -8) spaceShip.x = 128;
    else if (spaceShip.x > 128) spaceShip.x = -8;

    nextShoot -= delta;
    if ((apate.isButtonPressed('Action1') || apate.isButtonPressed('Space')) && nextShoot < 0) {
        bulletSystem.shoot(spaceShip.x, spaceShip.y);
        nextShoot = 1000 / shootsPerSec;
    }
});

spaceShip.on('draw', () => {
    apate.screen.sprite(spaceShip.x, spaceShip.y, spaceShip.shipSprite, spaceShip.scale);
});
