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
	
	this.index = 0;
	this.status = 0;
	
	this.STATUS_ALERT0 = 0;
	this.STATUS_ALERT1 = 1;
	this.STATUS_ALERT2 = 2;
	
	this.time_jump_x = new StateMachineIsNow();
	this.time_jump_x.length = 30;
	
	this.jump_x = 1;
	this.jump_dx = 2;
	
	this.draw_me = function(){
		ascwar.setColour(225, 0, 0);
		if( this.index == this.STATUS_ALERT0 ){
			// level 0
			ascwar.text( this.x + 2, this.y, ":[", "#");
			
			// level 1
			ascwar.text( this.x, this.y - 1, "\\", "#");
			ascwar.text( this.x + 4, this.y - 1, "/", "#");
		}else if( this.index == this.STATUS_ALERT1 ){
			// level 0
			ascwar.text( this.x + 2, this.y, ":[", "#");
			
			// level 1
			ascwar.text( this.x, this.y - 1, "_", "#");
			ascwar.text( this.x + 4, this.y - 1, "_", "#");
		}
	};
	
	this.update = function(){
		if( this.status == this.STATUS_ALERT0 ){
			this.y += 0.005;
			
			// is time to X jump ?
			if( this.time_jump_x.is_now() == true ){
				this.x += this.jump_dx * this.jump_x;
				
				this.jump_x *= -1;
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
	
	this.status = 1;
	this.powered = true;
	
	this.draw_me = function(){
		if( this.status == this.STATUS_OK ){
			// same color
		}else if( this.status == this.STATUS_WARNING ){
			ascwar.setColour(225, 0, 0);
		}
	
		if( this.index == 0 ){
			// level 0
			if( this.powered == true ){
				ascwar.setColour(225, 255, 0);
				ascwar.text( this.x + 1, this.y, "v", "#");
				ascwar.text( this.x + 3, this.y, "v", "#");
				ascwar.setColour(225, 0, 0);
			}
		
			// level 1
			ascwar.setColour(0, 255, 255);
			ascwar.text( this.x, this.y - 1, "/", "#");
			ascwar.text( this.x + 1, this.y - 1, "_", "#");
			ascwar.text( this.x + 2, this.y - 1, "_", "#");
			ascwar.text( this.x + 3, this.y - 1, "_", "#");
			ascwar.text( this.x + 4, this.y - 1, "\\", "#");
			
			// level 2
			ascwar.text( this.x + 1, this.y - 2, "/", "#");
			ascwar.text( this.x + 3, this.y - 2, "\\", "#");
			
			// level 3
			ascwar.text( this.x + 2, this.y - 3, "+", "#");
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
	KEY_Z = 90, KEY_X = 88;
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
	
	key_down_code = -1;
	key_pressed_code = -1;
	
	key_up_code = event.keyCode;
}

/*
 * Return true if the key code( stored with key_down event )
 * is equal to @key_code.
 */
function is_down( key_code ){
	if( key_down_code == key_code ){
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
	var res = ( key_up_code == key_code );
	
	key_up_code = -1;
	
	return res;
}	

height = 40;
width = 60;

var MARGIN_WIDTH = 2;

var ship = new Ship();
var invaders = [];
var invaders_index = 0;

var new_invader = new StateMachineIsNow();
new_invader.length = 400;

function proccess_collition(){
	var collitions = 0;
	
	invaders.forEach( function( invader ){
		ship.bullets.forEach( function( bullet ){
			
			if( bullet.x >= invader.x && bullet.x <= invader.x + invader.w 
				&& bullet.y >= invader.y && bullet.y <= invader.y + invader.h ){
				//invader.is_invisible = true;
				
				collitions ++;
			}
			
			// console.log( "x =" + invader.x );
		});
	});
	
	return collitions;
}

ascwar.update = function(dt){

	// update ship
	ship.update();
	
	// proccess collition
	proccess_collition();

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
	var ship_dx = 0.2;
	var ship_dy = 0.08;
	
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
	}
}

ascwar.draw = function(dt){
	ascwar.setColour(0, 0, 0);
	ascwar.setNeutral(" ")
	ascwar.clearScreen();
	ascwar.setColour(0, 255, 0);
	ascwar.box(0,0,width,height,"+",'-','|');
	
	// draw ship
	ship.draw_me();
	
	// for each invader: draw
	invaders.forEach(function(entry) {
		entry.draw_me();
	});
	
	ascwar.setColour(0, 255, 0);
	var footer = "+ Ascii invaders +";
	ascwar.text(width/2  - (footer.length)/2,height-1, footer,'#')
}

console.log("loaded");