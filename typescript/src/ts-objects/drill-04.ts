interface Dictionary {
  [key: string]: string;
}

const greetings: Dictionary = {
  en: "Hello",
  fr: "Bonjour",
  es: "Hola"
};

console.log(greetings);

interface Dictionary2 {
  [key: string]: string | number;
}

const greetings2: Dictionary2 = {
  en: "Hello",
  fr: "Bonjour",
  de: 123,   
  it: "Ciao"
};

console.log(greetings2);