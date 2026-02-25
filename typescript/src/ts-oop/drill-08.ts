class Logger {
  info(message: string) {
    console.log("[INFO]", message);
  }
  warn(message: string) {
    console.log("[WARN]", message);
  }
  error(message: string) {
    console.log("[ERROR]", message);
  }
}

const logger = new Logger();

logger.info("App started");
logger.warn("Battery low");
logger.error("Something failed");


class ValidationResult {
  constructor(
    public success: boolean,
    public errors: string[] = []
  ) {}

  isValid(): boolean {
    return this.success;
  }
}

const result3 = new ValidationResult(true);
console.log(result3.isValid());

const result4 = new ValidationResult(false, ["Email is invalid"]);
console.log(result4.errors);