class Model {

    static NumberOfModels = 0;
    static NumberOfMaterials = 0;
    static NumberOfMeshes = 0;

    constructor(objString,mtlString,materialPath,context){
        // String handling
        let meshes = objString.split('o ');
        let index = 0;
        this.meshes = [];
        //this.index = NumberOfModels;
        let materials = new Map();


        
        // Do some offsetting using the lengths of each vertex and Such
        let vertIndexOffset = 1;
        let normIndexOffset = 1;
        let texIndexOffset = 1;

        // Set up all materials
        let materialLines = mtlString.split('\n');


        // Read each line of the material file
        for(let i = 0; i < materialLines.length; i++){
            if(materialLines[i].startsWith('newmtl none')) continue;
            else if(materialLines[i].startsWith('newmtl')){
                let tempMatName = materialLines[i].split(' ');
                let matName = tempMatName[1];
                // The next index contains the texture
                let tempTexture = materialLines[i + 1].split(' ');
                // tempText[0] holds the type, this case its a diffuse map
                let filePath = materialPath + tempTexture[1];
                materials.set(matName,filePath);
            }
        }

        meshes.forEach((mesh)=>{ 
            let vertices = [];
            let texCoords = [];
            let vertexNormals = [];
            let faces = [];
            let lines = mesh.split("\n");
            let indices = 0; // Figure this out
            let material;//new Image();

            lines.forEach((line) => {
                if(line.startsWith("#") || line.length === 0) {
                return;
                }
                // Add functionality for reading material file
                // Create a mesh and push all items
                else if(line.startsWith("v ")){
                    let tempVert = line.split(' ');              
                    vertices.push(vec3.fromValues(tempVert[1],tempVert[2],tempVert[3]));

                }
                else if(line.startsWith("vt ")){
                    let tempTexCoords = line.split(' ');              
                    texCoords.push(vec2.fromValues(tempTexCoords[1] ,1.0 - tempTexCoords[2])); // flipping the coords correctly

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
                else if(line.startsWith("usemtl ")){
                    let tempMat = line.split(' ')[1];
                    material = materials.get(tempMat);
                }
                else {
                    return;
                }

            });

            index++;
            //console.log(material)
            this.meshes.push(new Mesh(vertices,  vertexNormals,texCoords, faces, Model.NumberOfMeshes, material, context));
            vertIndexOffset = vertIndexOffset + vertices.length;
            normIndexOffset = normIndexOffset + vertexNormals.length;
            texIndexOffset = texIndexOffset + texCoords.length;
            Model.NumberOfMeshes++;
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

    draw(shaderProgram){
        this.meshes.forEach((mesh) =>{
            mesh.draw(shaderProgram)
        });
    }

}