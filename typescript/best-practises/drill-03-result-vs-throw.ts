function parseThrow(raw: any) {
  if (typeof raw.port !== "number") {
    throw new Error("Port must be a number");
  }

  return { port: raw.port };
}

try {
  const config = parseThrow({});
  console.log("Config:", config);
} catch (e) {
  console.log("Caught:", (e as Error).message);
}

function parseResult(raw: any) {
  if (typeof raw.port !== "number") {
    return { ok: false, error: "Port must be a number" };
  }

  return { ok: true, value: { port: raw.port } };
}

const result = parseResult({});

if (result.ok) {
  console.log("Config:", result.value);
} else {
  console.log("Error:", result.error);
}