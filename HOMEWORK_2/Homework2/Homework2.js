"use strict";
var gl; 
var canvas;
var program;

// http://localhost:8000/Homework2/Homework2.html 

var projectionMatrix;
var modelViewMatrix;

var instanceMatrix;

var modelViewMatrixLoc;

var fragmentFlagLoc = 0; // 0 Body, 1 Head, 2 Green, 3 Brown (for tree)

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;


var ANIM_flag = false;


//-----------------------------------------------------FIND_CUBE------------------------------------------------------------
var numVertices = 24;
var pointsArray = [];

var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];


function quad(a, b, c, d) {
    pointsArray.push(vertices[a]);
    pointsArray.push(vertices[b]);
    pointsArray.push(vertices[c]);
    pointsArray.push(vertices[d]);
}


function cube(){
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 5, 4, 7, 6 );
    quad( 5, 4, 0, 1 );
}
//-------------------------------------------------------CUBE------------------------------------------------------------









//------------------------------------------------FIND_BEAR DATA-----------------------------------------------------------

var theta = [0, 0, 0, 0, 0, 0, 180, 0, 180, 0, 0];
var bearPosition = [ -5.0, -6.0, 0.0];

//Bear Windth&Height
var torsoHeight = 6.0;
var torsoWidth = 3.0;

var upperArmHeight = 2.5;
var upperArmWidth  = 1.25;

var lowerArmHeight = 1.25;
var lowerArmWidth  = 0.75;

var upperLegHeight = 2.5;
var upperLegWidth  = 1.25;

var lowerLegHeight = 1.25;
var lowerLegWidth  = 0.75;

var headHeight = 1.75;
var headWidth = 1.75;



//Nodes
var torsoId = 0;

var headId  = 1;
var head1Id = 1;
var head2Id = 10;

var leftUpperArmId = 2;
var leftLowerArmId = 3;

var rightUpperArmId = 4;
var rightLowerArmId = 5;

var leftUpperLegId = 6;
var leftLowerLegId = 7;

var rightUpperLegId = 8;
var rightLowerLegId = 9;





var numNodes = 10;
var figure = [];

for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);


//Create Node
function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}
//-------------------------------------------------BEAR DATA-----------------------------------------------------------










//------------------------------------------------FIND_TEXTURE---------------------------------------------------------
var texture;
var bodyTexCoordsArray = [];
var headTexCoordsArray = [];

// body texture
var bodyTexCoord = [
    vec2(1, 0.5),
    vec2(0, 0.5),
    vec2(0, 1),
    vec2(1, 1)
];

function pushBodyTexture(){
    for(var i=0; i<6; i++){
        bodyTexCoordsArray.push(bodyTexCoord[0]);
        bodyTexCoordsArray.push(bodyTexCoord[1]);
        bodyTexCoordsArray.push(bodyTexCoord[2]);
        bodyTexCoordsArray.push(bodyTexCoord[3]);
    }
}



// head texture
var headTexCoord = [
    vec2(0.5, 0),
    vec2(0.5, 0.5),
    vec2(1, 0.5),
    vec2(1, 0)
];


var earTexCoord = [
    vec2(0, 0),
    vec2(0, 0.5),
    vec2(0.5, 0.5),
    vec2(0.5, 0)
];


function pushHeadTexture(){
    // back
    headTexCoordsArray.push(bodyTexCoord[0]);
    headTexCoordsArray.push(bodyTexCoord[1]);
    headTexCoordsArray.push(bodyTexCoord[2]);
    headTexCoordsArray.push(bodyTexCoord[3]);
    //right ear
    headTexCoordsArray.push(earTexCoord[0]);
    headTexCoordsArray.push(earTexCoord[1]);
    headTexCoordsArray.push(earTexCoord[2]);
    headTexCoordsArray.push(earTexCoord[3]);
    // top & down
    for(var i=0; i<2; i++){
        headTexCoordsArray.push(bodyTexCoord[0]);
        headTexCoordsArray.push(bodyTexCoord[1]);
        headTexCoordsArray.push(bodyTexCoord[2]);
        headTexCoordsArray.push(bodyTexCoord[3]);
    }
    // face
    headTexCoordsArray.push(headTexCoord[0]);
    headTexCoordsArray.push(headTexCoord[1]);
    headTexCoordsArray.push(headTexCoord[2]);
    headTexCoordsArray.push(headTexCoord[3]);
    //left ear
    headTexCoordsArray.push(earTexCoord[3]);
    headTexCoordsArray.push(earTexCoord[2]);
    headTexCoordsArray.push(earTexCoord[1]);
    headTexCoordsArray.push(earTexCoord[0]);
}





