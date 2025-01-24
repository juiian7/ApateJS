export default {
    vertex: `#version 300 es

    in vec4 aVertexPos;
    in vec2 aTextCoord;
    in vec4 aNormal;

    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;
    
    out vec2 uv;
    out vec3 normal;


    void main() { 
        gl_Position = uProjection * uView * uModel * aVertexPos; 
        uv = aTextCoord;
        normal = aNormal.xyz;
    }
    `,
    fragment: `#version 300 es
    precision highp float;
    
    in vec2 uv;
    in vec3 normal;
    
    uniform sampler2D uTexture;
    uniform vec4 uColor;

    out vec4 glColor;

    void main() { 
        vec4 objColor = texture(uTexture, uv) * uColor;

        vec3 lightDir = normalize(vec3(1,0,1));
        vec3 lightColor = vec3(1,0,0);
        float lightIntensity = 1.0;
        
        float diff = max(dot(normalize(normal), lightDir), 0.0);
        vec4 diffuse = vec4(diff * lightColor, 1.0);

        vec3 ambient = vec3(1,1,1) * 0.2;
        
        glColor = (vec4(ambient, 1) + diffuse) * objColor;
    }`,
};
