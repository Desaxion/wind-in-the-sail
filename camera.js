class Camera {

    constructor(pos,dir,target,firstPerson){
        this.position = pos;
        this.orientation = dir;
        let tempUp = vec3.create();
        vec3.set(tempUp,0,1,0);
        this.up = tempUp;
        this.right = vec3.normalize(vec3.create(),vec3.cross(vec3.create(),this.orientation,this.up));
        this.radius = vec3.length(this.position);
        this.firstPerson = firstPerson; 
        if(!firstPerson){
            this.target = target;
        }
    }

    matrix(FOVdeg,near,far,width,height,shader){
        let view = mat4.create();
        let projection = mat4.create();

        let cameraMatrix = mat4.create();
        // Setting the cameras view matrix
        let lookTarget = [0,2,0]//vec3.create();
        if(this.firstPerson){
            vec3.add(lookTarget,this.position,this.orientation);
        } else {
            vec3.add(lookTarget,lookTarget,this.target);
        }
        mat4.lookAt(view,this.position,lookTarget,this.up);
        mat4.perspective(projection, FOVdeg, width / height, near,far);

        mat4.multiply(cameraMatrix,projection,view);
        shader.setMat4('cameraMatrix',cameraMatrix);
    }

    // Set orientation is very buggy?
    setOrientation(angleX,angleY){
        const sensitivity = 0.1;
        // The coordinate difference in the x space means rotation around Y axis
        let rotX = angleY * sensitivity;
        // The coordinate difference in the y space means rotation around X axis
        let rotY = angleX * sensitivity;

        let rotationXMatrix = mat4.create();
        let rotationYMatrix = mat4.create();
        let totalRotation = mat4.create();

        const xAxis = [1,0,0];
        const yAxis = [0,1,0];

        mat4.fromRotation(rotationXMatrix, glMatrix.toRadian(-rotX),xAxis);
        mat4.fromRotation(rotationYMatrix, glMatrix.toRadian(-rotY),yAxis);

        mat4.multiply(totalRotation,rotationYMatrix,rotationXMatrix);

        this.orientation = vec3.transformMat4(vec3.create(),this.orientation,totalRotation);
        //this.up = vec3.transformMat4(vec3.create(),this.up,totalRotation);
    }

    setSphericalPosition(angleX,angleY){
        const scale = 0.01;

        // First we need to find the angles that already exist.
        let currentAngleY = Math.acos(this.position[1]/vec3.length(this.position));
        let currentAngleX = Math.atan2(this.position[2],this.position[0]);

        let newAngleX = currentAngleX + scale*angleX;
        let newAngleY = currentAngleY - scale*angleY;

       

        this.position[0] = this.radius * Math.sin(newAngleY) * Math.cos(newAngleX);
        this.position[1] = this.radius * Math.cos(newAngleY);
        this.position[2] = this.radius * Math.sin(newAngleY) * Math.sin(newAngleX);
    }

R
    initializeEventListeners(canvas){
        var firstclick = true;
        var mouseInitialPosition ;
        var prevPos;
        let drawingBoard = document.getElementById('drawing-board');
        drawingBoard.style.cursor = 'grab';
        // var button; // Use this to check if we click the scroll button. ===0 means leftclick, ===1 means scroll button
        canvas.addEventListener('mousedown', (event) => {
            if(firstclick){
                firstclick = false;
                mouseInitialPosition = {x:event.clientX,y:event.clientY};
                prevPos = mouseInitialPosition;
                drawingBoard.style.cursor = 'grabbing';
                //button = event.button;
            }  
            
        });
        canvas.addEventListener('mousemove', (event) => {
            if(!firstclick){
                let difference = {x: event.clientX - prevPos.x, y: event.clientY- prevPos.y}
                if(this.firstPerson){
                    this.setOrientation(difference.x,difference.y);
                } else{
                    this.setSphericalPosition(difference.x,difference.y);
                }
                prevPos = {x:event.clientX,y:event.clientY};
            }
        ;})
        canvas.addEventListener('mouseup', (event) => {
            firstclick = true;
            drawingBoard.style.cursor = 'grab';
        });
        document.addEventListener('wheel', (event) => {
            //scrollDifference = currentScroll - window.scrollY;
            const coeff = 0.005;
            let scrollDifference = event.deltaY;
            let addition = coeff*scrollDifference;
            this.radius += addition;
            this.setSphericalPosition(0,0);
        })
    }
}