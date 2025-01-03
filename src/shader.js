const data = new Float32Array([
    [-0.5, 0.5],
    [-0.5, -0.5],
    [0.5, -0.5],
    [0.5, 0.5],
].flat())


const vertex = `#version 300 es
layout(location = 0) in vec2 aPos;
layout(location = 1) in vec4 aColor;

out vec4 vColor;

uniform vec2 uOffset;

void main() {
    vColor = aColor;
    gl_Position = vec4(aPos + uOffset, 0, 1);
    gl_PointSize = 2.0;
}
`


const fragment = `#version 300 es
precision mediump float;

in vec4 vColor;
out vec4 fragColor;

void main() {
    fragColor = vColor;
}
`

export {
    vertex, fragment, data
}
