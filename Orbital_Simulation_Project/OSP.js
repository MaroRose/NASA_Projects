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
    if (!isMouseOnCanvas()) {
        return;
    }

    zoom *= event.delta > 0 ? 0.9 : 1.1;
    zoom = constrain(zoom, 0.1, 5);
    return 0;
}

let offsetX = 0; // Current horizontal scroll offset
let offsetY = 0; // Current vertical scroll offset
let startX, startY; // Mouse position when drag starts
let isDragging = false;

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

let gravitationalConst = 48;
let velocityDisplayScale = 25;

function drawVectorArrow(origin, vector, scale) {
    const displayedVector = p5.Vector.mult(vector, scale);

    if (displayedVector.magSq() === 0) {
        return;
    }

    const arrowTip = p5.Vector.add(origin, displayedVector);
    const arrowHeadLength = constrain(displayedVector.mag() * 0.2, 8, 30);
    const arrowAngle = displayedVector.heading();
    const leftArrowHead = p5.Vector.fromAngle(
        arrowAngle + Math.PI * 0.8,
        arrowHeadLength
    );
    const rightArrowHead = p5.Vector.fromAngle(
        arrowAngle - Math.PI * 0.8,
        arrowHeadLength
    );

    stroke(255);
    strokeWeight(10);
    line(origin.x, origin.y, arrowTip.x, arrowTip.y);
    line(arrowTip.x, arrowTip.y,
        arrowTip.x + leftArrowHead.x,
        arrowTip.y + leftArrowHead.y);
    line(arrowTip.x, arrowTip.y,
        arrowTip.x + rightArrowHead.x,
        arrowTip.y + rightArrowHead.y);
}

let trailLength = 800;

function createSimulationControls() {
    const controls = createDiv();
    controls.id('simulation-controls');

    const controlDefinitions = [
        {
            label: 'Gravitational constant',
            min: 1,
            max: 100,
            step: 1,
            value: gravitationalConst,
            update: value => gravitationalConst = value
        },
        {
            label: 'Velocity arrow scale',
            min: 1,
            max: 100,
            step: 1,
            value: velocityDisplayScale,
            update: value => velocityDisplayScale = value
        },
        {
            label: 'Trail length',
            min: 0,
            max: 2000,
            step: 10,
            value: trailLength,
            update: value => trailLength = value
        }
    ];

    for (const definition of controlDefinitions) {
        const group = createDiv();
        group.parent(controls);
        group.class('simulation-control');

        const valueLabel = createSpan();
        valueLabel.parent(group);

        const slider = createSlider(
            definition.min,
            definition.max,
            definition.value,
            definition.step
        );
        slider.parent(group);

        const updateControl = () => {
            const value = Number(slider.value());
            definition.update(value);
            valueLabel.html(`${definition.label}: ${value}`);
        };

        slider.input(updateControl);
        updateControl();
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
        this.positionTrail = [];
    }

    update(otherBodies) {

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
                gravitationalConst * otherBody.mass / distanceSquared;

            direction.setMag(accelerationMagnitude);
            this.acceleration.add(direction);
        }

        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);

        this.positionTrail.push(this.position.copy());

        if (this.positionTrail.length > trailLength) {
            this.positionTrail.shift();
        }
    }

    display(){
        noFill();
        stroke(255, 100);
        strokeWeight(2);

        for (let trailIndex = 1; trailIndex < this.positionTrail.length; trailIndex++) {
            const previousPosition = this.positionTrail[trailIndex - 1];
            const currentPosition = this.positionTrail[trailIndex];
            strokeWeight(10);
            line(previousPosition.x, previousPosition.y,
                currentPosition.x, currentPosition.y);
        }

        noStroke();
        fill(this.color);
        ellipse(this.position.x, this.position.y, this.radius, this.radius);

        
        drawVectorArrow(this.position, this.velocity, velocityDisplayScale);
    }

}

function calculateBarycenter(bodyA, bodyB) {
    const totalMass = bodyA.mass + bodyB.mass;
    const position = p5.Vector.add(
        p5.Vector.mult(bodyA.position, bodyA.mass / totalMass),
        p5.Vector.mult(bodyB.position, bodyB.mass / totalMass)
    );
    const velocity = p5.Vector.add(
        p5.Vector.mult(bodyA.velocity, bodyA.mass / totalMass),
        p5.Vector.mult(bodyB.velocity, bodyB.mass / totalMass)
    );

    return { position, velocity, totalMass };
}

function calculateOrbit(position, velocity, mu) {
    const radius = position.mag();
    const speedSquared = velocity.magSq();

    const energy = speedSquared / 2 - mu / radius;

    // Elliptical orbit only
    if (energy >= 0) {
        return null; // Parabolic or hyperbolic trajectory
    }

    const semiMajorAxis = -mu / (2 * energy);

    // For 2D vectors, the cross product's z component is sufficient.
    const angularMomentum =
        position.x * velocity.y -
        position.y * velocity.x;

    const eccentricitySquared =
        1 + (2 * energy * angularMomentum ** 2) / (mu ** 2);

    const eccentricity = Math.sqrt(Math.max(0, eccentricitySquared));
    const semiMinorAxis =
        semiMajorAxis * Math.sqrt(1 - eccentricity ** 2);

    const eccentricityVector = new p5.Vector(
        ((speedSquared - mu / radius) * position.x -
            position.dot(velocity) * velocity.x) / mu,
        ((speedSquared - mu / radius) * position.y -
            position.dot(velocity) * velocity.y) / mu
    );

    return {
        semiMajorAxis,
        semiMinorAxis,
        eccentricity,
        eccentricityVector
    };
}


let bodies = [];

function isMouseOnCanvas() {
    return mouseX >= 0 && mouseX <= width &&
        mouseY >= 0 && mouseY <= height;
}

function setup(){
    createCanvas(windowWidth, windowHeight);
    createSimulationControls();

    bodies.push(new Body("Sol", color(255,255,0), 1000, 500, new p5.Vector(0,0), new p5.Vector(0,0), new p5.Vector(0,0)));
    bodies.push(new Body("Sol C", color(0,0,255), 40, 50, new p5.Vector(1000,0), new p5.Vector(-5,5), new p5.Vector(0,0)));
}

let onCanvas = false;

function draw(){
    background(0);    

        push();
            translate(width/2 + offsetX, height/2 + offsetY);
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

function mousePressed() {
        onCanvas = isMouseOnCanvas();

        if (onCanvas) {
    isDragging = true;
    startX = mouseX - offsetX;
    startY = mouseY - offsetY;
        }
}

function mouseDragged() {
    onCanvas = isMouseOnCanvas();

    if (isDragging && onCanvas) {
    // Update offsets based on mouse movement
    offsetX = mouseX - startX;
    offsetY = mouseY - startY;
  }
}

function mouseReleased() {
  isDragging = false;
}

