

let starColors = [rgb(255,255,0),rgb(255,255,255),rgb(128,128,128)];
let stars = [];

for (let i = 0; i < 100; i++) {
    let x = Math.round(Math.random() * 128*2);
    let y = Math.round(Math.random() * 128*2);
    let c = starColors[Math.round(Math.random() * 2)];
    let s = 1;
    stars.push({
        x,y,c, s, tmpY: 0
    });
}


function drawBG(screen) {
    for (let i = 0; i < stars.length; i++) {
        
        stars[i].tmpY++;
        if (stars[i].y +stars[i].tmpY > 128*2) stars[i].tmpY = 0 - stars[i].y;

        screen.rect(stars[i].x,stars[i].y + stars[i].tmpY, stars[i].s, stars[i].s, stars[i].c);
    }
    scroll++;
}

function rgb(r,g,b) {
    return {
        r,g,b
    };
}