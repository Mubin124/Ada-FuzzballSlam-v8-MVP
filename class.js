"use strict";

// define our categories (as bit fields, there are up to 32 available)
var defaultCategory = 0x0001, Category1 = 0x0002, Category2 = 0x0004;

	

class c_launcher {
	constructor(x, y, body) {
		//see docs on https://brm.io/matter-js/docs/classes/Constraint.html#properties
		let options = {
			pointA: {
				x: x,
				y: y
			},
			bodyB: body,
			stiffness: 0.01,
			length: 40,
		}
		//create the contraint 
		this.launch = Matter.Constraint.create(options);
		Matter.World.add(world, this.launch); //add to the matter world
	}

	release() {
		//release the constrained body by setting it to null
		this.launch.bodyB = null;
	}

	reload(body) {
		//attach the passes body to the launcher
		this.launch.bodyB = body;
	}

	show() {
		//check to see if there is an active body
		if(this.launch.bodyB) {
			let posA = this.launch.pointA; //create an shortcut alias 
			let posB = this.launch.bodyB.position;
			stroke("#00ff00"); //set a colour
			line(posA.x, posA.y, posB.x, posB.y); //draw a line between the two points
		}
	}
}


class c_ground {
	constructor(x, y, width, height, label) {
		let options = {
			isStatic: true,
			restitution: 0.99,
			friction: 0.20,
			density: 0.99,
			label: label,
			collisionFilter: {
				category: Category1,
			}
		}
		//create the body
		this.body = Matter.Bodies.rectangle(x, y, width, height, options);
		//this.body.collisionFilter = defaultCategory | blueCategory;
		//this.body.label = label;
		Matter.World.add(world, this.body); //add to the matter world
		
		this.x = x; //store the passed variables in the object
		this.y = y;
		this.width = width;
		this.height = height;
		this.label = label;
		this.color = "#ffffff";
	}

	set colour(value) {
		this.color = value;
	}

	body() {
		return this.body; //return the created body
	}

	show() {
		let pos = this.body.position; //create an shortcut alias 
		rectMode(CENTER); //switch centre to be centre rather than left, top
		fill(this.color); //set the fill colour
		rect(pos.x, pos.y, this.width, this.height); //draw the rectangle
	}
}


class c_crate {
	constructor(x, y, width, height, label) {
		let options = {
			restitution: 0.99,
			friction: 0.030,
			density: 0.99,
			frictionAir: 0.032,
			label: label,
			collisionFilter: {
				category: Category1,
			}
		}
		//create the body
		this.body = Matter.Bodies.rectangle(x, y, width, height, options);
		//this.body.collisionFilter = defaultCategory | blueCategory;
		//this.body.label = label;
		Matter.World.add(world, this.body); //add to the matter world
		
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.label = label;
	}

	body() {
		return this.body; //return the created body
	}

	show() {
		let pos = this.body.position; //create an shortcut alias 
		let angle = this.body.angle;

		push(); //p5 translation 
		//	stroke("#000000");
		//	fill('#ffffff');
		//	rectMode(CENTER); //switch centre to be centre rather than left, top
			translate(pos.x, pos.y);
			rotate(angle);
		//	rect(0, 0, this.width, this.height);
			imageMode(CENTER);
			image(crateimage, 0, 0, this.width, this.height);
		pop();
	}
}


class c_fuzzball {
	constructor(x, y, diameter, label) {
		let options = {
			restitution: 0.90,
			friction: 0.005,
			density: 0.95,
			frictionAir: 0.005,
			label: label,
			visible: true,
			collisionFilter: {
				category: Category2,
			}
		}
		this.body = Matter.Bodies.circle(x, y, diameter/2, options); //matter.js used radius rather than diameter
		//this.body.label = label;
		Matter.Body.setMass(this.body, 1000);
		Matter.World.add(world, this.body);
		
		this.x = x;
		this.y = y;
		this.diameter = diameter;
		this.label = label;
	}

	body() {
		return this.body;
	}

	destroy() {
		//remove the body from the matter engine 'world' - so that it doesnt need to keep thinking about it
		Matter.World.remove(world, this.body);
	}


	show() {
		let pos = this.body.position;
		let angle = this.body.angle;

		push(); //p5 translation 
			translate(pos.x, pos.y);
			rotate(angle);
		//	fill('#ffffff');
		//	ellipseMode(CENTER); //switch centre to be centre rather than left, top
		//	circle(0, 0, this.diameter);
			imageMode(CENTER);
			image(fuzzimage, 0, 0, this.diameter, this.diameter);
		pop();
	}
}