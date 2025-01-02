const data = new Float32Array([
    [-0.5, 0.5],
    [-0.5, -0.5],
    [0.5, -0.5],
    [0.5, 0.5],
].flat())


const vertex = `#version 300 es
layout(location = 0) in vec2 aPos;
layout(location = 1) in vec2 aTexCoord;

out vec2 vTexCoord;

void main() {
    vTexCoord = aTexCoord;
    gl_Position = vec4(aPos, 0, 1);
    gl_PointSize = 2.0;
}
`


const fragment = `#version 300 es
precision mediump float;

uniform sampler2D uTex;

in vec2 vTexCoord;

out vec4 fragColor;

void main() {
    vec2 adjust = vec2(0.5 + vTexCoord.x, 0.5 - vTexCoord.y);
    fragColor = texture(uTex, adjust);
}

`


export {
    vertex, fragment, data
}