type SimpleResult<T> = { ok: true; data: T } | { ok: false; error: string };

async function fetchSmallData(id: number): Promise<SimpleResult<string>> {
  if (id < 0) return { ok: false, error: "Invalid ID" };
  return { ok: true, data: `Data for ${id}` };
}

async function runDrill8() {
  const res = await fetchSmallData(-1);
  if (!res.ok) {
    console.log("Error handled via Result:", res.error);
  }

  try {
    throw new Error("Unexpected Crash!");
  } catch (err: any) {
    console.log("Caught exception:", err.message);
  }
}

runDrill8();
