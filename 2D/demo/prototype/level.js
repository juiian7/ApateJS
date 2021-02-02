import SpriteMgr from "../../src/utility/spriteMgr.js";
import Tilemap from "../../src/utility/tilemap.js";

let spriteMgr = new SpriteMgr();

export async function loadScene() {

    let mainTileMap = new Tilemap(8, 8);

    let grass_img = await spriteMgr.loadImgFromUrl('./sprites/ground/grass.png')
    let grass_sprites = spriteMgr.imgToSprite(grass_img);

    let left_grass_tile = spriteMgr.subSprite(grass_sprites, 0, 0, 8, 8);
    let right_grass_tile = spriteMgr.subSprite(grass_sprites, 16, 0, 8, 8);
    let mid_grass_tile = spriteMgr.subSprite(grass_sprites, 8, 0, 8, 8);

    mainTileMap.addSprite('left_grass', left_grass_tile);
    mainTileMap.addSprite('right_grass', right_grass_tile);
    mainTileMap.addSprite('mid_grass', mid_grass_tile);

    mainTileMap.setTile(0,15, 'left_grass');

    for (let i = 0; i < 10; i++) {
        mainTileMap.setTile(i + 1, 15, 'mid_grass');
    }
    mainTileMap.setTile(11, 15, 'right_grass');

    return mainTileMap;
}
