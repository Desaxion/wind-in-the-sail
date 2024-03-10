class Shader {
    static programs = [];
    constructor(context,vertexSource,fragmentSource){
        // Local function for shader compilation

        function compileShader(context,source, type) {
            let shader = context.createShader(type);
            context.shaderSource(shader, source);
            context.compileShader(shader);
    
            if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
                console.error('Error compiling shader:', context.getShaderInfoLog(shader));
                context.deleteShader(shader);
                return null;
            }
    
            return shader;
        }
        
        this.context = context;
        // Compile the source files
        let vertexShader = compileShader(this.context,vertexSource, this.context.VERTEX_SHADER);
        let fragmentShader = compileShader(this.context,fragmentSource, this.context.FRAGMENT_SHADER);
        // Set up links and for the program
        this.shaderProgram = this.context.createProgram();
        this.context.attachShader(this.shaderProgram,vertexShader);
        this.context.attachShader(this.shaderProgram,fragmentShader);
        this.context.linkProgram(this.shaderProgram)

        if (!this.context.getProgramParameter(this.shaderProgram, this.context.LINK_STATUS)) {
            console.error('Unable to initialize the shader program:', this.context.getProgramInfoLog(this.shaderProgram));
            return;
        }
        Shader.programs.push(this);
        return this;
    }

    use(){
        this.context.useProgram(this.shaderProgram);
    }

    setAttribArray(name){
        let positionAttrib = this.context.getAttribLocation(this.shaderProgram, name);
        this.context.vertexAttribPointer(positionAttrib, 3, this.context.FLOAT, false, 0, 0);
        this.context.enableVertexAttribArray(positionAttrib);
    }
    setBool(name,value){
        let location = this.context.getUniformLocation(this.shaderProgram,name);
        this.context.uniform1i(location,value ? 1 : 0);
    }

    setInt(name,value){
        let location = this.context.getUniformLocation(this.shaderProgram,name);
        this.context.uniform1i(location,value);
    }

    setFloat(name,value){
        let location = this.context.getUniformLocation(this.shaderProgram,name);
        this.context.uniform1f(location,value);
    }

    setVec2(name,value){
        let location = this.context.getUniformLocation(this.shaderProgram,name);
        this.context.uniform2fv(location,value);
    }

    setVec3(name,value){
        let location = this.context.getUniformLocation(this.shaderProgram,name);
        this.context.uniform3fv(location,value);
    }

    setVec4(name,value){
        let location = this.context.getUniformLocation(this.shaderProgram,name);
        this.context.uniform4fv(location,value);
    }

    setMat4(name, value){
        let location = this.context.getUniformLocation(this.shaderProgram,name);
        this.context.uniformMatrix4fv(location,false,value);
    }

}