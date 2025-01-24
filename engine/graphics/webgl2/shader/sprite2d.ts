export default {
    vertex: `#version 300 es

    in vec4 aVertexPos;
    in vec2 aTextCoord;

    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;

    uniform vec2 uAtlasSize;
    uniform vec4 uClip;
    
    out vec2 uv;

    void main() { 
        gl_Position = uProjection * uView * uModel * aVertexPos;
        
        uv = (uClip.xy / uAtlasSize) + ((aTextCoord * uClip.zw) / uAtlasSize);
    }
    `,
    fragment: `#version 300 es
    precision highp float;
    
    in vec2 uv;
    
    uniform vec4 uColor;
    uniform sampler2D uAtlas;

    out vec4 glColor;

    void main() { 
        glColor = texture(uAtlas, uv) * uColor;
    }`,
};
