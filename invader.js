/*  
 * length: length of time to await for a positive( true ) response.
 * is_now(): return true if length of asked times is reached and false if not.
 */
function StateMachineIsNow(){
	this.index = 0;
	this.length = 100;
	this.is_now = function(){
		if( this.index < this.length ){
			this.index ++;
			
			return false;
		}else{
			this.index = 0;
			
			return true;
		}
	}
}

function Bullet(){
	this.x = 0;
	this.y = 0;
	this.w = 1;
	this.h = 1;
	
	this.dx = 0;
	this.dy = 0;
	
	this.index = 0;
	
	this.invisible = new StateMachineIsNow();
	this.invisible.length = 70;
	this.is_invisible = false;
	
	this.changecolor = new StateMachineIsNow();
	this.changecolor.length = 10;
	
	this.draw_me = function(){
		if( this.is_invisible == true ){
			return;
		}
	
		ascwar.setColour(255, 255, 0);
		if( this.index == 0 ){
			ascwar.text( this.x, this.y, "x", "#");
		}else if( this.index == 1 ){
			ascwar.text( this.x, this.y, "+", "#");
		}
		ascwar.setColour(0, 255, 0);
	};
	
	this.update = function(){
		if( this.is_invisible == true ){
			return;
		}else{
			if( this.invisible.is_now() == true ){
				this.is_invisible = true;
				return;
			}
		}

		if( this.index == 0 ){
			this.index = 1;
		}else{
			this.index = 0;
		}
		
		this.x += this.dx;
		this.y += this.dy;
	};
}

/*
 * x,y: X and Y position.
 * w, h: width and height.
 * draw_me(): draw and return none.
 * update(): update position and return none.
 */
function Invader(){
	this.x = 5;
	this.y = 5;
	this.w = 6;
	this.h = 4;
	
	this.dy = 0.005;
	
	// this.index = 0;
	this.status = 0;
	
	this.STATUS_ALERT0 = 0;
	this.STATUS_ALERT1 = 1;
	this.STATUS_EXPLODE = 2;
	
	this.time_jump_x = new StateMachineIsNow();
	this.time_jump_x.length = 30;
	
	this.time_dance = new StateMachineIsNow();
	this.time_dance.length = 30;	
	
	this.jump_x = 1;
	this.jump_dx = 2;
	this.is_invisible = false;
	
	this.powered = false;
	
	this.draw_me = function(){
		if( this.is_invisible == true ){
			return;
		}
		ascwar.setColour(225, 0, 0);
		if( this.status == this.STATUS_ALERT0 ){
			// level 0
			ascwar.text( this.x + 2, this.y, ":[", "#");
			
			// level 1
			ascwar.text( this.x, this.y - 1, "\\", "#");
			ascwar.text( this.x + 4, this.y - 1, "/", "#");
		}else if( this.status == this.STATUS_ALERT1 ){
			// level 0
			ascwar.text( this.x + 2, this.y, ":[", "#");
			
			// level 1
			ascwar.text( this.x, this.y - 1, "_", "#");
			ascwar.text( this.x + 4, this.y - 1, "_", "#");
		}else if( this.status == this.STATUS_EXPLODE ){
			// level 0
			ascwar.text( this.x + 1, this.y, "/|\\", "#");
			
			// level 1
			ascwar.text( this.x, this.y - 1, "_\\|/_", "#");
		}
	};
	
	this.update = function(){
		if( this.status == this.STATUS_ALERT0 ){
			if( this.powered == false ){
				var rand = Math.random();
				if( rand < 0.5 ){
					this.dy = rand;
				}
				
				this.powered = true;
			}
			
			this.y += this.dy;
			
			// is time to X jump ?
			if( this.time_jump_x.is_now() == true ){
				this.x += this.jump_dx * this.jump_x;
				
				this.jump_x *= -1;
			}
			
			// dance now ?
			if( this.time_dance.is_now() == true ){
				this.status = this.STATUS_ALERT1;
				
				this.time_dance.length = 30;
			}
		}else if( this.status == this.STATUS_ALERT1 ){
			// dance again
			if( this.time_dance.is_now() == true ){
				this.status = this.STATUS_ALERT0;
				
				this.time_dance.length = 10;
			}
		}else if( this.status == this.STATUS_EXPLODE ){
			// nobody see you
			if( this.time_dance.is_now() == true ){
				this.is_invisible = true;
			}
		}
	};
}

/*
 * x,y: X and Y position.
 * w,h: width and height.
 * powered: if is true then show propusion
 * draw_me(): draw and return none.
 */
