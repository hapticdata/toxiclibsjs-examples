//#Mesh Align-to-Axis
//This example uses toxiclibs.js directly with WebGL and no other libraries.
//It shows how to dynamically create a simple box mesh and align it
//with a given direction vector using the `pointTowards()` method of the
//`toxi.geom.mesh.TriangleMesh` class.

//the glsl shaders
var shaders = {
    vertex: [
        "attribute vec3 aVertexPosition;",
        "attribute vec4 aVertexColor;",
        "uniform mat4 uMVMatrix;",
        "uniform mat4 uPMatrix;",
        "varying vec4 vColor;",
        "void main(void) {",
            "gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);",
            "vColor = aVertexColor;",
        "}"
    ].join('\n'),
    frag: [
        "#ifdef GL_ES",
        "precision highp float;",
        "#endif",
        "varying vec4 vColor;",
        "void main(void) {",
            "gl_FragColor = vColor;",
        "}"
    ].join('\n')
};

window.onload = init;
var canvas, gl;

var TWO_PI = Math.PI * 2;
var BOX_SIZE = new toxi.geom.Vec3D(0.05,0.05,0.5),
    NUM_BOXES = 250,
    //(6 sides * 6 vertices * 3 floats)
    N_PER_BOX = 6 * 6 * 3,
    SCALE= 2,
    lastTime = 0,
    rotBoxes = 0;

var shaderProgram;
//our Model-view matrix
var mvMatrix = new toxi.geom.Matrix4x4(),
    mvMatrixStack = [],
    //our projection matrix
    pMatrix = new toxi.geom.Matrix4x4(),
    //holders for the applied matrice array's
    pM = new Float32Array(16),
    mv = new Float32Array(16);

var boxesVertexPositionBuffer;
var boxesVertexColorBuffer;
var isOver = false;
var rotation = new toxi.geom.Vec3D();


function mouseOver(){
    isOver = true;
}
function mouseOut() {
    isOver = false;
}

function mouseMove(e){
    if(isOver){
        var mouse = {
            x: e.pageX - canvas.offsetLeft,
            y: e.pageY - canvas.offsetTop
        };

        rotation.set({
            x: mouse.x * 0.005,
            y: mouse.y * 0.005,
            z: 0
        });
    }
}

function init() {
    canvas = document.getElementById("example");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 60;
    if( window.devicePixelRatio >= 2 ){
        canvas.width *= 2;
        canvas.height *= 2;
        canvas.style.width = "100%";
    }
    canvas.addEventListener('mouseover',mouseOver,false);
    canvas.addEventListener('mouseout',mouseOut,false);
    canvas.addEventListener('mousemove',mouseMove,false);

    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
    initShaders();
    initBuffers();

    gl.clearColor(0.95, 0.95, 0.95, 1.0);
    gl.enable(gl.DEPTH_TEST);

    tick();
}

function createShader( str, type ){
    var shader = gl.createShader( type );
    gl.shaderSource( shader, str );
    gl.compileShader( shader );
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}



function initShaders() {
    var fragmentShader = createShader( shaders.frag, gl.FRAGMENT_SHADER );
    var vertexShader = createShader( shaders.vertex, gl.VERTEX_SHADER );

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialize shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}


function mvPushMatrix() {
    mvMatrixStack.push(mvMatrix.copy());
}

function mvPopMatrix() {
    if (mvMatrixStack.length === 0) {
        throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}


function setMatrixUniforms() {
    //`toxi.geom.Matrix4x4#transpose()` converts the matrix between
    //column-major to row-major (the way that WebGL/OpenGL wants it),
    //by providing `Float32Array`'s we optimize by changing values
    //instead of constructing new objects
    pMatrix.transpose().toArray( pM ),
    mvMatrix.transpose().toArray( mv );
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pM);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mv);
}


