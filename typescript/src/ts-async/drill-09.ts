async function backgroundLog(msg: string) {
  await new Promise(r => setTimeout(r, 500));
  console.log("Background log finished:", msg);
}

function userAction() {
  console.log("User clicked button");

  backgroundLog("Button Clicked").catch(err => console.error(err));
  
  console.log("Control returned to UI immediately");
}

userAction();
