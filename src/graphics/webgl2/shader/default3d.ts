export default {
    vertex: `#version 300 es

    in vec3 aVertexPos;
    in vec2 aTextCoord;
    in vec3 aNormal;

    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;
    
    out vec2 uv;
    out vec3 normal;

    void main() { 
        gl_Position = uProjection * uView * uModel * vec4(aVertexPos, 1);
        
        //vertPos = (uProjection * uView * uModel * aVertexPos).xyz;
        uv = aTextCoord;
        normal = mat3(uModel) * aNormal;
    }
    `,
    fragment: `#version 300 es
    precision highp float;
    
    in vec2 uv;
    in vec3 normal;
    
    uniform vec4 uBaseColor;

    out vec4 glColor;

    void main() { 
        vec4 objColor = uBaseColor;

        vec3 lightPos = vec3(10, 10, 10) * -1.0;
        vec3 lightDir = normalize(normal - lightPos);
        vec3 lightColor = vec3(1,1,1); // objColor.rgb;
        float lightIntensity = 1.0;
        
        float diff = max(dot(normalize(normal), lightDir), 0.0);
        vec4 diffuse = vec4(diff * lightColor * lightIntensity, 1.0);
        
        vec4 ambient = vec4(0);

        glColor = (ambient + diffuse) * objColor;
    }`,
};
