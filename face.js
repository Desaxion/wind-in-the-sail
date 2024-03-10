class Face {
    constructor(vertices,vertexNormals,texCoords,context,count){
        this.vertices = vertices;
        this.vertexNormals = vertexNormals;
        this.texCoords = texCoords;
        this.context = context;
        this.dataStream = null;
        this.count = count;
        this.vao = null;
        this.indices = null;
        this.indexBuffer = null;
    }

    // This function repacks the nice and separated data into a new array that fits with the webgl buffer handling
    rearrangeDataArray(){
        const vertexSize = 4;
        const normalSize = 3;
        const texCoordSize = 2;
        let tempDataStream = [];
        for(let k = 0; k < this.vertices.length; k++ ){
            for(let i = 0; i < vertexSize - 1; i++){
                tempDataStream.push(this.vertices[k][i]);
            }
            tempDataStream.push(1); // Pushing the final "1" in the vertex as it is a vec4

            for(let i = 0; i < normalSize; i++){
                tempDataStream.push(this.vertexNormals[k][i]); // Offsetting index with the size of a vertex
            }
            for(let i = 0; i < texCoordSize; i++){
                tempDataStream.push(this.texCoords[k][i]); // Offsetting index with the size of a vertex and a normal
            }
        }

        this.dataStream = new Float32Array(tempDataStream);

        let stride = vertexSize + normalSize + texCoordSize;
        return stride;
    }

    async generateFaceBuffer(shaderProgram){
        return new Promise((resolve) =>{
        let strideSteps = this.rearrangeDataArray()
        /*We take in: 1 vertex position (3 floats), 1 vertex normal (3 floats), 1 texcoord (2 floats).*/
        // Assuming you already have a valid WebGLRenderingContext and shaderProgram
        // Create a Vertex Array Object (VAO)
        this.vao = this.context.createVertexArray();
        this.context.bindVertexArray(this.vao);

        // Create and set up the vertex buffer
        var vertexBuffer = this.context.createBuffer();
        this.context.bindBuffer(this.context.ARRAY_BUFFER, vertexBuffer);
        this.context.bufferData(this.context.ARRAY_BUFFER, this.dataStream, this.context.STATIC_DRAW);

        var stride = strideSteps * Float32Array.BYTES_PER_ELEMENT;//strideSteps * Float32Array.BYTES_PER_ELEMENT;

        //Define and enable the attribute arrays
        shaderProgram.setAttribArray('aPosition');
        let attributeLocationPosition = this.context.getAttribLocation(shaderProgram.shaderProgram, 'aPosition');
        this.context.vertexAttribPointer(attributeLocationPosition, 4, this.context.FLOAT, false, stride, 0);
        this.context.enableVertexAttribArray(attributeLocationPosition);

        shaderProgram.setAttribArray('aNormal');
        let attributeLocationNormal = this.context.getAttribLocation(shaderProgram.shaderProgram, 'aNormal');
        this.context.vertexAttribPointer(attributeLocationNormal, 3, this.context.FLOAT, false, stride, 4 * Float32Array.BYTES_PER_ELEMENT);
        this.context.enableVertexAttribArray(attributeLocationNormal);
   
        shaderProgram.setAttribArray('aTexCoord');
        let attributeLocationTexCoord = this.context.getAttribLocation(shaderProgram.shaderProgram, 'aTexCoord');
        this.context.vertexAttribPointer(attributeLocationTexCoord, 2, this.context.FLOAT, false, stride, 7 * Float32Array.BYTES_PER_ELEMENT);
        this.context.enableVertexAttribArray(attributeLocationTexCoord);
        




        // Create and set up the index buffer
        if(this.vertices.length == 4){
            this.indices = new Uint16Array([0, 1, 2, 0, 2, 3]); // Indices to form two triangles
        } else{
            this.indices = new Uint16Array([0, 1, 2]);
        }

        // Setting up index buffer
        this.indexBuffer = this.context.createBuffer();
        this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.context.bufferData(this.context.ELEMENT_ARRAY_BUFFER, this.indices, this.context.STATIC_DRAW);

        // Step 5: Unbind the VAO to avoid accidental modification
        this.context.bindVertexArray(null);
        this.context.bindBuffer(this.context.ARRAY_BUFFER, null);
        this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, null);
        resolve();
        })
    }

    draw(shaderProgram){
        shaderProgram.use();
        this.context.bindVertexArray(this.vao);
        this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.context.drawElements(this.context.TRIANGLES, this.indices.length, this.context.UNSIGNED_SHORT, 0);
        this.context.bindVertexArray(null);
        this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, null);
    }
    
}