import { input, password } from "@inquirer/prompts";
import { Command } from "commander";
import { auth } from "./lib/auth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

interface CreateAdminOptions {
  interaction?: boolean;
  mail?: string;
  name?: string;
  password?: string;
}

const cli = new Command();

cli.name("amiranas-butiki").description("CLI for creating admin users");

function isPromptCancel(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.name === "ExitPromptError" ||
      error.message.includes("force closed the prompt"))
  );
}

function fail(message: string): never {
  cli.error(message);
  process.exit(1);
}

cli
  .command("create-admin-user")
  .description("Create admin panel user")
  .option("-n, --name <name>", "Admin name")
  .option("-m, --mail <email>", "Admin email")
  .option("-p, --password <password>", "Admin password")
  .option("--no-interaction", "Fail instead of prompting for missing values")
  .action(async (options: CreateAdminOptions) => {
    let name = options.name;
    let email = options.mail;
    let pwd = options.password;

    if (email && !EMAIL_REGEX.test(email)) {
      cli.error(`Invalid email: ${email}`);
    }

    if (pwd && pwd.length < MIN_PASSWORD_LENGTH) {
      cli.error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
    }

    if (options.interaction === false) {
      if (!email) {
        cli.error("--mail is required when using --no-interaction");
      }
      if (!pwd) {
        cli.error("--password is required when using --no-interaction");
      }
    } else {
      if (!name) {
        name = await input({
          message: "Name:",
        });
      }

      if (!email) {
        email = await input({
          message: "Email:",
          validate: (value) => EMAIL_REGEX.test(value) || "Enter a valid email",
        });
      }

      if (!pwd) {
        pwd = await password({
          message: "Password:",
          mask: "*",
          validate: (value) =>
            value.length >= MIN_PASSWORD_LENGTH ||
            `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
        });
      }
    }

    if (!(name && email && pwd)) {
      fail("Email and password are required");
    }

    const response = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password: pwd,
      },
    });

    if (response.token) {
      console.log(`User ${email} was successfully created`);
    } else {
      cli.error("Failed to create the user");
    }
  });

cli.parseAsync().catch((error: unknown) => {
  if (isPromptCancel(error)) {
    console.log("\nCancelled.");
    process.exit(0);
  }

  throw error;
});