function configureTexture( image ) {
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.uniform1i(gl.getUniformLocation(program, "uTextureMap"), 0);
}
//---------------------------------------------------TEXTURE---------------------------------------------------------










//----------------------------------------------FIND_INIT NODES--------------------------------------------------------
function initNodes(Id) {

    var m = mat4();

    switch(Id) {



    case torsoId:

    m = translate(bearPosition[xAxis], bearPosition[yAxis], 0.0);

    //Default
    m = mult(m,rotate(90, vec3(0, 0, 1)) );
    m = mult(m,rotate(90, vec3(0, 1, 0)) );
    //Variable
    m = mult(m,rotate(theta[torsoId], vec3(1, 0, 0)) );
    m = mult(m,rotate(psi, vec3(0, 1, 0)) );

    figure[torsoId] = createNode( m, torso, null, headId );
    break;



    case headId:
    case head1Id:
    case head2Id:

    m = translate(0.0, torsoHeight+0.5*headHeight, 0.0);
	m = mult(m, rotate(theta[head1Id], vec3(1, 0, 0)));
	m = mult(m, rotate(theta[head2Id], vec3(0, 1, 0)));
    m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
    figure[headId] = createNode( m, head, leftUpperArmId, null);
    break;



    case leftUpperArmId:

    m = translate(-(0.5*torsoWidth+ 0.5*upperArmWidth), 0.8*torsoHeight, 0.0);
	m = mult(m, rotate(theta[leftUpperArmId], vec3(1, 0, 0)));
    figure[leftUpperArmId] = createNode( m, leftUpperArm, rightUpperArmId, leftLowerArmId );
    break;



    case rightUpperArmId:

    m = translate(0.5*torsoWidth+0.5*upperArmWidth, 0.8*torsoHeight, 0.0);
	m = mult(m, rotate(theta[rightUpperArmId], vec3(1, 0, 0)));
    figure[rightUpperArmId] = createNode( m, rightUpperArm, leftUpperLegId, rightLowerArmId );
    break;



    case leftUpperLegId:

    m = translate(-(0.5*torsoWidth+0.5*upperLegWidth), 0.4*upperLegHeight, 0.0);
	m = mult(m , rotate(theta[leftUpperLegId], vec3(1, 0, 0)));
    figure[leftUpperLegId] = createNode( m, leftUpperLeg, rightUpperLegId, leftLowerLegId );
    break;



    case rightUpperLegId:

    m = translate(0.5*torsoWidth+0.5*upperLegWidth, 0.4*upperLegHeight, 0.0);
	m = mult(m, rotate(theta[rightUpperLegId], vec3(1, 0, 0)));
    figure[rightUpperLegId] = createNode( m, rightUpperLeg, null, rightLowerLegId );
    break;



    case leftLowerArmId:

    m = translate(0.0, upperArmHeight, 0.0);
    m = mult(m, rotate(theta[leftLowerArmId], vec3(1, 0, 0)));
    figure[leftLowerArmId] = createNode( m, leftLowerArm, null, null );
    break;



    case rightLowerArmId:

    m = translate(0.0, upperArmHeight, 0.0);
    m = mult(m, rotate(theta[rightLowerArmId], vec3(1, 0, 0)));
    figure[rightLowerArmId] = createNode( m, rightLowerArm, null, null );
    break;



    case leftLowerLegId:

    m = translate(0.0, upperLegHeight, 0.0);
    m = mult(m, rotate(theta[leftLowerLegId],vec3(1, 0, 0)));
    figure[leftLowerLegId] = createNode( m, leftLowerLeg, null, null );
    break;



    case rightLowerLegId:

    m = translate(0.0, upperLegHeight, 0.0);
    m = mult(m, rotate(theta[rightLowerLegId], vec3(1, 0, 0)));
    figure[rightLowerLegId] = createNode( m, rightLowerLeg, null, null );
    break;

    }

}
//-------------------------------------------------INIT NODES-----------------------------------------------------------










//----------------------------------------------FIND_BEAR RENDERS--------------------------------------------------------

//------TRAVERSE------
var stack = [];


function traverse(Id) {

    if(Id == null) return;
    stack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
    figure[Id].render();

    if(figure[Id].child != null) traverse(figure[Id].child);
    
    modelViewMatrix = stack.pop();




    if(figure[Id].sibling != null) traverse(figure[Id].sibling);

}




