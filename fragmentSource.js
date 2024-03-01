    // Default Fragment shader program
    var fsSource = `
        precision mediump float; // We need to define the precision in the fragment shader
        uniform vec3 color;

        varying vec3 vNormal;
        varying vec2 vTexCoord;

        void main(void) {
            gl_FragColor = vec4(vNormal.x,vNormal.y,vNormal.z,1.0);//vec4(color.x,color.y,color.z, 1.0);
        }
    `;