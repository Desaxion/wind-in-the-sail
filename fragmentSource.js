    // Default Fragment shader program
    var fsSource = `
        precision mediump float; // We need to define the precision in the fragment shader
        uniform vec3 color;

        void main(void) {
            gl_FragColor = vec4(color.x,color.y,color.z, 1.0);
        }
    `;