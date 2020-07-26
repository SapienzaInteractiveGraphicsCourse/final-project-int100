//  GLOBAL VARIABLE 
var rad = Math.PI/180;

var redId = 0;
var blueId = 1;

var body = 0;
var head = 1;
var UFArm = 2;
var LFArm = 3;
var UBArm = 4;
var LBArm = 5;
var UFLeg = 6;
var LFLeg = 7;
var UBLeg = 8;
var LBLeg = 9;
//------------------

var blue= [];
var red = [];

for(var i = 0; i<10;i++) {
	blue[i]= null;
	red[i] = null;
}


var position;

var scene, camera, renderer;
function init() {
	//Scene
	scene = new THREE.Scene();
	//Camera
	camera = new THREE.OrthographicCamera(window.innerWidth/-50, window.innerWidth/ 50, window.innerHeight/ 50, window.innerHeight/ -50, 1, 1000 );
	camera.position.z = 10;
	//Renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	//Place Scene
	document.body.appendChild(renderer.domElement);

	//Create Fighters
	createBlue(blue);
	initialize(blue,blueId);

	createRed(red);
	initialize(red,redId);

	red[body].position.x = -5;
	blue[body].position.x = 5;

	set_Pose(red,pose_Stance(redId));
	set_Pose(blue,pose_Stance(blueId));
}




function animate() {
	requestAnimationFrame(animate);
	TWEEN.update();
	renderer.render(scene, camera);

	//blue[body].rotation.y += 0.01;
	//red[body].rotation.y -= 0.01;

	update(blue,blueId,red); //update blue status against red
	update(red,redId,blue); //update red status against blue
}




init();
animate();




//---Window Resize---
function onWindowResize(){
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);
//-------------------

//---KeyBoard Checking---
window.addEventListener("keypress", keyHandler, false);

function keyHandler(key){
	blue_Handler(key,blue,blueId);
	red_Handler(key,red,redId);
}
//-----------------------