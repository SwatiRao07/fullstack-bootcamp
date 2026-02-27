type Status = "loading" | "success" | "error";

function handle(status: Status): void {
  switch (status) {
    case "loading":
      console.log("Loading...");
      break;

    case "success":
      console.log("Success!");
      break;

    case "error":
      console.log("Something went wrong.");
      break;

    default:
      const exhaustiveCheck: never = status;
      return exhaustiveCheck;
  }
}
