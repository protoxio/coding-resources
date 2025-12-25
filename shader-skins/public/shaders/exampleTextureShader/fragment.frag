uniform float uTime;
uniform vec3 uResolution;
uniform sampler2D uChannel0;

varying vec2 vUv;

void main() {
    vec2 uv = mod(vUv + uTime, 1.);
    gl_FragColor = texture(uChannel0, uv);
}
