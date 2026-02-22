let valueAny: any = "hello";
let valueUnknown: unknown = "hello";

valueAny.toUpperCase();   
valueAny.toFixed(2);        

if (typeof valueUnknown === "string") {
  console.log(valueUnknown.toUpperCase());
}


