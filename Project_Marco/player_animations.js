//-----IDLE ANIMATION-----
function animation_Idle(player,Id, pose){
    
	pose = pose_Stance(Id);

	var tween = new TWEEN.Tween(pose)
		.to(pose_Bend(Id), 500)
		.delay(200)		
		//.easing(TWEEN.Easing.Elastic.InOut)
		.onUpdate(function(){set_Pose(player,pose);})
	;
	var tweenBack = new TWEEN.Tween(pose)
		.to(pose_Stance(Id), 500)
		.delay(200)
		//.easing(TWEEN.Easing.Elastic.InOut)
		.onUpdate(function(){set_Pose(player,pose);})
	;
	tween.chain(tweenBack);
	tweenBack.chain(tween);

	return tween;
}
//------------------------




//-----ONE-TIME ANiMATION-----

// BACK DASH
function animation_Back(player,Id, pose){

	pose = pose_Stance(Id);

	var tween = new TWEEN.Tween(pose)
		.to(pose_Empty(), 150)	
		.onUpdate(function(){set_Pose(player,pose);})
	;
	var tweenBack = new TWEEN.Tween(pose)
		.to(pose_Stance(Id), 150)
		.onUpdate(function(){set_Pose(player,pose);})
    ;
    
	tween.chain(tweenBack);
    tween.start();
}

// FORWARD DASH
function animation_Forward(player,Id, pose){

	pose = pose_Stance(Id);

	var tween = new TWEEN.Tween(pose)
		.to(pose_Empty(), 150)	
		.onUpdate(function(){set_Pose(player,pose);})
	;
	var tweenBack = new TWEEN.Tween(pose)
		.to(pose_Stance(Id), 150)
		.onUpdate(function(){set_Pose(player,pose);})
    ;
    
	tween.chain(tweenBack);
    tween.start();
}