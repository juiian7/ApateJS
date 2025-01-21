export default {
    vertex: `#version 300 es

    in vec2 aVertexPos;
    in vec2 aTextCoord;
    
    out vec2 uv;

    void main() { 
        gl_Position = vec4(aVertexPos, 0, 1); 
        uv = aTextCoord;
    }
    `,
    fragment: `#version 300 es
    precision highp float;
    
    in vec2 uv;
    
    uniform sampler2D uTile;
    uniform vec4 uColor;

    out vec4 glColor;

    void main() { 
        glColor = texture(uTile, uv) * uColor;
    }`,
};
