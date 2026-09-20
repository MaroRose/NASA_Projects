let csvFile;

function tableToString(table) {
    let str = "";

    for(let r = 0; r < table.getRowCount(); r++){
        for(let c = 0; c < table.getColumnCount(); c++){
            str += table.getString(r, c) + ",";
        }
    }
    return str;
}

function preload(){
    //Read in the CSV file
    csvFile = loadTable("K2_Archive.csv", "csv", "header");

    //Table to String
    console.log(tableToString(csvFile));

}

let zoom = 1;

function mouseWheel(event) {
    zoom *= event.delta > 0 ? 0.9 : 1.1;
    zoom = constrain(zoom, 0.1, 5);
    return 0;
}

function drawGrid() {
    const gridSize = 100;
    const horizontalLimit = width / zoom;
    const verticalLimit = height / zoom;

    stroke(35);
    strokeWeight(1 / zoom);

    for(let x = -horizontalLimit; x <= horizontalLimit; x += gridSize){
        line(x, -verticalLimit, x, verticalLimit);
    }

    for(let y = -verticalLimit; y <= verticalLimit; y += gridSize){
        line(-horizontalLimit, y, horizontalLimit, y);
    }
}


class Body{

    constructor(name, color, mass, radius, position, velocity, acceleration){

        this.name = name;
        this.color = color;
        this.mass = mass;
        this.radius = radius;

        this.position = position;
        this.velocity = velocity;
        this.acceleration = acceleration;
    }

    update(otherBodies) {
    const gravitationalConstant = 60;

    this.acceleration.set(0, 0);


    for (let i = 0; i < otherBodies.length; i++) {
        const otherBody = otherBodies[i];

        if (this === otherBody) {
            continue;
        }

        const direction = p5.Vector.sub(
            otherBody.position,
            this.position
        );

        const distanceSquared = max(direction.magSq(), 0.0001);
        const accelerationMagnitude =
            gravitationalConstant * otherBody.mass / distanceSquared;

        direction.setMag(accelerationMagnitude);
        this.acceleration.add(direction);
    }

    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
}

    display(){
        noStroke();
        fill(this.color);
        line(this.position.x, this.position.y, this.position.x + this.velocity.x, this.position.y + this.velocity.y);
        ellipse(this.position.x, this.position.y, this.radius, this.radius);

        stroke(255);
        

    }
}



let bodies = [];


function setup(){
    createCanvas(windowWidth, windowHeight);

    bodies.push(new Body("Sol", color(255,255,0), 1000, 500, new p5.Vector(0,0), new p5.Vector(0,0), new p5.Vector(0,0)));
    bodies.push(new Body("Sol C", color(0,0,255), 40, 50, new p5.Vector(1000,0), new p5.Vector(-5,5), new p5.Vector(0,0)));
 
}


function draw(){

    background(0);

    push();
    translate(width/2, height/2);
    scale(zoom, -zoom);

    
    // Add gridlines that scale with zooming

    drawGrid();


    // Display Celestial Bodies

    for(let i = 0; i < bodies.length; i++){

        let celestialBody = bodies[i];

        celestialBody.update(bodies);

        celestialBody.display();
    }

    pop();
}