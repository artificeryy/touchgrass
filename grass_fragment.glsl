varying vec2 vUv;
uniform sampler2D grassTexture;

void main() {
    vec3 baseColor = texture2D(grassTexture, vUv).rgb;
    float clarity = (vUv.y * 0.5) + 0.5;
    gl_FragColor = vec4(baseColor * clarity, 1);
}