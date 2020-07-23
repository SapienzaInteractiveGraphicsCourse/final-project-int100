function createBlue(array){
	var blue_fighter = createFighter(0x0000ff);
	var i = 0;
	array[0] = blue_fighter[i++];
	array[1] = blue_fighter[i++];
	array[2] = blue_fighter[i++];
	array[3] = blue_fighter[i++];
	array[4] = blue_fighter[i++];
	array[5] = blue_fighter[i++];
	array[6] = blue_fighter[i++];
	array[7] = blue_fighter[i++];
	array[8] = blue_fighter[i++];
	array[9] = blue_fighter[i++];
}


function createRed(array){
	var red_fighter = createFighter(0xff0000);
	var i = 0;
	array[0] = red_fighter[i++];
	array[1] = red_fighter[i++];
	array[4] = red_fighter[i++];
	array[5] = red_fighter[i++];
	array[2] = red_fighter[i++];
	array[3] = red_fighter[i++];
	array[8] = red_fighter[i++];
	array[9] = red_fighter[i++];
	array[6] = red_fighter[i++];
	array[7] = red_fighter[i++];
}


function createFighter(clr){

	//---Body
	var geometry = new THREE.BoxGeometry(2, 6, 2);
	var material = new THREE.MeshBasicMaterial( {color: clr} ); 
	var body = new THREE.Mesh(geometry, material);

	scene.add(body);
	
	//---Head
	geometry = new THREE.BoxGeometry(1.25, 1.25, 1.25);
	material = new THREE.MeshBasicMaterial ( {color: 0xffc0cb}) //pink
	var head = new THREE.Mesh(geometry, material);

	body.add(head);
	
	//---Forearm Left
	geometry = new THREE.BoxGeometry( 2, 0.75, 0.75);
	material = new THREE.MeshBasicMaterial( {color: clr} ); 
    var forearmLeft = new THREE.Mesh(geometry, material);
    var ULA_pivot = new THREE.Object3D();

    body.add(ULA_pivot);
    ULA_pivot.add(forearmLeft);
	
	//---Arm Left
	geometry = new THREE.BoxGeometry(2, 0.5, 0.5);
	material = new THREE.MeshBasicMaterial ( {color: 0xffc0cb}) //pink
    var armLeft = new THREE.Mesh(geometry, material);
    var LLA_pivot = new THREE.Object3D();

    forearmLeft.add(LLA_pivot);
    LLA_pivot.add(armLeft);
    
	//---Forearm Right
	geometry = new THREE.BoxGeometry( 2, 0.75, 0.75);
	material = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
	var forearmRight = new THREE.Mesh(geometry, material);
    var URA_pivot = new THREE.Object3D();

    body.add(URA_pivot);
    URA_pivot.add(forearmRight);

	//---Arm Right
	geometry = new THREE.BoxGeometry(2, 0.5, 0.5);
	material = new THREE.MeshBasicMaterial ( {color: 0xffc0cb}) //pink
    var armRight = new THREE.Mesh(geometry, material);
    var LRA_pivot= new THREE.Object3D();

    forearmRight.add(LRA_pivot);
    LRA_pivot.add(armRight);
    
	//---UpperLeg Left
	geometry = new THREE.BoxGeometry( 0.75, 2,0.75);
	material = new THREE.MeshBasicMaterial( {color: clr} ); 
    var upperLegLeft = new THREE.Mesh(geometry, material);
    var ULL_pivot = new THREE.Object3D();

    body.add(ULL_pivot);
    ULL_pivot.add(upperLegLeft);
    
	//---LowerLeg Left
	geometry = new THREE.BoxGeometry(0.5, 2, 0.5);
	material = new THREE.MeshBasicMaterial ( {color: 0xffc0cb}) //pink
    var lowerLegLeft = new THREE.Mesh(geometry, material);
    var LLL_pivot = new THREE.Object3D();

    upperLegLeft.add(LLL_pivot);
    LLL_pivot.add(lowerLegLeft);

	//---UpperLeg Right
	geometry = new THREE.BoxGeometry( 0.75, 2, 0.75);
    material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );  
    var upperLegRight = new THREE.Mesh(geometry, material);
    var URL_pivot = new THREE.Object3D();
    
	body.add(URL_pivot);
    URL_pivot.add(upperLegRight);

	//---LowerLeg Right
	geometry = new THREE.BoxGeometry(0.5, 2, 0.5);
	material = new THREE.MeshBasicMaterial ( {color: 0xffc0cb}) //pink
    var lowerLegRight = new THREE.Mesh(geometry,material);
    var LRL_pivot = new THREE.Object3D();

	upperLegRight.add(LRL_pivot);
    LRL_pivot.add(lowerLegRight);
	

	//Set Proper position
	head.position.y = (body.geometry.parameters.height / 2) + (head.geometry.parameters.height / 2);
    

    forearmLeft.position.x = (ULA_pivot.position.x) - (forearmLeft.geometry.parameters.width / 2);
	ULA_pivot.position.x = -(body.geometry.parameters.width / 2);
    ULA_pivot.position.y = (body.geometry.parameters.height / 3);
	
	armLeft.position.x = (LLA_pivot.position.x) - (armLeft.geometry.parameters.width / 2);
	LLA_pivot.position.x = -(forearmLeft.geometry.parameters.width / 2);


	forearmRight.position.x = (URA_pivot.position.x) + (forearmRight.geometry.parameters.width / 2);
	URA_pivot.position.x = (body.geometry.parameters.width / 2);
    URA_pivot.position.y = (body.geometry.parameters.height / 3);

	armRight.position.x = (LRA_pivot.position.x) + (armRight.geometry.parameters.width / 2);
	LRA_pivot.position.x = (forearmRight.geometry.parameters.width / 2);


    upperLegLeft.position.y = (ULL_pivot.position.y) - (upperLegLeft.geometry.parameters.height / 2);
	ULL_pivot.position.x = (body.geometry.parameters.width / 4)*(-1);
    ULL_pivot.position.y = (body.geometry.parameters.height / 2)*(-1);

    lowerLegLeft.position.y = (LLL_pivot.position.y) - (lowerLegLeft.geometry.parameters.height / 2);
	LLL_pivot.position.y = -(upperLegLeft.geometry.parameters.height / 2);


    upperLegRight.position.y = (URL_pivot.position.y) - (upperLegRight.geometry.parameters.height / 2);
    URL_pivot.position.x = (body.geometry.parameters.width / 4);
    URL_pivot.position.y = (body.geometry.parameters.height / 2)*(-1);
	
	lowerLegRight.position.y = (LRL_pivot.position.y) - (lowerLegRight.geometry.parameters.height / 2);
	LRL_pivot.position.y = -(upperLegRight.geometry.parameters.height / 2);
    
    
	return [body, head, ULA_pivot, LLA_pivot, URA_pivot, LRA_pivot, ULL_pivot, LLL_pivot, URL_pivot, LRL_pivot];
}