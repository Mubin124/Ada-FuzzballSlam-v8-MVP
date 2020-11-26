"use strict";

var vp_width = 920, vp_height = 690; //declare variables to hold the viewport size
var max_crates = 2;

//declare global variables to hold the framework objects
var viewport, world, engine, body, elastic_constraint;


var crate = []; //create an empty array that will be used to hold all the crate instances
var ground;
var leftwall;
var rightwall;

var fuzzball;
var launcher;

var backimage;
var fuzzimage; 
var crateimage;

var music;
var hit;

function apply_velocity() {
	Matter.Body.setVelocity( fuzzball.body, {x: get_random(0, 20), y: get_random(0, 20)*-1});
};


function apply_angularvelocity() {
	for(let i = 0; i < crate.length; i++) {
		Matter.Body.setAngularVelocity( crate[i].body, Math.PI/get_random(3, 20));
	}
};


function apply_force() {	
	for(let i = 0; i < crate.length; i++) {
		Matter.Body.applyForce( crate[i].body, {
			x: crate[i].body.position.x, 
			y: crate[i].body.position.y
		}, {
			x: 0.05, 
			y: get_random(50, 200)*-1
		});
	}
};

function hittrack() {
	hit.setVolume(0.02);
	if(hit.isPlaying()) {
		hit.stop();
		hit.play();
	} else {
		hit.play();
	}
}

function audiotrack() {
	if(music.isPlaying()) {
		console.log("stopping audio");
		music.stop();
	} else {
		music.setVolume(0.015);
		console.log("starting audio");
		music.loop();
	}
}

function get_random(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}


function preload() {
	//p5 defined function
	backimage = loadImage("https://adaresource.s3.eu-west-2.amazonaws.com/assets/fuzzballslam/SlamBackground920x690.png"); 
	fuzzimage = loadImage("https://adaresource.s3.eu-west-2.amazonaws.com/assets/fuzzballslam/Fuzzball60x60.png"); 
	crateimage = loadImage("https://adaresource.s3.eu-west-2.amazonaws.com/assets/fuzzballslam/Crate120x120.png");

	music = loadSound("https://adaresource.s3.eu-west-2.amazonaws.com/assets/fuzzballslam/AmbientLoop.mp3");
	hit = loadSound("https://adaresource.s3.eu-west-2.amazonaws.com/assets/fuzzballslam/Hit.mp3");
}


function collisions(event) {

	event.pairs.forEach((collide) => { //event.pairs[0].bodyA.label
		
		console.log(collide.bodyA.label + " - " + collide.bodyB.label);


		if((collide.bodyA.label === "fuzzball" && collide.bodyB.label === "crate0") || (collide.bodyA.label=== "crate0" && collide.bodyB.label === "fuzzball"))	{
			hittrack();
		}

		if((collide.bodyA.label === "fuzzball" && collide.bodyB.label === "crate1") || (collide.bodyA.label=== "crate1" && collide.bodyB.label === "fuzzball"))	{
			hittrack();
		}


		if((collide.bodyA.label === "fuzzball" && collide.bodyB.label === "rightwall") || (collide.bodyA.label=== "rightwall" && collide.bodyB.label === "fuzzball"))	{
			rightwall.colour = "#ff0000";
		} else {
			rightwall.colour = "#ffffff";
		}
			
		if((collide.bodyA.label=== "fuzzball" && collide.bodyB.label === "leftwall") || (collide.bodyA.label=== "leftwall" && collide.bodyB.label === "fuzzball"))	{
			leftwall.colour = "#ff0000";
		} else {
			leftwall.colour = "#ffffff";
		}
	});
}

function offworld(event) {
	if(fuzzball.body.position.y < 20 && fuzzball.body.velocity.y < 0) {
		Matter.Body.setVelocity(fuzzball.body, { x: 0, y: +10 });
	}
}


function setup() {
	//this p5 defined function runs automatically once the preload function is done
	viewport = createCanvas(vp_width, vp_height); //set the viewport (canvas) size
	viewport.parent("viewport_container"); //move the canvas so it’s inside the target div
	
	//enable the matter engine
	engine = Matter.Engine.create();
	world = engine.world;
	body = Matter.Body;

	world.gravity.y = 2;

	Matter.Events.on(engine, 'collisionEnd', collisions);
	Matter.Events.on(engine, 'beforeUpdate', offworld); 

	//enable the 'matter' mouse controller and attach it to the viewport object using P5s elt property
	let vp_mouse = Matter.Mouse.create(viewport.elt);
	vp_mouse.pixelRatio = pixelDensity(); //update the pixel ratio with the p5 density value; this supports retina screens, etc
	let options = {
		mouse: vp_mouse,
		collisionFilter: {
			mask: defaultCategory | Category2 
		}
	}

	//see docs on https://brm.io/matter-js/docs/classes/Constraint.html#properties
	elastic_constraint = Matter.MouseConstraint.create(engine, options);
	Matter.World.add(world, elastic_constraint); //add the elastic constraint object to the world
//	elastic_constraint.collisionFilter.mask =  defaultCategory | Category1  ; //| Category2

	ground = new c_ground(vp_width/2, vp_height-10, vp_width, 20, "ground"); //create a ground object
	leftwall = new c_ground(-24, vp_height/2, 50, vp_height, "leftwall");
	rightwall = new c_ground(vp_width+24, vp_height/2, 50, vp_height, "rightwall");
	
	fuzzball = new c_fuzzball(400, 200, 60, "fuzzball"); //create a fuzzball object

	//loop through each of the crate indexes
	for(let i = 0; i < max_crates; i++) { //loop for each instance of a crate
		crate[i] = new c_crate(700, (150*i)-200, 120, 120, "crate" + i);
	}

	//create a launcher object using the fuzzball body
	launcher = new c_launcher(400, 200, fuzzball.body);

	frameRate(60);

}

function paint_background() {
	//access the game object for the world, use this as a background image for the game
//	background('#4c738b');
	background(backimage);

	ground.show(); //execute the show function for the boundary objects
	leftwall.show();
	rightwall.show();
}


function paint_assets() {
	for(let i = 0; i < crate.length; i++) { //loop through the crate array and show each
		crate[i].show()	
	}
	fuzzball.show(); //show the fuzzball
	launcher.show(); //show the launcher indicator 
}


function draw() {
	//this p5 defined function runs every refresh cycle
	paint_background(); //paint the default background

	Matter.Engine.update(engine); //run the matter engine update
	//console.log(frameRate()); //show current framerate

	paint_assets(); //paint the assets

	if(elastic_constraint.body !== null) {
		if(elastic_constraint.body.label === "fuzzball") {
			console.log(elastic_constraint.body.label);
			let pos = elastic_constraint.body.position; //create an shortcut alias 	
			fill("#ff0000"); //set a fill colour
			ellipse(pos.x, pos.y, 20, 20); //indicate the body that has been selected

			let mouse = elastic_constraint.mouse.position;
			stroke("#00ff00");
			line(pos.x, pos.y, mouse.x, mouse.y);
		}
	}
	console.log("Matter objects: " + world.bodies.length);
}


function keyPressed() {
	if (keyCode === ENTER) {
		fuzzball.destroy();
		fuzzball = new c_fuzzball(400, 200, 60, "fuzzball");
		launcher.reload(fuzzball.body);
	}

//	if(keyCode === 32) {
//		console.log("space key press");
//		launcher.release(); //execute the release method
//	}
}


function mouseReleased() {
	setTimeout(() => {
		launcher.release();
	}, 100);
}

