
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
    csvFile = loadTable("K2_Archive_test.csv", "csv", "header");

    //Table to String
    console.log(tableToString(csvFile));

}

function setup(){
    createCanvas(windowWidth, windowHeight);
    //center the canvas


}

class NaturalSatellite {
    constructor(name, mass, radius, semiMajorAxis, eccentricity, inclination, longitudeOfAscendingNode, argumentOfPeriapsis, meanAnomalyAtEpoch) {
        this.name = name;
        this.mass = mass;
        this.radius = radius;
        this.semiMajorAxis = semiMajorAxis;
        this.eccentricity = eccentricity;
        this.inclination = inclination;
        this.longitudeOfAscendingNode = longitudeOfAscendingNode;
        this.argumentOfPeriapsis = argumentOfPeriapsis;
        this.meanAnomalyAtEpoch = meanAnomalyAtEpoch;

        this.position = new p5.Vector(0, 0);
        this.velocity = new p5.Vector(0, 0);
        this.acceleration = new p5.Vector(0, 0);
    }

    getName() {
        return this.name;
    }

    calculateGravitationalForce(otherSatellite) {
        let G = 6.67430e-11;
        let r = p5.Vector.dist(this.position, otherSatellite.position);
        let force = G * this.mass * otherSatellite.mass / (r * r);
        let direction = p5.Vector.sub(otherSatellite.position, this.position).normalize();
        return p5.Vector.mult(direction, force);
    }

    update() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }

    display(colorValue) {
        fill(colorValue);
        noStroke();
        ellipse(this.position.x, this.position.y, 20, 20);
    }
}

//Generate two natural satellites

let naturalSatellite1 = new NaturalSatellite("Satellite 1", 5.972e24, 6371e3, 1.496e11, 0.0167, 0, 0, 0, 0);
let naturalSatellite2 = new NaturalSatellite("Satellite 2", 7.348e22, 1737e3, 3.844e8, 0.0549, 5.145, 0, 0, 0);



function draw(){
    background(0);

    
    translate(windowWidth/2, windowHeight/2);

    //Display Axis Lines
    strokeWeight(2);
    stroke(255);
    line(-windowWidth/2, 0, windowWidth/2, 0);
    line(0, -windowHeight/2, 0, windowHeight/2);
    

    //Calculate gravitational forces
    let forceOn1 = naturalSatellite1.calculateGravitationalForce(naturalSatellite2);
    let forceOn2 = naturalSatellite2.calculateGravitationalForce(naturalSatellite1);

    //Update accelerations
    naturalSatellite1.acceleration.add(p5.Vector.div(forceOn1, naturalSatellite1.mass));
    naturalSatellite2.acceleration.add(p5.Vector.div(forceOn2, naturalSatellite2.mass));

    //Update positions
    naturalSatellite1.update();
    naturalSatellite2.update();

    //Display satellites
    naturalSatellite1.display(color(0, 0, 255));
    naturalSatellite2.display(color(255, 0, 0));




   
}