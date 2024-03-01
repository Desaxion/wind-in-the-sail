


window.onload = function () {


    // Model testing
    let model = new Model(modelString);
    console.log(model);


    // Get the WebGL context
    var canvas = document.getElementById('drawing-board');
    var gl = canvas.getContext('webgl2');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const toDegrees = 180 / Math.PI;
    const near = 0.1;
    const far = 10;
    const fov = 70;

    // Add a resize eventlistener
    function onWindowResize() {
        canvas.width = window.innerWidth;   
        canvas.height = window.innerHeight;
    };
    
    if (!gl) {
        console.error('Unable to initialize WebGL. Your browser may not support it.');
        return;
    }


    let shaderProgram = new Shader(gl,vsSource,fsSource);
    shaderProgram.use();

    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    var vertices = new Float32Array([
    -0.5, -0.5, 0, 1,   // Position
     0, 0, 1,           // Normal
     0, 0,              // TexCoord

     0.5, -0.5, 0, 1,    // Position
     0, 0, 1,           // Normal
     1, 0,              // TexCoord

     0.5, 0.5, 0, 1,     // Position
     0, 0, 1,           // Normal
     1, 1,              // TexCoord

    -0.5, 0.5, 0, 1,    // Position
     0, 0, 1,           // Normal
     0, 1               // TexCoord
]);

var vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

var stride = 9 * Float32Array.BYTES_PER_ELEMENT;

shaderProgram.setAttribArray('aPosition');
attributeLocationPosition = gl.getAttribLocation(shaderProgram.shaderProgram, 'aPosition');
gl.vertexAttribPointer(attributeLocationPosition, 4, gl.FLOAT, false, stride, 0);
gl.enableVertexAttribArray(attributeLocationPosition);

shaderProgram.setAttribArray('aNormal');
attributeLocationNormal = gl.getAttribLocation(shaderProgram.shaderProgram, 'aNormal');
gl.vertexAttribPointer(attributeLocationNormal, 3, gl.FLOAT, false, stride, 4 * Float32Array.BYTES_PER_ELEMENT);
gl.enableVertexAttribArray(attributeLocationNormal);

shaderProgram.setAttribArray('aTexCoord');
attributeLocationTexCoord = gl.getAttribLocation(shaderProgram.shaderProgram, 'aTexCoord');
gl.vertexAttribPointer(attributeLocationTexCoord, 2, gl.FLOAT, false, stride, 7 * Float32Array.BYTES_PER_ELEMENT);
gl.enableVertexAttribArray(attributeLocationTexCoord);


    let cameraPosition = [0, 0, 2];
    let cameraOrientation = [0, 0, -1];
    let cameraTarget = [0, 0, 0];
    const firstPersonMode = false;
    let camera = new Camera(cameraPosition, cameraOrientation, cameraTarget, firstPersonMode);

    camera.initializeEventListeners(canvas);

    // Set clear color and clear the canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.viewport(0,0,canvas.width,canvas.height);
    // Function to render the frame
        var index = 0;
        var sendingColor = vec3.create();
       
        // MAIN RENDERING LOOP //
        function render() {
            // Set up matrices

            var time = performance.now() * 0.001; // Get time in seconds

            camera.matrix(fov,near,far,canvas.width,canvas.height,shaderProgram);

            index++;

            vec3.set(sendingColor,Math.sin(index/50),Math.cos(index/50),0.5);
            
            shaderProgram.setVec3('color',sendingColor);
            window.onresize = onWindowResize;
            // Clear the canvas
            gl.clear(gl.COLOR_BUFFER_BIT);
            shaderProgram.use();

            // Draw the red box
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    
            // Request the next animation frame
            requestAnimationFrame(render);
        }
    
        // Start the rendering loop
    render();
};

