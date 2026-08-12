double x_max, y_max,z_max;
PVector[] coordinates;

void setup() {
  fullScreen(P3D, 2);
  background(0);
  noStroke();
  fill(102);
  
  x_max = 4000;
  y_max = 2000;
  z_max = 1000;
  
  
  for(int i = 0; i < x_max; i++){
  for(int j = 0; j < y_max; j++){
  for(int k = 0; k < z_max; k++){
    
    coordinates = PVector.add(new PVector(i));
      
  }
    }
      }
}
