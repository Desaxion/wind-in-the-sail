
window.onload = async function () {
    // Get the WebGL context
    var canvas = document.getElementById('drawing-board');
    var gl = canvas.getContext('webgl2');



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
        gl.viewport(0,0,canvas.width,canvas.height);
    };
    
    if (!gl) {
        console.error('Unable to initialize WebGL. Your browser may not support it.');
        return;
    }


    let shaderProgram = new Shader(gl,vsSource,fsSource);
   // shaderProgram.use();

    let waterShader = new Shader(gl,waterVs,waterFs);

    // This is done asynchronously. Create maybe a callback/asynchrounus awaiting before generating new modelbuffers for the new shader.
    //sailboat.generateModelBuffers(shaderProgram)

            // Model testing
            let sailboat = new Model(sailboatModel,sailboatMaterial,sailboatPath,shaderProgram,gl);
            let water = new Model(waterModel,waterMaterial,waterPath,waterShader,gl);
            //console.log(model);

    console.log("waiting")
    await Model.generateAllModelBuffers();
    console.log("waiting done")
    console.log(Model.instances);
    //water.generateModelBuffers(shaderProgram)

    let cameraPosition = [7.549899324160266, 4.284099232217267, -4.21521220860347]//[0, 0, 2];
    let cameraOrientation = [0, 0, -1];
    let cameraTarget = [0, 0, 0];
    const firstPersonMode = false;
    let camera = new Camera(cameraPosition, cameraOrientation, cameraTarget, firstPersonMode);

    camera.initializeEventListeners(canvas);

    // Set camera position and suc

    gl.enable(gl.DEPTH_TEST);

    // Set clear color and clear the canvas
    gl.clearColor(0.95, 0.75, 0.6, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.viewport(0,0,canvas.width,canvas.height);
    // Function to render the frame
        var index = 0;
       
        // MAIN RENDERING LOOP //
        function render() {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            // Set up matrices

            var time = performance.now() * 0.001; // Get time in seconds

            // Set variables to the shaders
            shaderProgram.use()
            camera.matrix(fov,near,far,canvas.width,canvas.height,shaderProgram);
            shaderProgram.setBool('normalVisualizer', normalToggler);
            sailboat.draw();

            waterShader.use()
            camera.matrix(fov,near,far,canvas.width,canvas.height,waterShader);
            waterShader.setFloat('frame', index);
            waterShader.setBool('normalVisualizer',  normalToggler);
            water.draw();
     
            index++;

            window.onresize = onWindowResize;
            // Clear the canvas
            // Request the next animation frame
            requestAnimationFrame(render);
        }
    
        // Start the rendering loop
    render();
};

