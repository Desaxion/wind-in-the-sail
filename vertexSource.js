    // Default Vertex shader program
    var vsSource = `
        attribute vec4 aVertexPosition;
        //uniform mat4 uModelViewMatrix;
        //uniform mat4 uProjectionMatrix;

        uniform mat4 cameraMatrix;

        void main(void) {
            gl_Position = cameraMatrix * aVertexPosition;
        }
    `;