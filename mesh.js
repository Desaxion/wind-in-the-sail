class Mesh {
    constructor(inVertices,  inVertexNormals, inTexCoords, faces, globalIndex, material, context){
        this.faces = [];
        this.globalIndex = globalIndex;
        // We create material (diffuse texture in this case);
        this.material = material;
      
        this.texture = null;
        this.context = context;
        // We create a vertex group:           
        let count = 0; // Used for debugging the faces
        faces.forEach((face) => {
            
            let vertices = [];
            let vertexNormals = [];
            let texCoords = [];

            face.forEach((vertexAttributeGroup) =>{
                vertices.push(inVertices[vertexAttributeGroup.vertexIndex]);
                vertexNormals.push(inVertexNormals[vertexAttributeGroup.vertexNormalIndex]);
                texCoords.push(inTexCoords[vertexAttributeGroup.texCoordIndex]);
            });
            this.faces.push(new Face(vertices,vertexNormals,texCoords,this.context,count));
            count++;
        });
    }
    async generateMeshBuffers(shaderProgram){
        return new Promise((resolve) =>{

        this.faces.forEach(async (faceObject) =>{
           await faceObject.generateFaceBuffer(shaderProgram);
        })
        /*for(let i = 0; i < this.faces.length; i++){
            this.faces[i].generateFaceBuffer(shaderProgram);
        }*/
        


            // Generate the textures
            this.texture = this.context.createTexture();
            this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
            // Set texture parameters
            this.context.texParameterf(this.context.TEXTURE_2D, this.context.TEXTURE_WRAP_S, this.context.MIRRORED_REPEAT);
            this.context.texParameterf(this.context.TEXTURE_2D, this.context.TEXTURE_WRAP_T, this.context.MIRRORED_REPEAT);
            this.context.texParameterf(this.context.TEXTURE_2D, this.context.TEXTURE_MIN_FILTER, this.context.NEAREST);
            this.context.texParameterf(this.context.TEXTURE_2D, this.context.TEXTURE_MAG_FILTER, this.context.NEAREST);
            


            this.context.bindBuffer(this.context.PIXEL_UNPACK_BUFFER, null);

            // this.context.texImage2D(this.context.TEXTURE_2D, 0, this.context.RGBA, imageMaterial.width, imageMaterial.height, 0, this.context.RGBA, this.context.UNSIGNED_BYTE, imageMaterial);
            this.context.texImage2D(this.context.TEXTURE_2D, 0, this.context.RGBA, 1, 1, 0, this.context.RGBA, this.context.UNSIGNED_BYTE, new Uint8Array([0,0,255,255]));

            this.context.activeTexture(this.context.TEXTURE0 + this.globalIndex);
            this.context.bindTexture(this.context.TEXTURE_2D, this.texture);

            const texLocation = this.context.getUniformLocation(shaderProgram.shaderProgram,'uTexture');
            this.context.uniform1i(texLocation,this.globalIndex);


            let imageMaterial = new Image()
            imageMaterial.src = this.material;
            // Add the texture once its loaded
            imageMaterial.addEventListener('load', () => {
                //console.log("image loaded: ", imageMaterial);
                this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
                //this.context.texImage2D(this.context.TEXTURE_2D, 0, this.context.RGBA, imageMaterial.width, imageMaterial.height, 0, this.context.RGBA, this.context.UNSIGNED_BYTE, imageMaterial);
                this.context.texImage2D(this.context.TEXTURE_2D, 0, this.context.RGBA, imageMaterial.width, imageMaterial.height, 0, this.context.RGBA, this.context.UNSIGNED_BYTE, imageMaterial);
                this.context.generateMipmap(this.context.TEXTURE_2D);
                //console.log(this.texture);
            })
            resolve();
        })
    }

    draw(shaderProgram){
        // Here we bind the correct texture before we draw
        // console.log()
        this.context.activeTexture(this.context.TEXTURE0 + this.globalIndex);
        this.context.bindTexture(this.context.TEXTURE_2D, this.texture);

        const texLocation = this.context.getUniformLocation(shaderProgram.shaderProgram,'uTexture');
        this.context.uniform1i(texLocation,this.globalIndex);
        this.faces.forEach((face)=>{face.draw(shaderProgram)})

        this.context.bindTexture(this.context.TEXTURE_2D, null);
        this.context.activeTexture(this.context.TEXTURE0); 
    }
}