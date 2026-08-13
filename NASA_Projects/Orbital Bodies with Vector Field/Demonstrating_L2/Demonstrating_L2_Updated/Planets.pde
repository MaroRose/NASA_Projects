class Planet{
  
  float radius = 10;
  PVector pos,velo,acc;
  
  Planet(PVector pos_, PVector velo_, PVector acc_, float r_){
    
    this.pos = new PVector(0,0,0);
    this.velo = new PVector(0,0,0);
    this.acc = new PVector(0,0,0);
    
    this.pos = pos_;
    this.velo = velo_;
    this.acc = acc_;
    
    this.radius = r_;
    
  }
  
  void display(){
    
    
    translate(this.pos.x,this.pos.y);
    fill(255);
    sphere(this.radius);
    
  
  }



}
