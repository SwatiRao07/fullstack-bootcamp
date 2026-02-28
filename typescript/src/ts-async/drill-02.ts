type User2 = {
  id: string;
  name: string;
};

async function fetchUser2(id: string): Promise<User2> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: `User ${id}` });
    }, 500);
  });
}

async function getUserInfo(id: string) {
  console.log("Fetching user...");
  const user = await fetchUser2(id);
  console.log("User received:", user.name);
  return user;
}

async function accidentalPromise() {
  const userPromise = fetchUser2("123"); 
  console.log("This is a promise object, not the user:", userPromise);
  
  const user = await userPromise;
  console.log("Now we have the user:", user.name);
}

getUserInfo("1");
accidentalPromise();
