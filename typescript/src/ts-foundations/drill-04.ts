function processValue(value: string | number) {
  if (typeof value === "string") {
    console.log(value.toUpperCase());
  } else {
    console.log(value.toFixed(2));
  }
}

processValue(94)
processValue("divya")

function withNull(value: string | number | null) {
  if (value === null) {
    console.log("Value is null");
  } else if (typeof value === "string") {
    console.log(value.toUpperCase());
  } else {
    console.log(value.toFixed(2));
  }
}

withNull(null)

function formatInput(input: string | Date) {
  if (input instanceof Date) {
    console.log(input.toISOString());
  } else {
    console.log(input.toUpperCase());
  }
}

formatInput(new Date());
formatInput("hello");

function handleData(data: string | string[]) {
  if (Array.isArray(data)) {
    data.forEach(item => console.log(item.toUpperCase()));
  } else {
    console.log(data.toUpperCase());
  }
}

handleData(["apple", "banana"]);