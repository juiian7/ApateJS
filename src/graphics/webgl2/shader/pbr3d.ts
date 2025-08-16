export default {
    vertex: `#version 300 es

    in vec3 aVertexPos;
    in vec2 aTextCoord;
    in vec3 aNormal;

    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;
    
    out vec2 uv;
    out vec3 norm;
    out vec3 fragPos;

    void main() { 
        gl_Position = uProjection * uView * uModel * vec4(aVertexPos, 1);
        
        uv = aTextCoord;
        norm = mat3(uModel) * aNormal;
        fragPos = (uModel * vec4(aVertexPos, 1)).xyz;
    }
    `,
    fragment: `#version 300 es
    precision highp float;

    #define MAX_LIGHTS 32
    struct Light {
        vec3 position;
        vec3 color;
        float intensity;
    };

    in vec2 uv;
    in vec3 norm;
    in vec3 fragPos;
    
    uniform vec4 uBaseColor;
    uniform vec4 uEmissiveFactor;
    uniform float uShininess;
    uniform vec3 uSpecularColor;

    uniform sampler2D uBaseTexture;
    uniform sampler2D uNormalTexture;
    uniform sampler2D uMetallicRoughnessTexture;
    uniform sampler2D uEmissiveTexture;

    uniform vec4 uHasTextures; // Base, Normal, Metallic/Roughness, Emissive
    uniform vec4 uCombineLayers; // Ambient, Diffuse, Spectacular, Emissive

    uniform vec4 uViewPos;
    uniform Light uLights[MAX_LIGHTS];
    uniform float uLightCount;


    out vec4 glColor;
    
    vec4 baseColor;
    vec3 normal;
    vec3 viewDir;
    float metallic = 0.0;
    float roughness = 0.0;
    float specularStrength = 1.0;
    vec4 emissive = vec4(0);
    
    
    vec4 calcDirectLight(vec3 direction, float intensity) {
        vec3 lightDir = normalize(-direction);
        float diff = max(dot(normal, lightDir), 0.0);
        vec3 reflectDir = reflect(-lightDir, normal);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), uShininess);
        vec4 ambient = vec4(0);
        vec4 diffuse = diff * baseColor * intensity;
        vec4 specular = vec4(spec * uSpecularColor, 1.0);
        return (ambient + diffuse + specular);
    }

    vec4 calcPointLight(vec3 position, vec3 color, float intensity) {
        vec3 lightDir = normalize(position - fragPos);
        float diff = max(dot(normal, lightDir), 0.0);
        vec3 reflectDir = reflect(-lightDir, normal);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), uShininess);
        /* float distance = length(position - fragPos);
        float attenuation = 1.0 / (light.constant + light.linear * distance + 
  			     light.quadratic * (distance * distance)); */
        vec4 ambient = vec4(0);
        vec4 diffuse = diff * baseColor * intensity;
        vec4 specular = vec4(spec * uSpecularColor, 1.0);
        return (ambient + diffuse + specular);
    }

    void main() { 
        baseColor = uBaseColor;
        normal = norm;
        viewDir = normalize(uViewPos.xyz - fragPos);

        // use values if given
        if (uHasTextures[0] > 0.0) baseColor = texture(uBaseTexture, uv);
        if (uHasTextures[1] > 0.0) normal = texture(uNormalTexture, uv).rgb;
        if (uHasTextures[2] > 0.0) roughness = texture(uMetallicRoughnessTexture, uv).g;
        if (uHasTextures[2] > 0.0) metallic = texture(uMetallicRoughnessTexture, uv).b;
        if (uHasTextures[3] > 0.0) emissive = texture(uEmissiveTexture, uv);


        // transform normal vector to range [-1,1]
        normal = normalize(normal * 2.0 - 1.0);   
        
        // calc colors
        vec4 result = vec4(0);

        // Sun
        result += calcDirectLight(vec3(0,1,0), 3.0);

        // point lights
        for (int i = 0; i < int(uLightCount); i++)
            result += calcPointLight(uLights[i].position, uLights[i].color, uLights[i].intensity);
        
        glColor = result;
    }
    `,
};

/* 
        

        // diffuse calcs
        float diff = max(dot(normal, lightDir), 0.0);
        vec4 diffuse = vec4(diff * lightColor * lightIntensity, 1.0) * baseColor;

        // specular calcs
        vec3 viewDir = normalize(uViewPos.xyz - fragPos);
        vec3 reflectDir = reflect(-lightDir, normal); 
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), uShininess);
        vec4 specular = vec4(specularStrength * spec * lightColor, 1.0);

        // ambient lighting
        vec4 ambient = vec4(0.0);

        // add glow
        if (uEmissiveFactor.rgb != vec3(0)) emissive *= uEmissiveFactor;

        // combine
        if (uCombineLayers[0] > 0.0) glColor += ambient;
        if (uCombineLayers[1] > 0.0) glColor += diffuse;
        if (uCombineLayers[2] > 0.0) glColor += specular;
        if (uCombineLayers[3] > 0.0) glColor += emissive; 
        */
