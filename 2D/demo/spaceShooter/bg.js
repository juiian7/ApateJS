let starColors = [
    rgb(230, 230, 200),
    rgb(230, 230, 230),
    rgb(165, 165, 165),
    rgb(215, 210, 215)
];
let stars = [];

for (let i = 0; i < 100; i++) {
    let x = Math.round(Math.random() * 128 * 2);
    let y = Math.round(Math.random() * 128 * 2);
    let c = starColors[Math.round(Math.random() * 3)];
    let s = 1;
    stars.push({
        x,
        y,
        c,
        s,
        tmpY: 0
    });
}


function drawBG(screen) {
    for (let i = 0; i < stars.length; i++) {

        stars[i].tmpY++;
        if (stars[i].y + stars[i].tmpY > 128 * 2) stars[i].tmpY = 0 - stars[i].y;

        screen.rect(stars[i].x, stars[i].y + stars[i].tmpY, stars[i].s, stars[i].s, stars[i].c);
    }
    scroll++;
}

function rgb(r, g, b) {
    return {
        r,
        g,
        b
    };
}