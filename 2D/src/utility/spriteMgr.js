
export default class SpriteMgr {

    constructor() {
        this.canvas = document.createElement('canvas');
    }
    async loadSpriteFromURL(url) {
        var res = await fetch(url);
        let json = await res.json();
        return json;
    }
    
    loadImgFromUrl(url) {
        let img = new Image();
        return new Promise((res, rej) => {
            img.onload = () => {
                res(img);
            }
            img.src = url;
        });
    }
    
    /**
     * 
     * @param {HTMLImageElement} img 
     */
    imgToSprite(img) {
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        let ctx = this.canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        let image = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        let sprite = [];
        let x = -1;
        let y = 0;
        for (let i = 0; i < image.data.length; i += 4) {
            x++;
            if (x >= image.width) {
                y++;
                x = 0;
            }
            let r = image.data[i],
                g = image.data[i + 1],
                b = image.data[i + 2],
                a = image.data[i + 3];
    
            if (a == 0) continue;
    
            sprite.push({
                x,
                y,
                c: {
                    r,
                    g,
                    b
                }
            });
        }
        return sprite;
    }
}