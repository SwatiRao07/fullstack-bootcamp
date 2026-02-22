let name: string = "Thea";
let rollno: number = 16;
let isWorking: boolean = true;

console.log(name)

let data: any = "hello";
data = 42;
data = true;
data = { name: "Thea" };
// data.toUpperCase(); 

let info: unknown = "hello";

info = 42;
info = true;
// value.toUpperCase(); 

if (typeof info === "string") {
  console.log(info.toUpperCase()); 
}

let city: string = "Pune";

// city = null;       
// city = undefined; 

const country = "India";
let country2 = "India";