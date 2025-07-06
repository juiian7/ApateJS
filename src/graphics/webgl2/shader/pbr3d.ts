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
    out vec3 fragPos;

    void main() { 
        gl_Position = uProjection * uView * uModel * vec4(aVertexPos, 1);
        
        uv = aTextCoord;
        normal = mat3(uModel) * aNormal;
        fragPos = (uModel * vec4(aVertexPos, 1)).xyz;
    }
    `,
    fragment: `#version 300 es
    precision highp float;
    
    in vec2 uv;
    in vec3 normal;
    in vec3 fragPos;
    
    uniform vec4 uBaseColor;
    uniform vec4 uEmissiveFactor;

    uniform sampler2D uBaseTexture;
    uniform sampler2D uNormalTexture;
    uniform sampler2D uMetallicRoughnessTexture;
    uniform sampler2D uEmissiveTexture;

    uniform vec4 uViewPos;

    out vec4 glColor;

    void main() { 
        vec4 baseColor = uBaseColor;
        if (baseColor == vec4(0,0,0,0)) baseColor = texture(uBaseTexture, uv);
        
        float roughness = texture(uMetallicRoughnessTexture, uv).g;
        float metallic = texture(uMetallicRoughnessTexture, uv).b;
        
        //baseColor = vec4(mix(vec3(0.4), baseColor.rgb, metallic), 1);

        vec3 normal = texture(uNormalTexture, uv).rgb;
        // transform normal vector to range [-1,1]
        normal = normalize(normal * 2.0 - 1.0);   

        vec3 lightPos = vec3(1, 0, 2);
        vec3 lightDir = normalize(lightPos - fragPos);
        vec3 lightColor = vec3(1,1,1);
        float lightIntensity = 1.0;

        float diff = max(dot(normal, lightDir), 0.0);
        vec4 diffuse = vec4(diff * lightColor * lightIntensity, 1.0) * baseColor;

        float shininess = 64.0;
        float specularStrength = 1.0;
        vec3 viewDir = normalize(uViewPos.xyz - fragPos);
        vec3 reflectDir = reflect(-lightDir, normal); 
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
        vec4 specular = vec4(specularStrength * spec * lightColor, 1.0);

        vec4 ambient = vec4(0.0);

        glColor = ambient + diffuse + specular;
        
        vec4 emissive = texture(uEmissiveTexture, uv);
        if (uEmissiveFactor.rgb != vec3(0)) emissive *= uEmissiveFactor;
        glColor += emissive;
    }`,
};