//--------TORSO--------
function torso() {

    gl.uniform1f(fragmentFlagLoc, 0);

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*torsoHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale( torsoWidth, torsoHeight, torsoWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);

    //------tail------
    instanceMatrix = mult(modelViewMatrix, translate(0.0, -0.5*0.5, 0.5 ));
    instanceMatrix = mult(instanceMatrix, scale(0.5, 0.5, 0.5) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}


//--------HEAD--------
function head() {

    gl.uniform1f(fragmentFlagLoc, 1);

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);

    gl.uniform1f(fragmentFlagLoc, 0);
}



//--------LU ARM--------
function leftUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}



//--------LL ARM--------
function leftLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}


//--------RU ARM--------
function rightUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}



//--------RL ARM--------
function rightLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}



//--------LU LEG--------
function  leftUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}



//--------LL LEG--------
function leftLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}



//--------RU LEG--------
function rightUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}



//--------RL LEG--------
function rightLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
//-------------------------------------------------BEAR RENDERS--------------------------------------------------------










//----------------------------------------------------FIND_TREE-------------------------------------------------------------
var treeHeight = 15.0;
var treeWidth = 4;

var treePosition = [2.0, -10.0, -4.1]; 

function tree() {

    stack.push(modelViewMatrix);
    
    gl.uniform1f(fragmentFlagLoc, 3);
    
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * treeHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, translate(treePosition[0], treePosition[1], treePosition[2]));
    instanceMatrix = mult(instanceMatrix, scale( treeWidth, treeHeight, treeWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);

    //leafs
    gl.uniform1f(fragmentFlagLoc, 2);

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * treeHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, translate(treePosition[0], 0.0, treePosition[2]));
    instanceMatrix = mult(instanceMatrix, scale( 15, 5.0, 15));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);

    modelViewMatrix = stack.pop();
}
//-------------------------------------------------------TREE-------------------------------------------------------------










//----------------------------------------------------FIND_GRASS---------------------------------------------------------
var grassHeight = 1.0;
var grassWidth = 20;

var grassPosition = [0.0, -17.0, -4]; 


function grass(){
    stack.push(modelViewMatrix);

    gl.uniform1f(fragmentFlagLoc, 2);
    
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * treeHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, translate(0.0, grassPosition[1], grassPosition[2]));
    instanceMatrix = mult(instanceMatrix, scale( grassWidth, grassHeight, 4));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
//------------------------------------------------------GRASS-------------------------------------------------------------










//-----------------------------------------------------FIND_INIT----------------------------------------------------------

window.onload = init;

function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 1.0, 1.0, 1.0 );


    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader");

    gl.useProgram( program );

    instanceMatrix = mat4();

    projectionMatrix = ortho(-10.0,10.0,-10.0, 10.0,-10.0,10.0);
    modelViewMatrix = mat4();


    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix)  );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix)  );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix")

    cube();
    pushBodyTexture();
    pushHeadTexture();

    //Position Buffer
    var vBuffer = gl.createBuffer();

    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( positionLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( positionLoc );


    //  Body texture buffer
    var tBodyBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBodyBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(bodyTexCoordsArray), gl.STATIC_DRAW);

    var bodyTexCoordLoc = gl.getAttribLocation(program, "aBodyTexCoord");
    gl.vertexAttribPointer(bodyTexCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(bodyTexCoordLoc);


    //  Head texture buffer
    var tHeadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tHeadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(headTexCoordsArray), gl.STATIC_DRAW);

    var headTexCoordLoc = gl.getAttribLocation(program, "aHeadTexCoord");
    gl.vertexAttribPointer(headTexCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(headTexCoordLoc);

    var image = document.getElementById("TexImage");
    configureTexture(image);



    fragmentFlagLoc = gl.getUniformLocation(program, "fragmentFlag");

    document.getElementById("Button").onclick = function(){ANIM_flag = true};


    for(i=0; i<numNodes; i++) initNodes(i);

    animationSet();

    render();
}
//--------------------------------------------------------INIT------------------------------------------------------------










//-------------------------------------------------FIND_RENDER--------------------------------------------------------
var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.enable(gl.DEPTH_TEST);

    tree();
    grass();
    traverse(torsoId);


    if ( ANIM_flag )  { animation(); }
    
    requestAnimationFrame(render);

}
//---------------------------------------------------RENDER----------------------------------------------------------




















//________________________________________________FIND_ANIMATION_______________________________________________________

/* to make animation work  : 

    1- call "animationSet()" in Init()
    2- call "animation()"    in render()  

*/

