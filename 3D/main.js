// main.js

var xRotRange = document.querySelector('#xRot');
var yRotRange = document.querySelector('#yRot');
var zRotRange = document.querySelector('#zRot');

const config = {
    renderCanvasID: 'defaultOutput',
    errorCanvasID: 'errorCanvas',
    width: 800,
    height: 640,
    tickspeed: 30,
    fps: 500000,
    webglOptions: {
        antialias: true
    }
};

var gl = getCanvas().getContext('webgl2', config.webglOptions);
var modelMat = mat4.create();
var modelMat2 = mat4.create();

mat4.translate(modelMat2, modelMat2, [0, 0, 4]);

function resetView() {
    xRotRange.value = 0;
    yRotRange.value = 0;
    zRotRange.value = 0;

    mat4.rotate(modelMat, modelMat, (180 / 180) * Math.PI, [0, 1, 0]);
}

main();

function main() {
    gl.clearColor(0.0, 0.0, 0.0, 0.7); //Background color
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);

    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    //gl.frontFace(gl.CW);

    // for transparent objects
    //gl.enable(gl.BLEND);
    //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    var vs = new Shader(vertexShader, gl.VERTEX_SHADER).compile();
    var fs = new Shader(fragmentShader, gl.FRAGMENT_SHADER).compile();

    var shaderProgram = new ShaderProgram();
    let error_vs = shaderProgram.attachShader(vs);
    let error_fs = shaderProgram.attachShader(fs);
    if (!error_vs || !error_fs) {
        error();
        return;
    }
    shaderProgram.linkProgram();
    shaderProgram.bind();

    var mesh = new Mesh();
    mesh.loadFromObj(dog);
    mesh.bindShaderLayout(shaderProgram, 'aVertexPosition', 'aVertexText', 'aVertexNormal');

    var mesh2 = new Mesh();
    mesh2.loadFromObj(suzanne);
    mesh2.bindShaderLayout(shaderProgram, 'aVertexPosition', 'aVertexText', 'aVertexNormal');

    let texture = new Texture2D();
    texture.load('uv1.png');

    let texture2 = new Texture2D();
    texture2.load('uv.png');

    // render loop

    const fieldOfView = (60 * Math.PI) / 180; // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;

    var camera = new Camera(fieldOfView, aspect, zNear, zFar);

    camera.setTo(0, 0, -5);
    camera.lookAt(0, 0, 0);

    document.body.onkeypress = function (e) {
        let speed = 0.5;
        switch (e.key) {
            case 'w':
                camera.move(0, 0, speed);
                break;
            case 's':
                camera.move(0, 0, -speed);
                break;
            case 'a':
                camera.move(speed, 0, 0);
                break;
            case 'd':
                camera.move(-speed, 0, 0);
                break;
        }
        camera.lookAt(0, 0, 0);
    };

    setInterval(() => {
        //mat4.rotate(modelMat, modelMat, rotSpeedRange.value / 180 * Math.PI, [xRotRange.value, yRotRange.value, zRotRange.value]);
        mat4.rotateX(modelMat, modelMat, (((xRotRange.value / config.tickspeed) * 500) / 180) * Math.PI);
        mat4.rotateY(modelMat, modelMat, (((yRotRange.value / config.tickspeed) * 500) / 180) * Math.PI);
        mat4.rotateZ(modelMat, modelMat, (((zRotRange.value / config.tickspeed) * 500) / 180) * Math.PI);
    }, 1000 / config.tickspeed);

    var dateAtBegin = Date.now();
    var timePassed, averageTimePerFrame, currentfps;
    var fpsCouter = 0;

    setInterval(() => {
        timePassed = Date.now() - dateAtBegin;
        if (timePassed > 5000) {
            averageTimePerFrame = timePassed / fpsCouter;
            currentfps = timePassed / averageTimePerFrame;
            console.log('current fps: ', currentfps);

            fpsCouter = 0;
            dateAtBegin = Date.now();
        } else {
            fpsCouter++;
        }

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        texture.activate(gl.TEXTURE0);

        shaderProgram.setUniform1i('uSampler', 0);
        shaderProgram.setUniformMat4f('uModel', modelMat);

        camera.render(mesh, shaderProgram);

        texture2.activate(gl.TEXTURE0);

        shaderProgram.setUniform1i('uSampler', 0);
        shaderProgram.setUniformMat4f('uModel', modelMat2);

        camera.render(mesh2, shaderProgram);
    }, 1000 / config.fps);
}

/**
 * @returns {HTMLCanvasElement}
 */
function getCanvas() {
    let canvas = document.getElementById(config.renderCanvasID);
    if (canvas) return canvas;

    var mainDiv = document.querySelector('#main');
    canvas = document.createElement('canvas');
    canvas.id = config.renderCanvasID;
    canvas.width = config.width;
    canvas.height = config.height;
    mainDiv.appendChild(canvas);
    return canvas;
}

function error() {
    var eCanvas = document.getElementById(config.errorCanvasID);
    if (!eCanvas) {
        var mainDiv = document.querySelector('#main');
        eCanvas = document.createElement('canvas');
        eCanvas.id = config.errorCanvasID;
        eCanvas.width = config.width;
        eCanvas.height = config.height;
        eCanvas.style.zIndex = 1;
        eCanvas.style.position = 'absolute';
        eCanvas.style.left = '0px';
        eCanvas.style.top = '0px';
        mainDiv.appendChild(eCanvas);
    }

    var crc = eCanvas.getContext('2d');
    let center = {
        x: eCanvas.width / 2,
        y: eCanvas.height / 2
    };
    crc.clearRect(0, 0, eCanvas.width, eCanvas.height);

    crc.fillStyle = 'green';
    let rectWidth = 420;
    let rectHeight = 50;
    crc.fillRect((eCanvas.width - rectWidth) / 2, eCanvas.width * 0.9, rectWidth, rectHeight);

    crc.font = 'bold 20px Arial';
    crc.fillStyle = '#00EE00';
    crc.textAlign = 'center';
    crc.fillText(`Shader konnten nicht kompiliert werden!`, center.x, eCanvas.width * 0.95);

    return window.requestAnimationFrame(error);
}
