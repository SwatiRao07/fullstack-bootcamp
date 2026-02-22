function hi(name: string, age: number = 18) {
  if (age !== undefined) {
    console.log(`Hi ${name}, you are ${age} years old.`);
  } else {
    console.log(`Hi ${name}`);
  }
}

hi("riya", undefined)