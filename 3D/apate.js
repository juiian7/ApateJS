// apate.js

class Shader {
    constructor(source, type) {
        this.id = gl.createShader(type);
        this.type = type;
        this.isCompiled = false;
        gl.shaderSource(this.id, source);
    }

    compile() {
        gl.compileShader(this.id);
        this.isCompiled = true;

        if (!gl.getShaderParameter(this.id, gl.COMPILE_STATUS)) {
            this.isCompiled = false;
            console.log('An error occurred compiling the ' + (this.type == gl.VERTEX_SHADER ? 'vertex' : 'fragment') + ' shader: ', gl.getShaderInfoLog(this.id));
            gl.deleteShader(this.id);
            return null;
        }

        return this;
    }

    delete() {
        gl.deleteShader(this.id);
    }
}

class ShaderProgram {
    constructor() {
        this.id = gl.createProgram();
        this.shaders = [];
        this.locationCache = {};
    }

    /**
     * @returns {Boolean}
     */
    attachShader(shader) {
        if (!shader || !shader.isCompiled) {
            console.log('Shader is not compiled!');
            return false;
        }
        gl.attachShader(this.id, shader.id);
        this.shaders.push(shader);
        return true;
    }

    linkProgram() {
        gl.linkProgram(this.id);
    }

    bind() {
        gl.useProgram(this.id);
    }

    unbind() {
        gl.useProgram(0);
    }

    delete() {
        this.unbind();
        for (let i = 0; i < this.shaders.length; i++) {
            this.shaders[i].delete();
        }
        gl.deleteProgram(this.id);
    }

    getUniformLocation(name) {
        var loc = this.locationCache[name];
        if (loc) return loc;
        loc = gl.getUniformLocation(this.id, name);
        this.locationCache[name] = loc;
        return loc;
    }

    setUniformVec3f(name, vec) {
        let pos = this.getUniformLocation(name);
        gl.uniform3fv(pos, vec);
    }

    setUniformMat4f(name, mat4) {
        let pos = this.getUniformLocation(name);
        gl.uniformMatrix4fv(pos, false, mat4);
    }
    setUniform1i(name, num) {
        let pos = this.getUniformLocation(name);
        gl.uniform1i(pos, 0);
    }
}


class VertexBuffer {
    constructor(buffer) {
        this.type = gl.ARRAY_BUFFER;
        this.id = gl.createBuffer();
        if (buffer) this.setData(buffer);
    }
    setData(data) {
        this.bind();
        gl.bufferData(this.type, new Float32Array(data), gl.STATIC_DRAW);
    }

    bind() {
        gl.bindBuffer(this.type, this.id);
    }

    unbind() {
        gl.bindBuffer(this.type, 0);
    }

    delete() {
        gl.deleteBuffer(this.id);
    }
}

class IndexBuffer {
    constructor(buffer) {
        this.type = gl.ELEMENT_ARRAY_BUFFER;
        this.id = gl.createBuffer();
        this.bind();
        gl.bufferData(this.type, new Uint16Array(buffer), gl.STATIC_DRAW)
    }

    bind() {
        gl.bindBuffer(this.type, this.id);
    }

    unbind() {
        gl.bindBuffer(this.type, 0);
    }

    delete() {
        gl.deleteBuffer(this.id);
    }
}

class BufferLayout {
    /**
     * 
     * @param {ShaderProgram} shaderProgram 
     */
    constructor(shaderProgram) {
        this.shaderProgram = shaderProgram;
        this.layouts = [];
        this.stride = 0;
    }

    pushLocation(location, size, type, normalized) {
        let typeSize = 4;
        if (type == gl.FLOAT) typeSize = 4;
        this.stride += typeSize * size;


        this.layouts.push({
            location,
            size,
            type,
            typeSize,
            normalized
        });
    }

    push(name, size, type, normalized) {
        var location = gl.getAttribLocation(this.shaderProgram.id, name);

        this.pushLocation(location, size, type, normalized);
    }
}

class VertexArray {
    constructor() {
        this.id = gl.createVertexArray();
    }
    /**
     * @param {VertexBuffer} buffer 
     * @param {BufferLayout} layout 
     */
    addBuffer(buffer, layout) {
        buffer.bind();
        this.bind();

        let offset = 0;
        let layouts = layout.layouts;
        for (let i = 0; i < layouts.length; i++) {
            gl.enableVertexAttribArray(layouts[i].location);
            gl.vertexAttribPointer(layouts[i].location, layouts[i].size, layouts[i].type, layouts[i].normalized, layout.stride, offset);

            offset += layouts[i].size * layouts[i].typeSize;
        }
    }

