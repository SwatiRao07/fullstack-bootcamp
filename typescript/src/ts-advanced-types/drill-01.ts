export {};

type Status = "loading" | "success" | "error";


function handle(status: Status) {
  switch (status) {
    case "loading":
      console.log("Loading...");
      break;
    case "success":
      console.log("Success!");
      break;
    case "error":
      console.log("Error occurred.");
      break;
    default:
      const _exhaustiveCheck: never = status;
      return _exhaustiveCheck;
  }
}
