class Phone {
  call() {
    console.log("Calling");
  }
}

class Smartphone extends Phone {
  takePhoto() {
    console.log("Taking photo");
  }
}

const myPhone = new Smartphone();

myPhone.call(); 
myPhone.takePhoto(); 


class Engine {
  start() {
    console.log("Engine started");
  }
}

class Car {
  private engine = new Engine();

  drive() {
    this.engine.start();
    console.log("Car is moving");
  }
}

const car = new Car();
car.drive();