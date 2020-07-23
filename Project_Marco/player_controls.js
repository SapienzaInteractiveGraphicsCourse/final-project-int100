var redId = 0;
var blueId = 1;

var keyFlag = [true, true];
var action = ["idle", "idle"];
var destination = [0, 0];

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


//------------------------------------BLUE CONTROLS----------------------------------------//
function blue_Handler(key,array,Id){
	if (keyFlag[Id]){

        switch(key.keyCode){

            case 111: //"o"
                keyFlag[Id] = false;
			    action[Id] = "left";
                destination[Id] = array[body].position.x -2;
            break;

            case 112: //"p"
                keyFlag[Id] = false;
			    action[Id] = "right"
                destination[Id] = array[body].position.x +2;
            break;
        }    
	}
}
//-----------------------------------------------------------------------------------------//



//-------------------------------------RED CONTROLS----------------------------------------//
function red_Handler(key,array,Id){
	if (keyFlag[Id]){

        switch(key.keyCode){

            case 113: //"q"
                keyFlag[Id] = false;
			    action[Id] = "left";
                destination[Id] = array[body].position.x -2;
            break;

            case 119: //"w"
                keyFlag[Id] = false;
                action[Id] = "right"
                destination[Id] = array[body].position.x +2;
            break;
        }       
	}
}
//-----------------------------------------------------------------------------------------//



function update(array,Id){

    switch(action[Id]){

        case "left":
            if (array[body].position.x > destination[Id]) { array[body].position.x -= 0.1;}
		    else {
			    keyFlag[Id] = true;
			    action[Id] = "";
            }
        break;

        case "right":
            if (array[body].position.x < destination[Id]) { array[body].position.x += 0.1;}
		    else {
			    keyFlag[Id] = true;
                action[Id] = "";
            }
        break;

    }
}





