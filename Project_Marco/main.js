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

var blue= [];
var red = [];

for(var i = 0; i<10;i++) {
	blue[i]= null;
	red[i] = null;
}



var scene, camera, renderer;
function init() {
	//Scene
	scene = new THREE.Scene();
	//Camera
	camera = new THREE.OrthographicCamera(window.innerWidth/-50, window.innerWidth/ 50, window.innerHeight/ 50, window.innerHeight/ -50, 1, 1000 );
	camera.position.z = 3;
	//Renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	//Place Scene
	document.body.appendChild(renderer.domElement);

	//Create Fighters
	createBlue(blue);
	createRed(red);

	red[body].position.x = -10;
	blue[body].position.x = 10;
}



function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);

	update(blue,blueId);
	update(red,redId);
}



window.addEventListener("keypress", keyHandler, false);

function keyHandler(key){
	blue_Handler(key,blue,blueId);
	red_Handler(key,red,redId);
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