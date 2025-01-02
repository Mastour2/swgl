const data = new Float32Array([
    [-0.5, 0.5],
    [-0.5, -0.5],
    [0.5, -0.5],
].flat())


const vertex = `#version 300 es
layout(location = 0) in vec2 aPos;

void main() {
    gl_Position = vec4(aPos, 0, 1);
    gl_PointSize = 2.0;
}
`

const fragment = `#version 300 es
precision mediump float;

out vec4 fragColor;

void main() {
    fragColor = vec4(1);
}
`

export {
    vertex, fragment, data
}
