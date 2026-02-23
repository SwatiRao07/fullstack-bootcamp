interface Car {
  make: string;
  model: string;
}

const myCar: Car = {
  make: "BMW",
  model: "M5"
};

console.log(myCar);

type Bike = {
  make: string;
  gears: number;
};

const myBike: Bike = {
  make: "yamaha",
  gears: 21
};

console.log(myBike);

interface ElectricCar extends Car {
  batteryCapacity: number; // in kWh
}

const tesla: ElectricCar = {
  make: "Tesla",
  model: "Model 3",
  batteryCapacity: 75
};

console.log(tesla);

type ElectricBike = Bike & {
  batteryCapacity: number;
};

const ebike: ElectricBike = {
  make: "Specialized",
  gears: 18,
  batteryCapacity: 500 
};

console.log(ebike);