    // Default Fragment shader program
    var fsSource = `
        precision mediump float; // We need to define the precision in the fragment shader
        uniform vec3 color;

        uniform sampler2D uTexture;
        uniform int normalVisualizer;

        varying vec3 vNormal;
        varying vec2 vTexCoord;
        varying vec4 vPosition;

        void main(void) {
            if(normalVisualizer == 1){
                gl_FragColor = vec4(vNormal.x,vNormal.y,vNormal.z,1.0);
            }else {
                gl_FragColor = texture2D(uTexture,vTexCoord);
            }

        }
    `;