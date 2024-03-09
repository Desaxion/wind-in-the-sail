    // Default Fragment shader program
    var fsSource = `
        precision mediump float; // We need to define the precision in the fragment shader
        uniform vec3 color;

        uniform sampler2D uTexture;

        varying vec3 vNormal;
        varying vec2 vTexCoord;
        varying vec4 vPosition;

        void main(void) {
            gl_FragColor = texture2D(uTexture,vTexCoord);
        }
    `;