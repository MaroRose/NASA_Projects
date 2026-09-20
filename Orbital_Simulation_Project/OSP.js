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
    loadTable(
        "K2_Archive_Processed.csv",
        "csv",
        "header",
        (table) => {
            csvFile = table;
            console.log(tableToString(csvFile));
        },
        (error) => {
            console.error("Could not load K2_Archive_Processed.csv", error);
        }
    );
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

function numberFromRow(row, columnName) {
    const value = Number(row.getString(columnName));
    return Number.isFinite(value) ? value : null;
}

function loadBodiesFromCsv() {
    if (!csvFile) {
        console.warn("CSV data is unavailable; no bodies were loaded.");
        return;
    }

    const orbitalScale = 250;
    const earthMassInSolarMasses = 3.003e-6;
    const earthRadiusInPixels = 2;
    const gravitationalConstant = 60;
    let hostName = null;
    let hostMass = null;
    let hostRadius = null;

    for (let rowIndex = 0; rowIndex < csvFile.getRowCount(); rowIndex++) {
        const row = csvFile.getRow(rowIndex);
        const isPreferredRow = row.getString("default_flag") === "1";
        const semiMajorAxis = numberFromRow(row, "pl_orbsmax");
        const planetMass = numberFromRow(row, "pl_bmasse");
        const planetRadius = numberFromRow(row, "pl_rade");
        const starMass = numberFromRow(row, "st_mass");
        const starRadius = numberFromRow(row, "st_rad");

        if (!isPreferredRow || semiMajorAxis === null || planetMass === null ||
            planetRadius === null || starMass === null || starRadius === null) {
            continue;
        }

        hostName = row.getString("hostname");
        hostMass = starMass;
        hostRadius = starRadius;
        break;
    }

    if (hostName === null) {
        console.warn("No complete orbital records were found in K2_Archive.csv.");
        return;
    }

    bodies.push(new Body(
        hostName,
        color(255, 210, 70),
        hostMass,
        max(hostRadius * 10, 8),
        new p5.Vector(0, 0),
        new p5.Vector(0, 0),
        new p5.Vector(0, 0)
    ));

    for (let rowIndex = 0; rowIndex < csvFile.getRowCount(); rowIndex++) {
        const row = csvFile.getRow(rowIndex);
        const semiMajorAxis = numberFromRow(row, "pl_orbsmax");
        const planetMass = numberFromRow(row, "pl_bmasse");
        const planetRadius = numberFromRow(row, "pl_rade");

        if (row.getString("hostname") !== hostName ||
            row.getString("default_flag") !== "1" ||
            semiMajorAxis === null || planetMass === null || planetRadius === null) {
            continue;
        }

        const orbitalRadius = semiMajorAxis * orbitalScale;
        const orbitalSpeed = sqrt(gravitationalConstant * hostMass / orbitalRadius);
        const angle = bodies.length * 0.8;

        bodies.push(new Body(
            row.getString("pl_name"),
            color(100, 180, 255),
            planetMass * earthMassInSolarMasses,
            max(planetRadius * earthRadiusInPixels, 1),
            new p5.Vector(cos(angle) * orbitalRadius, sin(angle) * orbitalRadius),
            new p5.Vector(-sin(angle) * orbitalSpeed, cos(angle) * orbitalSpeed),
            new p5.Vector(0, 0)
        ));
    }
}


function setup(){
    createCanvas(windowWidth, windowHeight);

    loadBodiesFromCsv();
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