var phase = 0;

//  SET
function animationSet(){
    bearPosition[xAxis] = -20.0;
    initNodes(torsoId);

    theta[leftUpperLegId] = maxAngle;
    initNodes(leftUpperLegId);

    theta[rightUpperLegId] = minAngle;
    initNodes(rightUpperLegId);

    theta[leftUpperArmId] = maxAngle-20;
    initNodes(leftUpperArmId);

    theta[rightUpperArmId] = minAngle+20;
    initNodes(rightUpperArmId);
}



//  MAIN
var animation = function(){

    if (phase == 0){
        if (bearPosition[xAxis] >= 3){
            setStopFlag(); 
            phase++;
        }
        else { walk();}
    }
    

    else if ( phase == 1){

        var bool = true;
        for (var i=2; i<10; i++){
            if (STOP_flag[i] != 0){bool = false;}
        }

        if (bool){ phase++;}
        else {stop();}    
    }

    else if ( phase == 2){

        if ( theta[torsoId] == -90) { phase++;}
        else{ raise(); }
    }


    else if ( phase == 3){
        scratch();
        headMotion(head1Id,WALK_flag);
    }

    for(i=0; i<numNodes; i++) initNodes(i);
}
//__________________________________________________ANIMATION_________________________________________________________










//__________________________________________________FIND_WALK_________________________________________________________

var WALK_flag = [0, -1, 1, 0, -1, 0, 1, 0, -1, 0, 0]; // 1 is clockise , -1 anti-clockwise

var upperLimbSpeed = 1.0;
var lowerLimbSpeed = 4.0;
var walkSpeed = 0.075;

var maxAngle = 110;
var minAngle = 60;



//  WALK
function walk(){
    bearPosition[xAxis] += walkSpeed;
    initNodes(torsoId);

    Walk_upperLimbMotion(leftUpperArmId,WALK_flag);
    Walk_upperLimbMotion(rightUpperArmId,WALK_flag);
    Walk_upperLimbMotion(leftUpperLegId,WALK_flag);
    Walk_upperLimbMotion(rightUpperLegId,WALK_flag);
}



//  UL_WALK_MOTION
function Walk_upperLimbMotion(Id,flag){
    if (theta[Id] >= maxAngle || theta[Id] <= minAngle) { flag[Id] *= -1; }

    theta[Id] += upperLimbSpeed*flag[Id];
    
    Walk_lowerLimbMotion(Id+1,flag[Id]);    
}



// LL_WALK_MOTION
function Walk_lowerLimbMotion(Id,n){

    if (n==-1){ theta[Id] = Math.min( 80, theta[Id] + lowerLimbSpeed ) }

    else{
        if(theta[Id] > 0){
            theta[Id] -= lowerLimbSpeed;        
        }
        else{theta[Id] = 0;}

        theta[Id] = Math.max( 0, theta[Id] - lowerLimbSpeed );
    }
}
//______________________________________________________WALK_________________________________________________________










//___________________________________________________FIND_STOP_________________________________________________________

var STOP_flag = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 1 is clockwise , -1 anti-clockwise



//  SET STOP FLAG
function setStopFlag(){
    for ( i=2; i<10; i++){

        if (i%2 != 0){ // lower limbs
            if (theta[i] < 0) { STOP_flag[i] = 1; }
            else if (theta[i] > 0) { STOP_flag[i] = -1; }
            else { STOP_flag[i] = 0; }
        }

        else { // upper limbs
            if (theta[i] < 90) { STOP_flag[i] = 1; }
            else if (theta[i] > 90) { STOP_flag[i] = -1; }
            else { flag[i] = 0; }
        }
    }
}



//  STOP
function stop(){

    Stop_upperLimbMotion(leftUpperArmId,STOP_flag);
    Stop_lowerLimbMotion(leftLowerArmId,STOP_flag);

    Stop_upperLimbMotion(rightUpperArmId,STOP_flag);
    Stop_lowerLimbMotion(rightLowerArmId,STOP_flag);

    Stop_upperLimbMotion(leftUpperLegId,STOP_flag);
    Stop_lowerLimbMotion(leftLowerLegId,STOP_flag);

    Stop_upperLimbMotion(rightUpperLegId,STOP_flag);
    Stop_lowerLimbMotion(rightLowerLegId,STOP_flag);    
}



//  UL_STOP_MOTION
function Stop_upperLimbMotion(Id,flag){
    if (theta[Id] != 90){ theta[Id] += upperLimbSpeed * flag[Id];}
    else { STOP_flag[Id] = 0; }
}



