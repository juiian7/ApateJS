export default {
    vertex: `#version 300 es

    in vec4 aVertexPos;
    in vec2 aTextCoord;
    in vec4 aNormal;
    
    out vec2 uv;

    void main() { 
        gl_Position = aVertexPos; 
        uv = aTextCoord;
    }
    `,
    fragment: `#version 300 es
    precision highp float;
    
    in vec2 uv;
    
    uniform sampler2D uTexture;
    uniform vec4 uColor;

    out vec4 glColor;

    void main() { 
        glColor = texture(uTexture, uv) * uColor;
    }`,
};
