import SpriteMgr from "../../src/utility/spriteMgr.js";
import Tilemap from "../../src/utility/tilemap.js";

let spriteMgr = new SpriteMgr();

export async function loadScene() {

    let mainTileMap = new Tilemap(8, 8);

    let grass_img = await spriteMgr.loadImgFromUrl('./sprites/ground/grass.png')
    let grass_sprites = spriteMgr.imgToSprite(grass_img);


    let left_grass_tile = spriteMgr.subSprite(grass_sprites, 0, 0, 8, 8);
    let right_grass_tile = spriteMgr.subSprite(grass_sprites, 2, 0, 8, 8);
    let mid_grass_tile = spriteMgr.subSprite(grass_sprites, 1, 0, 8, 8);

    

    mainTileMap.addTile('left_grass', left_grass_tile);
    mainTileMap.addTile('right_grass', right_grass_tile);
    mainTileMap.addTile('mid_grass', mid_grass_tile);

    mainTileMap.setTile(0, 15, 'mid_grass');
    mainTileMap.setTile(0, 0, 'mid_grass');

    return mainTileMap;

}
