// GLOBAL VARIABLE 
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






// CONTROL VARIABLE
var keyFlag = [null, null];
var action = [null, null];
var destination = [0, 0];

var pose = [null, null];
var animation = [null,null];


function initialize(player,Id){
    keyFlag[Id] = true;
    pose[Id] = pose_Stance(Id);
    action[Id] = "idle";
    animation[Id] = animation_Idle(player,Id,pose[Id]);
    animation[Id].start();
}


//------------------------------------BLUE CONTROLS----------------------------------------//
function blue_Handler(key, player, Id){
	if (keyFlag[Id]){

        switch(key.keyCode){

            // "o"
            case 111:                   
                // animation
                animation[Id].stop();
                animation_Forward(player,Id,pose[Id]);

                // control
                keyFlag[Id] = false;
                action[Id] = "left";
                setTimeout(reset_blue, 300);
            break;


            // "p"
            case 112:
                // animation
                animation[Id].stop();
                animation_Back(player,Id,pose[Id]);

                // control
                keyFlag[Id] = false;
                action[Id] = "right";
                setTimeout(reset_blue, 300);
            break;
        }    
	}
}


function reset_blue(){
    keyFlag[blueId] = true;
    action[blueId] = "idle";
    animation[blueId].start();
}
//-----------------------------------------------------------------------------------------//



//-------------------------------------RED CONTROLS----------------------------------------//
function red_Handler(key, player, Id){
	if (keyFlag[Id]){

        switch(key.keyCode){

            // "q"
            case 113:
                // animation
                animation[Id].stop();
                animation_Back(player,Id,pose[Id]);

                // control
                keyFlag[Id] = false;
                action[Id] = "left";
                setTimeout(reset_red, 300);       
            break;


            // "w"
            case 119:
                // animation
                animation[Id].stop();
                animation_Forward(player,Id,pose[Id]);

                // control
                keyFlag[Id] = false;
                action[Id] = "right"
                setTimeout(reset_red, 300);
            break;
        }       
	}
}


function reset_red(){
    keyFlag[redId] = true;
    action[redId] = "idle";
    animation[redId].start();
}
//-----------------------------------------------------------------------------------------//






var mov_speed = 0.1;

function update(player,p_Id,adv){ 

    var pos = player[body].position.x;
    var a_pos = adv[body].position.x;

    switch(action[p_Id]){

        case "left":
            var limit = limit_left(pos,a_pos);
            pos = Math.max(limit,pos - mov_speed); 
        break;

        case "right":
            var limit = limit_right(pos,a_pos);
            pos = Math.min(limit,pos + mov_speed); 
        break;
    }
    player[body].position.x = pos;
}








// LIMIT FUNCTION
var edge = 20; //the edges of the screen
var distance = 6; //minimum distance between the two figther

function limit_left(p_pos, a_pos){
    var limit = -edge;
    if (p_pos > a_pos) { limit = a_pos + distance; }

    return limit;
}

function limit_right(p_pos, a_pos){
    var limit = edge;
    if (p_pos < a_pos) { limit = a_pos - distance; }

    return limit;
}