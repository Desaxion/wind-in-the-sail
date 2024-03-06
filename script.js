window.onload = function () {
    // Get the WebGL context
    var canvas = document.getElementById('drawing-board');
    var gl = canvas.getContext('webgl2');

        // Model testing
        let model = new Model(modelString,gl);
        //console.log(model);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const toDegrees = 180 / Math.PI;
    const near = 0.1;
    const far = 100;
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

    model.generateModelBuffers(shaderProgram)

    let cameraPosition = [7.549899324160266, 4.284099232217267, -4.21521220860347]//[0, 0, 2];
    let cameraOrientation = [0, 0, -1];
    let cameraTarget = [0, 0, 0];
    const firstPersonMode = false;
    let camera = new Camera(cameraPosition, cameraOrientation, cameraTarget, firstPersonMode);

    camera.initializeEventListeners(canvas);

    // Set camera position and suc

    gl.enable(gl.DEPTH_TEST);

    // Set clear color and clear the canvas
    gl.clearColor(0.0, 0.3, 0.3, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.viewport(0,0,canvas.width,canvas.height);
    // Function to render the frame
        var index = 0;
        var sendingColor = vec3.create();
       
        // MAIN RENDERING LOOP //
        function render() {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

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

            model.draw();
            
    
            // Request the next animation frame
            requestAnimationFrame(render);
        }
    
        // Start the rendering loop
    render();
};

