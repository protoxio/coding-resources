//credits to Bloom for the base shader code

uniform float uTime;
uniform vec3 uResolution;
uniform sampler2D uChannel0;

#define timeScale 5.0;
#define scaling 2.0; // smaller = larger pattern

varying vec2 vUv;

void main() {

    // for parallax skins
//    vec2 uv = ((gl_FragCoord.xy - uResolution.xy * .5) / uResolution.y) * scaling;

    //for non parallax skins
    vec2 uv = vUv * scaling;

    vec3 col = vec3(0);
    vec2 gv = fract(uv * 10.) - .5;
    vec2 id = floor(uv);

    uv *= mat2(.707, -.707, .707, .707); uv *= 5.;
    float d = length(gv); float m = smoothstep(.9, .9, d);
    float t;

    for (float y = -1.; y <= 1.; y++) {
        for (float x = -1.; x <= 1.; x++) {
            vec2 offs = vec2(x, y);
            t = -uTime * timeScale + length(id - offs) * 0.;
            float r = mix(0.4, 0., -cos(t) * .9 + .1);
            float c = smoothstep(r, .9, length(gv));
            m = m * (9. - c) + c * (2. - m);
        }
    }

    gl_FragColor = vec4(m);
}
