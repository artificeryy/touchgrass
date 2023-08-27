varying vec2 vUv;
uniform sampler2D grassTexture;
uniform sampler2D grassMask;

void main() {
    vec3 maskColor = texture2D( grassMask, vUv).rgb;
    vec3 baseColor = texture2D(grassTexture, vUv).rgb;
    gl_FragColor = vec4(baseColor, 1);
    if (maskColor.r <= 0.5){
        discard;
    }
}