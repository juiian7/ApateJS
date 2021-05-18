//

export default class PixelScreen {
    /**
     * @param {HTMLElement} parentElement
     * @param {number} width screen width
     * @param {number} height screen height
     */
    constructor(parentElement, width, height) {
        const element = parentElement.querySelector('#pixelscreen');
        if (element) {
            this.canvas = element;
        } else {
            this.canvas = document.createElement('canvas');
            parentElement.appendChild(this.canvas);
        }
        this.canvas.id = 'pixelscreen';
        this.canvas.style.cursor = 'none';

        this.width = width ?? 128;
        this.height = height ?? 128;
        this.pixel = new Uint8Array(this.width * this.height * 3);

        try {
            this.gl = this.canvas.getContext('webgl2');
            this.webgl2 = true;
        } catch {
            this.gl = null;
        }
        if (!this.gl) {
            this.gl = this.canvas.getContext('webgl');
            this.webgl2 = false;
        }

        this.gl.clearColor(0, 0, 0, 1);

        this.scale = 4;
        this.rescale(this.scale);

        this.initShaderProgram();

        this.setUpBuffers();
        this.setUpAttributes();

        this.createTexture();
    }

    rescale(scale) {
        this.scale = scale;
        this.canvas.width = this.width * scale;
        this.canvas.height = this.height * scale;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.pixel = new Uint8Array(this.width * this.height * 3);

        this.rescale(4);
    }

    setUpBuffers() {
        const vertices = [
            -1, 1, 0, 0, // top left
            1, 1, 1, 0, // top right
            -1, -1, 0, 1, // bottom left
            1, -1, 1, 1 // bottom right
        ];

        this.vbuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
    }

    setUpAttributes() {
        this.vertexPostion = this.gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
        this.texturePosition = this.gl.getAttribLocation(this.shaderProgram, 'aTextureCoord');
        this.sampler2DPosition = this.gl.getUniformLocation(this.shaderProgram, 'uTexture');

        this.gl.vertexAttribPointer(this.vertexPostion, 2, this.gl.FLOAT, false, 16, 0);
        this.gl.enableVertexAttribArray(this.vertexPostion);

        this.gl.vertexAttribPointer(this.texturePosition, 2, this.gl.FLOAT, false, 16, 8);
        this.gl.enableVertexAttribArray(this.texturePosition);
    }

    initShaderProgram() {
        let vertShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        if (this.webgl2) this.gl.shaderSource(vertShader, vs2);
        else this.gl.shaderSource(vertShader, vs);
        this.gl.compileShader(vertShader);

        let fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        if (this.webgl2) this.gl.shaderSource(fragShader, fs2);
        else this.gl.shaderSource(fragShader, fs);
        this.gl.compileShader(fragShader);

        this.shaderProgram = this.gl.createProgram();

        this.gl.attachShader(this.shaderProgram, vertShader);
        this.gl.attachShader(this.shaderProgram, fragShader);

        this.gl.linkProgram(this.shaderProgram);

        this.gl.useProgram(this.shaderProgram);
    }

    createTexture() {
        this.texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

        this.updateTexture();

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

        this.gl.uniform1i(this.sampler2DPosition, 0);
    }

    updateTexture() {
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGB, this.width, this.height, 0, this.gl.RGB, this.gl.UNSIGNED_BYTE, this.pixel);
    }

    render() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }

    /**
     * Changes the color of a pixel
     * @param {number} x x-coord
     * @param {number} y y-coord
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @returns
     */
    setPixel(x, y, r, g, b) {
        if (x >= 0 && x < this.width && y >= 0 && this.height) {
            let index = (this.width * y + x) * 3;
            if (index > this.pixel.length) return;
            this.pixel[index] = r;
            this.pixel[index + 1] = g;
            this.pixel[index + 2] = b;
        }
    }

    /**
     * Get the color of a pixel
     * @param {number} x
     * @param {number} y
     * @returns {{r,g,b}} color-object
     */
    getPixel(x, y) {
        let c = {
            r: 255,
            g: 255,
            b: 255
        };

        if (x >= 0 && x < this.width && y >= 0 && this.height) {
            let index = (this.width * y + x) * 3;
            if (index > this.pixel.length) return c;
            c.r = this.pixel[index];
            c.g = this.pixel[index + 1];
            c.b = this.pixel[index + 2];
        }
        return c;
    }

    clear(r, g, b) {
        for (let i = 0; i < this.pixel.length; i += 3) {
            this.pixel[i] = r;
            this.pixel[i + 1] = g;
            this.pixel[i + 2] = b;
        }
    }
}

//#region Shader

const vs = `
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

varying vec2 vTextureCoord;

void main() {
    gl_Position = vec4(aVertexPosition, 0, 1);
    vTextureCoord = aTextureCoord;
}
`;

const fs = `
precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uTexture;

void main() {
    gl_FragColor = texture2D(uTexture, vTextureCoord);
}
`;

const vs2 = `#version 300 es
in vec2 aVertexPosition;
in vec2 aTextureCoord;

out vec2 vTextureCoord;

void main() {
    gl_Position = vec4(aVertexPosition, 0, 1);
    vTextureCoord = aTextureCoord;
}
`;

const fs2 = `#version 300 es
precision mediump float;

in vec2 vTextureCoord;
uniform sampler2D uTexture;
out vec4 fragColor;

void main() {
    fragColor = vec4(texture(uTexture, vTextureCoord).xyz,1);
}
`;

//#endregion
