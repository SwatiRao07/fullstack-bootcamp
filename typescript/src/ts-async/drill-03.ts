type User3 = {
  id: string;
  name: string;
};

async function fetchUser(id: string): Promise<User3> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
        if (id === 'error') {
            reject(new Error(`Failed to fetch user ${id}`));
        } else {
            resolve({ id, name: `User ${id}` });
        }
    }, 500);
  });
}

async function runDrill3() {
  console.log("--- Sequential ---");
  const startSeq = Date.now();
  const u1 = await fetchUser("1");
  const u2 = await fetchUser("2");
  const endSeq = Date.now();
  console.log(`Sequential took: ${endSeq - startSeq}ms`);

  console.log("\n--- Parallel ---");
  const startPar = Date.now();
  const [a, b] = await Promise.all([fetchUser("3"), fetchUser("4")]);
  const endPar = Date.now();
  console.log(`Parallel took: ${endPar - startPar}ms`);
  console.log("Users:", a.name, b.name);

  console.log("\n--- Promise.allSettled ---");
  const results = await Promise.allSettled([
    fetchUser("5"),
    fetchUser("error"),
    fetchUser("7")
  ]);

  results.forEach((result, idx) => {
    if (result.status === 'fulfilled') {
      console.log(`Index ${idx} success:`, result.value.name);
    } else {
      console.log(`Index ${idx} failure:`, result.reason.message);
    }
  });
}

runDrill3();
