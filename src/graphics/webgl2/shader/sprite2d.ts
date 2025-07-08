export default {
    vertex: `#version 300 es

    in vec4 aVertexPos;
    in vec2 aTextCoord;

    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;

    uniform vec2 uFlip;
    uniform vec2 uAtlasSize;
    uniform vec4 uClip;
    
    out vec2 uv;

    void main() { 
        gl_Position = uProjection * uView * uModel * aVertexPos;
        
        vec2 coords = aTextCoord;
        if (uFlip.x > 0.0) coords.x = 1.0 - coords.x;
        if (uFlip.y > 0.0) coords.y = 1.0 - coords.y;

        //uv = (uClip.xy / uAtlasSize) + ((aTextCoord * uClip.zw) / uAtlasSize);
        uv = (uClip.xy / uAtlasSize) + ((coords * uClip.zw) / uAtlasSize);
        //uv = (uClip.xy / uAtlasSize) + (((uClip.zw - aTextCoord) * uClip.zw) / uAtlasSize);
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
