var particles = [],
	attractors = [];

/*
* init
*/
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(180, 80);

  for (var i = 0; i < 200; i++) {
  	var offset = 100;
  	var x = random(offset, windowWidth-offset),
  		y = random(offset, windowHeight-offset);

  	particles.push(new Particle(x, y));
  }

  for (var i = 0; i < 5; i++) {
  	var wOffset = windowWidth/3;
  	var hOffset = windowHeight/3;
  	var x = random(wOffset, windowWidth-wOffset),
  		y = random(hOffset, windowHeight-hOffset);

  	attractors.push(new Attractor(x, y));
  }
}

/*
* animate it
*/
function draw() {
	// draw all attractors on random positions
	for (var i = 0; i < attractors.length; i++) {
		attractors[i].display();
	}

	// let's draw all particles first and
	for (var i = 0; i < particles.length; i++) {
		particles[i].update();
		particles[i].display();

		// than we apply forces of all attractors to particle and calculate direction
		for (var j = 0; j < attractors.length; j++) {
			var attraction = attractors[j].calculateForce(particles[i]);
			particles[i].applyForce(attraction);
		}	
	}
}


/*
* particle object
*/

function Particle(x, y) {
	this.pos = createVector(x, y);
	var randomvel = random(2);
	this.vel = createVector(randomvel, randomvel);
	this.acc = createVector(0, 0);
	this.mass = random(1, 10);

	this.applyForce = function(force) {
		var f = force.copy();
		f.div(this.mass);
		this.acc.add(f);
	}

	this.update = function() {
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.mult(0);
	}

	this.display = function() {
		fill(0, 5);
		noStroke();
		ellipse(this.pos.x, this.pos.y, 2, 2);
	}
}

/*
* attractor object
*/

function Attractor(x, y) {
	this.pos = createVector(x, y);
	this.mass = random(1, 5);

	this.calculateForce = function(particle) {
		var force = p5.Vector.sub(this.pos, particle.pos);
		var distance = force.mag();
		var unit = force.normalize();

		distance = constrain(distance, 5, 25);
		strength = this.mass * particle.mass / (distance * distance);
		force.mult(strength);
		return force;
	}

	this.display = function() {
		fill(0, 0);
		noStroke();
		ellipse(this.pos.x, this.pos.y, 5, 5);
	}
}