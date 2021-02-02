import { apate } from "../../src/apate.js";

apate.clearScreen = false;
apate.screen.clear({
    r: 0,
    b: 255,
    g: 255
})
//let charMap = {};

apate.on("start", async () => {
    //let width = 5;
    //let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!?:+-*/=()0123456789'.split(''); // ['A', 'B', ... , '9']
    /*
        let sprite = imgToSprite(await loadImgFromUrl('text2.png'));
        // {A: {len: 3, pixels:[...]}};

        for (let i = 0; i < chars.length; i++) {
            let minX = width * i - 1;
            let maxX = minX + width;

            let pixels = [];
            let maxW = 0;
            for (let j = 0; j < sprite.length; j++) {
                if (sprite[j].x > minX && sprite[j].x <= maxX) {
                    let p = {
                        x: sprite[j].x - minX - 1,
                        y: sprite[j].y
                    }
                    maxW = p.x > maxW ? p.x : maxW;
                    pixels.push(p);
                }
            }

            charMap[chars[i]] = {
                len: maxW + 1,
                pixels
            };
            console.log(chars[i], maxW + 1);
        }
        let s = JSON.stringify(charMap);
        console.log(s);*/
    //console.log(charMap);
    apate.screen.text(1, 0, 'ABCDEFGHIJKLM\nNOPQRSTUVWXYZ\n!?:+-*/=()0123456789', {
        r: 255,
        b: 0,
        g: 0
    }, 1);

});

apate.run();
/*
function text(x, y, text, c, scale, space) {
    if (space == null || space == undefined) space = 1;
    space *= scale;
    let xOffset = x;
    for (let i = 0; i < text.length; i++) {

        let char = text[i].toUpperCase();
        if (char == ' ') continue;
        if (char == '\n') {
            xOffset = x;
            y += 5 * scale + space;
            continue;
        }
        let charSprite = charMap[char];

        for (let j = 0; j < charSprite.pixels.length; j++) {
            engine.screen.rect((charSprite.pixels[j].x * scale) + xOffset, (charSprite.pixels[j].y * scale) + y, scale, scale, c);
        }
        xOffset += charSprite.len + space * scale;
        //engine.screen
    }
}*/