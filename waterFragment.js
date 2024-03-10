    // Default Fragment shader program
    var waterFs = `
        precision mediump float; // We need to define the precision in the fragment shader
        uniform vec3 color;

        uniform sampler2D uTexture;
        uniform int normalVisualizer;
        uniform float frame;

        varying vec3 vNormal;
        varying vec2 vTexCoord;
        varying vec4 vPosition;

        const float timeCoeff = 0.05;


        const float coeff = 200.0;
        const float coeff2 = 5.0;

        float aboveLimit(float value, float limit) {
            return (value > limit) ? 1.0 : 0.0;
        }
        

        void main(void) {
            if(normalVisualizer == 1){
                gl_FragColor = vec4(vNormal.x,vNormal.y,vNormal.z,1.0);
            }else {
                // Generate a grid to make voronoi noise
                vec2 rnd = fract(sin(vTexCoord) * 100000.0);
                float rndRadius = sin(frame*timeCoeff);

                float gridX = aboveLimit(sin(vTexCoord.x * coeff + rndRadius*cos(rnd.x * coeff2)),0.99);
                float gridY = aboveLimit(sin(vTexCoord.y * coeff + rndRadius*cos(rnd.y * coeff2)),0.99);

                // Generate points based of grid
                vec2 pointCoords = vec2(gridX,gridY);

                // Generating random number using truncated trigonometric numbers
          

                // Displace points a little
                //pointCoords += rnd*coeff2;
               
 
                vec2 grid = pointCoords;
                gl_FragColor = vec4(pointCoords,0.0,1.0);//texture2D(uTexture,vTexCoord);
            }

        }
    `;