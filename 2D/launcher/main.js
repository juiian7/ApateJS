let font = new FontFace('pixel', 'url(https://kusternigg.at/pixel.ttf)');
document.fonts.add(font);


let screenDiv = document.querySelector('#screen');

let pixelCanvas = document.createElement('canvas');
pixelCanvas.id = 'pixelscreen';
pixelCanvas.width = 128 * 4;
pixelCanvas.height = 128 * 4;


let ansiiCanvas = document.createElement('canvas');
ansiiCanvas.id = 'ansiiscreen';
ansiiCanvas.width = 128 * 4;
ansiiCanvas.height = 128 * 4;
ansiiCanvas.style.position = 'absolute';
ansiiCanvas.style.zIndex = 2;
ansiiCanvas.style.transform = 'translateX(-100%)';

let ctx = ansiiCanvas.getContext('2d');
ctx.font = 32 + 'px pixel';
ctx.fillStyle = '#FFFFFF';
ctx.fillText('No game running!', 32 * 4, 64 * 4);



screenDiv.appendChild(pixelCanvas);
screenDiv.appendChild(ansiiCanvas);


function loadGame(url) {
    ctx.clearRect(0, 0, 128 * 4, 128 * 4);

    let scripParent = document.querySelector('#gamescripts');
    scripParent.innerText = '';

    var script = document.createElement('script');
    script.src = url;
    script.type = 'module';


    scripParent.appendChild(script);
}

loadGame('../demo/demo.js');