function Ship(){
	this.x = 20;
	this.y = 36;
	this.w = 6;
	this.h = 4;
	
	this.dx = 0;
	this.dy = 0;
	this.index = 0;
	
	this.STATUS_OK = 0;
	this.STATUS_WARNING = 1;
	
	this.bullets = [];
	this.bullets_index = 0;
	
	this.status = this.STATUS_OK;
	this.powered = true;
	
	this.restore_time = new StateMachineIsNow();
	this.restore_time.length = 200;
	
	this.lifes = 4;
	
	this.draw_me = function(){
	
		// level 0
		if( this.powered == true ){
			ascwar.setColour(225, 255, 0);
			ascwar.text( this.x + 1, this.y, "v", "#");
			ascwar.text( this.x + 3, this.y, "v", "#");
		}
	
		if( this.status == this.STATUS_OK ){
			ascwar.setColour(0, 255, 255);
		}else if( this.status == this.STATUS_WARNING ){
			if( this.restore_time.is_now() == true ){
				this.status = this.STATUS_OK;
			}else{
				if( this.restore_time.index % 15 < 5 ){
					ascwar.setColour(0, 255, 255);
				}else{
					ascwar.setColour(0, 0, 0);
				}
			}
		}
		
		// level 1
		ascwar.text( this.x, this.y - 1, "/", "#");
		ascwar.text( this.x + 1, this.y - 1, "_", "#");
		ascwar.text( this.x + 2, this.y - 1, "||", "#");
		ascwar.text( this.x + 3, this.y - 1, "_", "#");
		ascwar.text( this.x + 4, this.y - 1, "\\", "#");
		
		// level 2
		ascwar.text( this.x + 1, this.y - 2, "/|", "#");
		ascwar.text( this.x + 3, this.y - 2, "\\", "#");
		
		// level 3
		ascwar.text( this.x + 2, this.y - 3, "+", "#");	
	
		if( this.index == 0 ){
			// nothing
		}
		
		this.bullets.forEach( function( entry ){
			entry.draw_me();
		} );
		
		//this.index ++;
	};
	
	this.update = function(){
	
		// for each bullet: update
		this.bullets.forEach( function( entry ){
				entry.update();
			});

		this.x += this.dx;
		this.y += this.dy;
		
		// more slow!
		this.dx *= 0.99;
		this.dy *= 0.99;
	};
	
	this.shot = function(){
		var bullet_dy = -0.3;
	
		var bullet = new Bullet();
		bullet.x = this.x + this.w / 2 - 1;
		bullet.y = this.y - this.h;
		
		bullet.dy = bullet_dy;
	
		this.bullets[ this.bullets_index ] = bullet;
		this.bullets_index ++;
	};
}

var KEY_UP = 38, KEY_DOWN = 40,
	KEY_RIGHT = 39, KEY_LEFT = 37,
	KEY_Z = 90, KEY_X = 88, KEY_ENTER = 13;
var key_down_code = -1;
var key_pressed_code = -1;
var key_up_code = -1;
document.onkeydown = key_down;
document.onkeyup = key_up;
document.onkeypress = key_pressed;

/*
 * Handles key down event
 */
function key_pressed( event ){
	event = event || window.event;
	
	key_pressed_code = event.keyCode;
}
/*
 * Handles key down event
 */
function key_down( event ){
	event = event || window.event;
	
	key_down_code = event.keyCode;
}
/*
 * Handles key up event
 */
function key_up( event ){
	event = event || window.event;
	
	key_up_code = event.keyCode;
}

/*
 * Return true if the key code( stored with key_down event )
 * is equal to @key_code.
 */
function is_down( key_code ){
	if( key_down_code == key_code ){
		key_down_code = -1;
		return true;
	}else{
		return false;
	}
}	
/*
 * Return true if the key code( stored with key_pressed event )
 * is equal to @key_code.
 */
function is_pressed( key_code ){
	if( key_pressed_code == key_code ){
		key_pressed_code = -1;
		return true;
	}else{
		return false;
	}
}	
/*
 * Return true if the key code( stored with key_up event )
 * is equal to @key_code.
 */
function is_up( key_code ){
	if( key_up_code == key_code ){
		key_up_code = -1;
		return true;
	}else{
		return false;
	}
}	

height = 40;
width = 60;

var MARGIN_WIDTH = 2;
var LIFES_INITIAL = 4;

var ship = new Ship();
ship.lifes = LIFES_INITIAL;
var invaders = [];
var invaders_index = 0;

var new_invader = new StateMachineIsNow();
new_invader.length = 140;

var invaders_destroyed = 0;
var ship_destroyed = false;

var time_started = null;
var destroyed = 0;
var hearts = 0;
var time = 0;

var paused = true;

function proccess_bullets_collition(){
	var collitions = 0;
	
	invaders.forEach( function( invader ){
		if( invader.is_invisible == true ){
			return;
		}
		ship.bullets.forEach( function( bullet ){
			
			if( bullet.is_invisible == true ){
				return;
			}
			
			if( bullet.x >= invader.x && bullet.x <= invader.x + invader.w 
				&& bullet.y >= invader.y && bullet.y <= invader.y + invader.h ){
				
				if( invader.status != invader.STATUS_EXPLODE ){
					invader.status = invader.STATUS_EXPLODE;
					
					var sound_machine = jsfxlib.createWaves(audio_hurt);
					sound_machine.hurt.play();
					
					collitions ++;
				}
			}
		});
	});
	
	return collitions;
}

