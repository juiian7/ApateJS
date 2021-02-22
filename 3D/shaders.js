// shaders.js

const vertexShader = `#version 300 es

//layout(location = 0) in vec3 aVertexPosition;

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec2 aVertexText;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

out vec3 vNormal;
out vec4 vColor;
out vec2 vTextCoord;

void main() {
    gl_Position = uProjection * uView * uModel * vec4(aVertexPosition, 0.9);
    
    vNormal = ( uView * uModel * vec4(aVertexNormal,0)).xyz;

    vColor = vec4(aVertexPosition,1);
    vTextCoord = aVertexText;
}`;

const fragmentShader = `#version 300 es

precision mediump float;

in vec3 vNormal;
in vec4 vColor;
in vec2 vTextCoord;

uniform sampler2D uTexture;

out vec4 fragColor;

void main() {

    float lightStrenght = 0.8f;
    vec3 lightDirection = vec3(0,0,1);

    vec3 diffuseColor = texture(uTexture, vTextCoord).xyz; // vColor.rgb;
    vec3 ambientColor = vec3(0.1,0.1,0.1) * diffuseColor;

    vec3 lightColor = vec3(1,1,1);

    vec3 normal = normalize(vNormal);
    float cosTheta = dot(normal, lightDirection);
   
    
    fragColor = vec4( ambientColor + diffuseColor * lightColor * lightStrenght * cosTheta , 1 );

    //fragColor = texture(uTexture, vTextCoord);
    //fragColor.rgb *= light;

    //fragColor = vec4(1,0,0,1);
}`;
