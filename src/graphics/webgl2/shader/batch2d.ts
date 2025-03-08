export default {
    vertex: `#version 300 es

    in vec2 aVertexPos;
    in vec2 aTextCoord;
    in vec4 aClip;
    in mat4 aMatrix;

    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;

    uniform vec2 uAtlasSize;
    
    out vec2 uv;

    void main() { 
        gl_Position = uProjection * uView * ( uModel * aMatrix ) * vec4(aVertexPos, 0, 1);
        
        uv = (aClip.xy / uAtlasSize) + ((aTextCoord * aClip.zw) / uAtlasSize);
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