function proccess_ship_collition(){
	var collitions = 0;
	
	invaders.forEach( function( invader ){
		if( invader.is_invisible == true ){
			return;
		}
		
		if( ship.x >= invader.x && ship.x <= invader.x + invader.w 
			&& ship.y >= invader.y && ship.y <= invader.y + invader.h ){
			if( invader.status != invader.STATUS_EXPLODE ){
				invader.status = invader.STATUS_EXPLODE;
				
				collitions ++;
			}
		}
	});
	
	return collitions;
}

ascwar.update = function(dt){
	
	if( is_pressed( KEY_ENTER ) ){
		var sound_machine = jsfxlib.createWaves(audio_pickup);
		sound_machine.pickup.play();
		paused = ! paused;
	}
	
	if( ship_destroyed == true ){
		return;
	}
	
	if( paused == true ){
		
		return;
	}
	
	// update ship
	ship.update();
	
	// proccess bullets collition
	invaders_destroyed += proccess_bullets_collition();
	
	// proccess ship collition
	var ship_collide = 0;
	ship_collide = proccess_ship_collition();
	if( ship_collide > 0 ){
		ship.status = ship.STATUS_WARNING;
		ship.lifes --;
	}
	
	if( ship.lifes == 0){
		if( ship_destroyed == false ){
			var sound_machine = jsfxlib.createWaves(audio_explosion);
			sound_machine.explosion.play();
		}
	
		ship_destroyed = true;
	}else{
		if( ship_collide > 0 ){
			var sound_machine = jsfxlib.createWaves(audio_powerlow);
			sound_machine.powerlow.play();
		}
	}
	
	// is time for a new invader ?
	if( new_invader.is_now() == true ){
		var invader = new Invader();
		invader.x = MARGIN_WIDTH + Math.random() * ( width - 2 * MARGIN_WIDTH - invader.w );
		invaders[ invaders_index ] = invader;
		
		invaders_index ++;
	}

	// for each invader: update
	invaders.forEach( function( entry ){
		entry.update();
	});
	
	// keyboard actions
	var ship_dx = 0.4;
	var ship_dy = 0.2;
	
	if( is_down( KEY_UP ) ){
		ship.powered = true;
		ship.dy = - ship_dy;
	}else{
		ship.powered = false;
	}
	
	if( is_down( KEY_DOWN ) ){
		ship.dy = ship_dy;
	}else if( is_down( KEY_RIGHT ) ){
		ship.dx = ship_dx;
	}else if( is_down( KEY_LEFT ) ){
		ship.dx = - ship_dx;
	}
	
	if( is_up( KEY_Z ) ){
		ship.shot();
		
		var sound_machine = jsfxlib.createWaves(audio_shot);
		sound_machine.shot.play();
	}
}

ascwar.draw = function(dt){
	if( ship_destroyed == true ){
		// fill box!
		ascwar.setNeutral("~")
	}else if( paused == true ){
		ascwar.setNeutral("0")
	}else{
		// normal
		ascwar.setNeutral("1")
	}

	ascwar.setColour(0, 0, 0);
	ascwar.clearScreen();
	ascwar.setColour(0, 255, 0);
	ascwar.box(0,0,width,height,"+",'-','|');
	
	
	if( paused == true ){
		var msg_structure = "|----- ----- -----|";
		var msg_paused = "PAUSED";
		ascwar.text( width / 2  - msg_structure.length / 2 , height / 2 - 1 , msg_structure ,'#');
		ascwar.text( width / 2  - msg_paused.length / 2 , height / 2 , msg_paused ,'#');
		ascwar.text( width / 2  - msg_structure.length / 2 , height / 2 + 1, msg_structure ,'#');
	}
	
	// draw ship
	ship.draw_me();
	
	// for each invader: draw
	invaders.forEach(function(entry) {
		entry.draw_me();
	});
	
	ascwar.setColour(255, 255, 255);
	
	// get zeros
	var zeros = "0000000";
	var score = zeros + invaders_destroyed;
	score = score.substr( score.length - zeros.length, score.length );
	
	// level 1
	ascwar.text(34, height-3 , "VEL X: "+parseFloat( ship.dx ).toFixed(2)+" Y: "+parseFloat( ship.dy ).toFixed(2),'#');
	ascwar.text(4, height-3 , "SCORE: "+ score ,'#');
	
	// level 0
	ascwar.text(34, height-2 , "POS X: "+parseInt(ship.x)+"   Y: "+parseInt(ship.y),'#');
	
	var count_lifes = ship.lifes;
	var hearts = "";
	
	for( count_lifes ; count_lifes > 0 ; count_lifes -- ){
		hearts = hearts.concat( "<3 " );
	}
	
	ascwar.text(4, height-2 , "LIFES: " + hearts ,'#');
	
	ascwar.setColour(0, 255, 0);
	var footer = "+ Ascii invaders +";
	ascwar.text(width/2  - (footer.length)/2,height-1, footer,'#');
}

console.log("loaded");