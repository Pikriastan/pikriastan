import { createUser, createUserSchema } from "@/lib/auth.ts";
import { parseArgs } from "@std/cli/parse-args";
import { promptSecret } from "@std/cli/prompt-secret";

interface CreateAdminOptions {
  interaction: boolean;
  mail?: string;
  password?: string;
}

const [command, ...commandArgs] = Deno.args;

if (command === "create-admin-user") {
  await createAdminUser(parseCreateAdminOptions(commandArgs));
} else {
  usage(command ? `Unknown command: ${command}` : undefined);
}

function parseCreateAdminOptions(args: string[]): CreateAdminOptions {
  const parsed = parseArgs(args, {
    alias: {
      m: "mail",
      p: "password",
    },
    boolean: ["no-interaction"],
    string: ["mail", "password"],
  });

  return {
    interaction: parsed["no-interaction"] !== true,
    mail: parsed.mail,
    password: parsed.password,
  };
}

async function createAdminUser(options: CreateAdminOptions) {
  const input = createUserSchema.safeParse(resolveUserInput(options));

  if (!input.success) {
    fail(input.error.issues.map((issue) => issue.message).join("\n"));
  }

  try {
    const user = await createUser(input.data);
    // deno-lint-ignore no-console
    console.log(`User ${user.email} was successfully created`);
    Deno.exit(0);
  } catch (error) {
    fail(error instanceof Error ? error.message : "Failed to create the user");
  }
}

function resolveUserInput(
  options: CreateAdminOptions,
): { email: string; password: string } {
  const email = options.mail ?? (options.interaction ? prompt("Email:") : "");
  const password = options.password ?? promptPassword(options.interaction);

  if (!options.interaction && !options.mail) {
    fail("--mail is required when using --no-interaction");
  }

  if (!options.interaction && !options.password) {
    fail("--password is required when using --no-interaction");
  }

  return { email: email ?? "", password };
}

function promptPassword(interaction: boolean): string {
  return interaction ? promptSecret("Password: ") ?? "" : "";
}

function usage(error?: string): never {
  if (error) {
    // deno-lint-ignore no-console
    console.error(error);
  }

  // deno-lint-ignore no-console
  console.error(`Usage:
  deno run -A cli.ts create-admin-user [options]

Options:
  -m, --mail <email>       Admin email
  -p, --password <value>   Admin password
  --no-interaction         Fail instead of prompting for missing values`);
  Deno.exit(error ? 1 : 0);
}

function fail(message: string): never {
  // deno-lint-ignore no-console
  console.error(message);
  Deno.exit(1);
}
