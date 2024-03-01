class Model {
    constructor(objString){
        // String handling
        let meshes = objString.split('o ');
        let index = 0;
        this.meshes = [];
        meshes.forEach((mesh)=>{ 
            let vertices = [];
            let texCoords = [];
            let vertexNormals = [];
            let faces = [];
            let lines = mesh.split("\n");
            // Should also read the material file?
            lines.forEach((line) => {
                if(line.startsWith("#") || line.length === 0) {
                return;
                }
                // Create a mesh and push all items
                else if(line.startsWith("v ")){
                    let tempVert = line.split(' ');              
                    vertices.push(vec3.fromValues(tempVert[1],tempVert[2],tempVert[3]));
                    //console.log(vertices)
                }
                else if(line.startsWith("vt ")){
                    let tempTexCoords = line.split(' ');              
                    texCoords.push(vec2.fromValues(tempTexCoords[1],tempTexCoords[2]));
                    //console.log(texCoords)
                }
                else if(line.startsWith("vn ")){
                    let tempNormals = line.split(' ');              
                    vertexNormals.push(vec3.fromValues(tempNormals[1],tempNormals[2],tempNormals[3]));
                    //console.log(vertexNormals)
                }
                else if(line.startsWith("f ")){
                let tempFaces = line.split(' ');
                let tempFaceIndices = tempFaces.slice(1,tempFaces.length);
                let thisFaceIndices = [];

                tempFaceIndices.forEach((faceIndex) => {
                        let values = faceIndex.split("/");
                        thisFaceIndices.push({vertexIndex:values[0],texCoordIndex:values[1],vertexNormalIndex:values[2]});
                })
                faces.push(thisFaceIndices);
                }
                //read material
                else {
                    return;
                }
                
            });
            index++;
            this.meshes.push({vertices: vertices, texCoords: texCoords, vertexNormals: vertexNormals, faces: faces});
        });

        // Remove the first line as it is empty
        this.meshes = this.meshes.slice(1,this.meshes.length);

    }

    generateModelBuffers(context,shaderProgram){
     // Assuming you have a WebGLRenderingContext context

        this.meshes.forEach((mesh) =>{
        // 1. Create Buffers
        const vertexBuffer = context.createBuffer();
        const normalBuffer = context.createBuffer();
        const texCoordBuffer = context.createBuffer();

        // 2. Populate Buffers
        context.bindBuffer(context.ARRAY_BUFFER, vertexBuffer);
        context.bufferData(context.ARRAY_BUFFER, flattenArray(mesh.vertices), context.STATIC_DRAW);

        context.bindBuffer(context.ARRAY_BUFFER, normalBuffer);
        context.bufferData(context.ARRAY_BUFFER, flattenArray(mesh.vertexNormals), context.STATIC_DRAW);

        context.bindBuffer(context.ARRAY_BUFFER, texCoordBuffer);
        context.bufferData(context.ARRAY_BUFFER, flattenArray(mesh.texCoords), context.STATIC_DRAW);

        // 3. Bind Buffers
        context.bindBuffer(context.ARRAY_BUFFER, vertexBuffer);
        const vertexPosition = context.getAttribLocation(shaderProgram, "aVertexPosition");
        context.vertexAttribPointer(vertexPosition, 3, context.FLOAT, false, 0, 0);
        context.enableVertexAttribArray(vertexPosition);

        context.bindBuffer(context.ARRAY_BUFFER, normalBuffer);
        const vertexNormal = context.getAttribLocation(shaderProgram, "aVertexNormal");
        context.vertexAttribPointer(vertexNormal, 3, context.FLOAT, false, 0, 0);
        context.enableVertexAttribArray(vertexNormal);

        context.bindBuffer(context.ARRAY_BUFFER, texCoordBuffer);
        const texCoord = context.getAttribLocation(shaderProgram, "aTexCoord");
        context.vertexAttribPointer(texCoord, 2, context.FLOAT, false, 0, 0);
        context.enableVertexAttribArray(texCoord);
    });


    }

}