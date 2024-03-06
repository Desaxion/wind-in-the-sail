class Mesh {
    constructor(inVertices,  inVertexNormals, inTexCoords, faces,  indices,context){
        this.faces = [];
        // We create a vertex group:           
        let count = 0; // Used for debugging the faces
        faces.forEach((face) => {
            this.context = context;
            let vertices = [];
            let vertexNormals = [];
            let texCoords = [];
            /*console.log(inVertices.length);
            console.log(inVertexNormals.length);
            console.log(inTexCoords.length);*/

            face.forEach((vertexAttributeGroup) =>{
                //vertexGroup.push({vertex: inVertices[vertexAttributeGroup.vertexIndex],vertexNomal: vertexNormals[vertexAttributeGroup.vertexNormalIndex], texCoords: texCoords[vertexAttributeGroup.texCoordIndex]});
                vertices.push(inVertices[vertexAttributeGroup.vertexIndex]);
                vertexNormals.push(inVertexNormals[vertexAttributeGroup.vertexNormalIndex]);
                texCoords.push(inTexCoords[vertexAttributeGroup.texCoordIndex]);
                //console.log(vertexAttributeGroup);
            });
            this.faces.push(new Face(vertices,vertexNormals,texCoords,this.context,count));
            count++;
        });


    }
    generateMeshBuffers(shaderProgram){
    this.faces.forEach((faceObject) =>{
        faceObject.generateFaceBuffer(shaderProgram);
    })

   
    }

    draw(){
        this.faces.forEach((face)=>{face.draw()})
    }
}