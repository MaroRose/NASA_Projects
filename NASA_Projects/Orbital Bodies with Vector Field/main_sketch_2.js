let myModel;

function preload() {
  // Load the OBJ file from the models folder
  myModel = loadModel("jwst_james_webb_space_telescope.obj", true);
}

function setup() {
  createCanvas(1000, 1000, WEBGL);

  // Smooth rendering
  smooth();
}

function draw() {
  background(30);

  // Lighting
  ambientLight(100);
  directionalLight(255, 255, 255, 0, 0, -1);

  //flip upside down
  rotateZ(PI);

  // Mouse-controlled camera
  orbitControl();

  // Adjust the size of the model
  scale(2);

  // Display the model
  model(myModel);
}

