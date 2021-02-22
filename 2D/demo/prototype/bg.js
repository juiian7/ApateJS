import Screen from '../../src/screen/screen.js';
import Random from '../../src/utility/random.js';

let random = new Random();

let colors = {
    night_blue: rgb(0, 0, 85),
    night_purple: rgb(90, 0, 85),

    star_yellow: rgb(230, 230, 200),
    star_white: rgb(230, 230, 230),
    star_gray: rgb(165, 165, 165),
    star_pink: rgb(215, 210, 215),

    fog: rgb(255, 255, 255),

    house: rgb(0, 0, 60),
    //house_gray: rgb(40, 40, 40),

    window_dark: rgb(50, 50, 100),
    window_light: rgb(210, 190, 50)
};

let blue_falloff = 64 * 2;
let blue_falloff_steps = 8;
let blue_falloff_height = blue_falloff / blue_falloff_steps;

let blue_purple_shift = (colors.night_purple.r - colors.night_blue.r) / blue_falloff_steps;

let fog_min_y = 120;

// create stars
let stars_max_y = 64;
let stars = [];

function createStars(stars_count, width) {
    stars = [];
    for (let i = 0; i < stars_count; i++) {
        let c = Math.round(random.between(0, 3));
        if (c == 0) c = colors.star_yellow;
        else if (c == 1) c = colors.star_white;
        else if (c == 2) c = colors.star_gray;
        else if (c == 3) c = colors.star_pink;

        stars.push({
            x: Math.round(random.between(0, width)),
            y: Math.round(random.between(0, stars_max_y)),
            c
        });
    }
}

createStars(60, 128 * 2);

let houses = [];
let house_max_height = 30;
let house_min_height = 10;
let house_width = 15;

let window_count = 0;
let lighted_windows = [];

function createHouses(amount, width) {
    houses = [];
    for (let i = 0; i < amount; i++) {
        let h = Math.round(random.between(house_min_height, house_max_height));
        houses.push({
            x: Math.round(random.between(0, width)),
            height: h,
            width: house_width,
            c: colors.house
        });
        window_count += (house_width / 3) * (h / 4);
    }
}

function lightUpWindows() {
    lighted_windows = [];
    let l = Math.round(random.between(10, window_count));
    for (let i = 0; i < l; i++) {
        let id = Math.round(random.between(0, window_count));
        lighted_windows.push(id);
    }
}

createHouses(40, 182 * 2);
lightUpWindows();

/**
 *
 * @param {Screen} screen
 */
export function drawBackground(screen, scroll) {
    // background
    screen.rect(0, blue_falloff, 128, 128 - blue_falloff, colors.night_blue);
    for (let i = 0; i < blue_falloff_steps; i++) {
        screen.rect(0, i * blue_falloff_height, 128, blue_falloff_height, {
            r: colors.night_purple.r - blue_purple_shift * i,
            g: colors.night_purple.g,
            b: colors.night_purple.b
        });
    }

    // stars
    for (let i = 0; i < stars.length; i++) {
        stars[i].x_offset = -scroll;
        screen.pixel(stars[i].x + stars[i].x_offset, stars[i].y, stars[i].c);
    }

    // houses
    for (let i = 0; i < houses.length; i++) {
        houses[i].x_offset = -scroll * 2;
        let hy = 128 - houses[i].height;
        screen.rect(houses[i].x + houses[i].x_offset, hy, houses[i].width, houses[i].height, houses[i].c);

        // windows
        let win_id = 0;
        for (let y = 1; y < houses[i].height; y += 4) {
            for (let x = 1; x < houses[i].width; x += 3) {
                let c = colors.window_dark;
                if (lighted_windows.includes(win_id)) c = colors.window_light;
                screen.pixel(houses[i].x + houses[i].x_offset + x, hy + y, c);
                win_id++;
            }
        }
    }

    // fog
    for (let y = fog_min_y; y < 128; y++) {
        for (let x = 0; x < 128; x++) {
            let c = screen.pixelScreen.getPixel(x, y);
            c = {
                r: (c.r + colors.fog.r) / 2,
                g: (c.g + colors.fog.g) / 2,
                b: (c.b + colors.fog.b) / 2
            };
            screen.pixel(x, y, c);
        }
    }
}

function rgb(r, g, b) {
    return {
        r,
        g,
        b
    };
}