    bind() {
        gl.bindVertexArray(this.id);
    }

    unbind() {
        gl.bindVertexArray(0);
    }

    delete() {
        gl.deleteVertexArray(this.id);
    }
}

function powerOfTwo(x) {
    return (Math.log(x) / Math.log(2)) % 1 === 0;
}


class Texture2D {
    constructor() {
        this.id = gl.createTexture();
        this.bind();

        const pixel = new Uint8Array([255, 0, 255, 255]); // opaque blue
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    }

    bind() {
        gl.bindTexture(gl.TEXTURE_2D, this.id);
    }

    load(url) {
        const image = new Image();
        let self = this;
        image.onload = function () {
            self.bind();

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

            if (powerOfTwo(image.width) && powerOfTwo(image.height)) {
                gl.generateMipmap(gl.TEXTURE_2D);
            } else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }
        };
        image.src = url;
    }

    activate(textureNum) {
        gl.activeTexture(textureNum);
        this.bind();
    }
}

class Camera {
    constructor(fieldOfView, aspect, zNear, zFar) {
        this.fieldOfView = fieldOfView;
        this.aspect = aspect;
        this.zNear = zNear;
        this.zFar = zFar;

        this.viewMat = mat4.create();
        this.projectionMat = mat4.create();

        this.position = [0, 0, 0];
        this.setTo(0, 0, 0);

        //this.setTo(0, 0, 0);

        mat4.perspective(this.projectionMat, fieldOfView, aspect, zNear, zFar);
    }

    setTo(x, y, z) {
        this.move(x - this.position[0], y - this.position[1], z - this.position[2]);
    }

    move(x, y, z) {
        this.position = [this.position[0] + x, this.position[1] + y, this.position[2] + z];
        mat4.translate(this.viewMat, this.viewMat, [x, y, z]);
    }

    rotate(x, y, z, angle) {
        mat4.rotate(this.viewMat, this.viewMat, [x, y, z], angle);
    }
    lookAt(x, y, z) {
        mat4.lookAt(this.viewMat, this.position, [x, y, z], [0, 1, 0]);
    }
    /**
     * 
     * @param {Mesh} mesh
     * @param {ShaderProgram} shaderProgram 
     */
    render(mesh, shaderProgram) {

        shaderProgram.bind();
        mesh.bind();

        shaderProgram.setUniformMat4f('uView', this.viewMat);
        shaderProgram.setUniformMat4f('uProjection', this.projectionMat);

        gl.drawArrays(gl.TRIANGLES, 0, mesh.VerticesCount);
    }

    renderToTarget(mesh, shaderProgram, renderTarget) {
        
    }
}

class Mesh {
    constructor() {
        this.vao = new VertexArray();
        this.buffer = new VertexBuffer();
    }

    loadFromObj(text) {
        let {
            vertices,
            includesNormals,
            includesTextureCoords
        } = loadObj(text);

        this.vao = new VertexArray();
        this.includesNormals = includesNormals;
        this.includesTextureCoords = includesTextureCoords;

        let vertexSize = 3;
        if (includesTextureCoords) vertexSize += 2
        if (includesNormals) vertexSize += 3;
        this.count = vertices.length / vertexSize;

        this.buffer.setData(vertices);
    }

    /**
     * 
     * @param {Shader} shaderProgram 
     * @param {String} position 
     * @param {String?} texture 
     * @param {String?} normal 
     */
    bindShaderLayout(shaderProgram, position, texture, normal) {
        this.vao.delete();

        this.vao = new VertexArray();

        let attrPos = position ? position : 'aVertexPosition';
        let attrTex = texture ? texture : 'aVertexText';
        let attrNor = normal ? normal : 'aVertexNormal';

        var layout = new BufferLayout(shaderProgram);

        layout.push(attrPos, 3, gl.FLOAT, false);
        if (this.includesTextureCoords) layout.push(attrTex, 2, gl.FLOAT, false);
        if (this.includesNormals) layout.push(attrNor, 3, gl.FLOAT, false);

        this.vao.addBuffer(this.buffer, layout)
    }
    bind() {
        this.vao.bind();
    }

    get VerticesCount() {
        return this.count;
    }
}