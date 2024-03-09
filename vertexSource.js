    // Default Vertex shader program
    var vsSource = `
        attribute vec4 aPosition;
        attribute vec3 aNormal;
        attribute vec2 aTexCoord;
        //uniform mat4 uModelViewMatrix;
        //uniform mat4 uProjectionMatrix;

        uniform mat4 cameraMatrix;

        varying vec3 vNormal;
        varying vec2 vTexCoord;
        varying vec4 vPosition;

        void main(void) {
            gl_Position = cameraMatrix * aPosition;
            vPosition = aPosition;
            vNormal = aNormal;
            vTexCoord = aTexCoord;
        }
    `;