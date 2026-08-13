import peasy.*;

PShape myModel;
PeasyCam cam;

float moveSpeed = 5;

void setup() {
  size(1000, 1000, P3D);

  cam = new PeasyCam(this, 100);
  cam.setMinimumDistance(50);
  cam.setMaximumDistance(10000);

  myModel = loadShape("jwst_james_webb_space_telescope.obj");
}

void draw() {
  background(0);
  
  lights();

  // Move camera with WASD
  handleMovement();

  // Rotate the model
  rotateY(frameCount * 0.01);

  scale(2);

  shape(myModel);
}

void handleMovement() {

  double[] position = cam.getPosition();

  float x = (float) position[0];
  float y = (float) position[1];
  float z = (float) position[2];

  if (keyPressed) {

    // W = forward
    if (key == 'w' || key == 'W') {
      z -= moveSpeed;
    }

    // S = backward
    if (key == 's' || key == 'S') {
      z += moveSpeed;
    }

    // A = left
    if (key == 'a' || key == 'A') {
      x -= moveSpeed;
    }

    // D = right
    if (key == 'd' || key == 'D') {
      x += moveSpeed;
    }

    cam.setPosition(x, y, z);
  }
}