// LL_STOP_MOTION
function Stop_lowerLimbMotion(Id,flag){
    if (theta[Id] != 0){ theta[Id] += lowerLimbSpeed * flag[Id];}
    else{ flag[Id] = 0;}
}
//______________________________________________________STOP_________________________________________________________










//___________________________________________________FIND_RAISE_______________________________________________________

var RAISE_flag = [ -30 , -75, -90 ];
var psi = 0;


function raise(){

    var Id = torsoId;

    if ( theta[Id] > RAISE_flag[0] ) { 
        theta[Id] -= 0.4;
        bearPosition[yAxis] -= 0.015;
        bearPosition[xAxis] -= 0.01;
    }

    else if ( theta[Id] > RAISE_flag[1] ){
        theta[Id] -= 0.7;
        bearPosition[yAxis] = Math.min(-7, bearPosition[yAxis] + 0.01);
        bearPosition[xAxis] += 0.02;      
    }

    else if ( theta[Id] > RAISE_flag[2]  ){ 
        theta[Id] -= 0.4;
        psi += 1.2; 
    }

    else { theta[Id] = -90;}

    // Right Arm
    Raise_UpperArmMotion(rightUpperArmId, theta[Id]);
    Raise_LowerArmMotion(rightLowerArmId, theta[Id]);
    // Left Arm
    Raise_UpperArmMotion(leftUpperArmId, theta[Id]);
    Raise_LowerArmMotion(leftLowerArmId, theta[Id]);
    // Right Leg
    Raise_UpperLegMotion(rightUpperLegId, theta[Id]);
    Raise_LowerLegMotion(rightLowerLegId, theta[Id]);
    // Left Leg
    Raise_UpperLegMotion(leftUpperLegId, theta[Id]);
    Raise_LowerLegMotion(leftLowerLegId, theta[Id]);
}



// ULeg_RAISE_MOTION
function Raise_UpperLegMotion(Id, x){

    if (x > RAISE_flag[0]){ theta[Id] = theta[Id] - 0.3 ; } 

    else if ( x > RAISE_flag[1] ) { theta[Id] += 1.2 ; }

    else if ( x > RAISE_flag[2] ) { theta[Id] += 0.3; }

}



// LLeg_RAISE_MOTION
function Raise_LowerLegMotion(Id, x){

    if (x > RAISE_flag[0]){ theta[Id] += 0.8 ; }
 
    else if ( x > RAISE_flag[1] ){ theta[Id] -= 0.5 ; }

    else if ( x > RAISE_flag[2] ) { theta[Id] -= 0.1; }

}



// UArm_RAISE_MOTION
function Raise_UpperArmMotion(Id, x){

    if (x > RAISE_flag[0]) { theta[Id] += 0.2; }

    else if (x > RAISE_flag[1]){ theta[Id] += 1;}

    else { theta[Id] = Math.min(180, theta[Id] + 0.3);} 

}



// LArm_RAISE_MOTION
function Raise_LowerArmMotion(Id, x){

    if (x > RAISE_flag[0]){ theta[Id] -= 1; }

    else if ( x > RAISE_flag[1]) { theta[Id] += 0.75;}

    else { theta[Id] = Math.max(-90, theta[Id] -= 1.5);}

}
//_______________________________________________________RAISE_______________________________________________________











//___________________________________________________FIND_SCRATCH_______________________________________________________
var SCRATCH_flag = -1; // -1 down , 1 up;

function scratch(){

    if ( bearPosition[yAxis] < -8 || bearPosition[yAxis] > -7){ SCRATCH_flag *= -1; }

    bearPosition[yAxis]  += 0.025 * SCRATCH_flag;

    Scratch_UpperLegMotion(leftUpperLegId);
    Scratch_LowerLegMotion(leftLowerLegId);

    Scratch_UpperLegMotion(rightUpperLegId);
    Scratch_LowerLegMotion(rightLowerLegId);    
}


function Scratch_UpperLegMotion(Id){
    theta[Id] += 0.8 * SCRATCH_flag;
}

function Scratch_LowerLegMotion(Id){
    theta[Id] -= 1.5 * SCRATCH_flag;
}

//  HEAD_MOTION
function headMotion(Id,flag){
    if (theta[Id] >= 10 || theta[Id] <= 0) { flag[Id] *= -1; }
    theta[Id] += 0.2*flag[Id];
}
//_______________________________________________________SCRATCH_______________________________________________________