function initBuffers() {

    boxesVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxesVertexPositionBuffer);

    //(num of boxes) * (num of sides) * (num of points) * (floats per point [xyz])
    var vertices = new Float32Array(NUM_BOXES * N_PER_BOX);
    var vertIndex = 0;
    var i, dir, pos, b, v;
    for ( i=0; i<NUM_BOXES; i++ ){
        dir = new toxi.geom.Vec3D({
            x: Math.cos(i*TWO_PI/125),
            y: Math.sin(i*TWO_PI/50),
            z: Math.sin(i*TWO_PI/25)
        }).normalize();

        // create a position on a sphere, using the direction vector
        pos = dir.scale(SCALE);
        // create a box mesh at the origin
        b = new toxi.geom.mesh.TriangleMesh("aabb");
        new toxi.geom.AABB(new toxi.geom.Vec3D(), BOX_SIZE).toMesh( b );
        // align the Z axis of the box with the direction vector
        b.pointTowards(dir);
        b.transform(new toxi.geom.Matrix4x4().translateSelf(pos.x,pos.y,pos.z));
        v = new Float32Array(N_PER_BOX);
        b.getMeshAsVertexArray(v,0,3);

        vertices.set(v,vertIndex); //push the shape in
        vertIndex += v.length;

    }

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    boxesVertexPositionBuffer.itemSize = 3;
    boxesVertexPositionBuffer.numItems = 36 * NUM_BOXES;

    boxesVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxesVertexColorBuffer);
    //(num boxes) * (num sides) * (num points for a color [rgba])
    var colors = new Float32Array(NUM_BOXES * 6 * 6 *4);
    var colorIndex = 0; //this is our colors index

    var nf, p, color1, color2, c1Array, c2Array;
    for ( i=0; i<NUM_BOXES; i++ ) {
        for ( nf=0; nf<6; nf++ ) {
            //6 sides per cube (2 faces per side)
            color1 = toxi.color.TColor.newHSV(i/NUM_BOXES,0.5,0.75);
            color2 = color1.copy().darken(0.125); //second face
            c1Array = color1.toRGBAArray();
            c2Array = color2.toRGBAArray();

            for ( p=0; p<3; p++ ) {
                //the first face of the side
                colors.set(c1Array,colorIndex);
                colorIndex += c1Array.length;
            }
            for ( p=0; p<3; p++ ) {
                //the second face of the side
                colors.set(c2Array,colorIndex);
                colorIndex += c2Array.length;
            }
        }
    }

    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    boxesVertexColorBuffer.itemSize = 4;
    boxesVertexColorBuffer.numItems = 36 * NUM_BOXES;


}



function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    pMatrix.setPerspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);

    mvMatrix.identity();
    mvMatrix.translateSelf(0.0, 0.0, -8.0);
    mvPushMatrix();

    var rot = new toxi.geom.Vec3D(0.45,1,0.125)
        .scaleSelf(toxi.math.MathUtils.radians(rotBoxes))
        .addSelf(rotation);

    mvMatrix.rotateX(rot.x)
        .rotateY(rot.y)
        .rotateZ(rot.z);

    gl.bindBuffer(gl.ARRAY_BUFFER, boxesVertexPositionBuffer);
    gl.vertexAttribPointer(
        shaderProgram.vertexPositionAttribute,
        boxesVertexPositionBuffer.itemSize,
        gl.FLOAT,
        false,
        0,
        0
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, boxesVertexColorBuffer);
    gl.vertexAttribPointer(
        shaderProgram.vertexColorAttribute,
        boxesVertexColorBuffer.itemSize,
        gl.FLOAT,
        false,
        0,
        0
    );

    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, boxesVertexPositionBuffer.numItems);

    mvPopMatrix();
}




function animate() {
    var timeNow = new Date().getTime();
    if (lastTime !== 0) {
        var elapsed = timeNow - lastTime;

        rotBoxes += (90 * elapsed) / 8000.0;
    }
    lastTime = timeNow;
}


function tick() {
    webkitRequestAnimationFrame(tick);
    drawScene();
    animate();
}
