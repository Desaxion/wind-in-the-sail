class Model {
    constructor(objString,context){
        // String handling
        let meshes = objString.split('o ');
        let index = 0;
        this.meshes = [];
        // Do some offsetting using the lengths of each vertex and Such
        let vertIndexOffset = 1;
        let normIndexOffset = 1;
        let texIndexOffset = 1;

        meshes.forEach((mesh)=>{ 
            let vertices = [];
            let texCoords = [];
            let vertexNormals = [];
            let faces = [];
            let lines = mesh.split("\n");
            let indices = 0; // Figure this out
            lines.forEach((line) => {
                if(line.startsWith("#") || line.length === 0) {
                return;
                }
                // Create a mesh and push all items
                else if(line.startsWith("v ")){
                    let tempVert = line.split(' ');              
                    vertices.push(vec3.fromValues(tempVert[1],tempVert[2],tempVert[3]));

                }
                else if(line.startsWith("vt ")){
                    let tempTexCoords = line.split(' ');              
                    texCoords.push(vec2.fromValues(tempTexCoords[1],tempTexCoords[2]));

                }
                else if(line.startsWith("vn ")){
                    let tempNormals = line.split(' ');              
                    vertexNormals.push(vec3.fromValues(tempNormals[1],tempNormals[2],tempNormals[3]));

                }
                else if(line.startsWith("f ")){
                let tempFaces = line.split(' ');
                let tempFaceIndices = tempFaces.slice(1,tempFaces.length);
                let thisFaceIndices = [];

                tempFaceIndices.forEach((faceIndex) => {
                        let values = faceIndex.split("/");
                        thisFaceIndices.push({vertexIndex:values[0] - vertIndexOffset,texCoordIndex:values[1] - texIndexOffset,vertexNormalIndex:values[2] - normIndexOffset});
                })
                faces.push(thisFaceIndices);
                }
                //read material
                else {
                    return;
                }
                
            });
            index++;




            this.meshes.push(new Mesh(vertices,  vertexNormals,texCoords, faces, indices, context));
            vertIndexOffset = vertIndexOffset + vertices.length;
            normIndexOffset = normIndexOffset + vertexNormals.length;
            texIndexOffset = texIndexOffset + texCoords.length;

        });

        // Remove the first line as it is empty
        this.meshes = this.meshes.slice(1,this.meshes.length);



        this.context = context;
    }

    generateModelBuffers(shaderProgram){
        this.meshes.forEach((mesh) => {
            mesh.generateMeshBuffers(shaderProgram);  
        })
    }

    draw(){
        this.meshes.forEach((mesh) =>{
            mesh.draw()
        });
    }

}