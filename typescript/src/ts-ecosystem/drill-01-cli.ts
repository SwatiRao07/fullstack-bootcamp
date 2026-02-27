import { Command } from "commander";

const program = new Command();

program
  .name("greet-cli")
  .description("A simple greeting CLI built with Commander")
  .version("1.0.0");

program
  .command("greet <name>")
  .description("Print a greeting for <name>")
  .option("-u, --uppercase", "Print the greeting in UPPER CASE", false)
  .option("-t, --times <n>", "How many times to repeat the greeting", "1")
  .action((name: string, opts: { uppercase: boolean; times: string }) => {
    const count = parseInt(opts.times, 10);

    if (isNaN(count) || count < 1) {
      console.error(
        `--times must be a positive integer, received: "${opts.times}"`
      );
      process.exit(1);
    }

    let greeting = `Hello, ${name}!`;

    if (opts.uppercase) {
      greeting = greeting.toUpperCase();
    }

    for (let i = 0; i < count; i++) {
      console.log(greeting);
    }
  });

program.parse(process.argv);
