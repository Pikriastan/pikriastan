import { parseArgs } from "@std/cli/parse-args";
import { promptSecret } from "@std/cli/prompt-secret";
import {
  createUser,
  normalizeEmail,
  validateEmail,
  validatePassword,
} from "@/lib/auth.ts";
import { MIN_PASSWORD_LENGTH } from "@/lib/constants.ts";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

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
  const email = await resolveEmail(options);
  const password = resolvePassword(options);

  if (!(email && password)) {
    fail("Email and password are required");
  }

  try {
    const user = await createUser({ email, password });
    console.log(`User ${user.email} was successfully created`);
    Deno.exit(0);
  } catch (error) {
    fail(error instanceof Error ? error.message : "Failed to create the user");
  }
}

async function resolveEmail(
  options: CreateAdminOptions
): Promise<string | undefined> {
  let email = options.mail ? normalizeEmail(options.mail) : undefined;

  if (email && !validateEmail(email)) {
    fail(`Invalid email: ${email}`);
  }

  if (!(options.interaction || email)) {
    fail("--mail is required when using --no-interaction");
  }

  while (options.interaction && !email) {
    email = normalizeEmail(await readLine("Email: "));

    if (!validateEmail(email)) {
      console.error("Enter a valid email.");
      email = undefined;
    }
  }

  return email;
}

function resolvePassword(options: CreateAdminOptions): string | undefined {
  if (options.password && !validatePassword(options.password)) {
    fail(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }

  if (!(options.interaction || options.password)) {
    fail("--password is required when using --no-interaction");
  }

  return options.password ?? promptPassword();
}

function promptPassword(): string | undefined {
  let password: string | undefined;

  while (!password) {
    password = promptSecret("Password: ") ?? undefined;

    if (password && !validatePassword(password)) {
      console.error(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
      );
      password = undefined;
    }
  }

  return password;
}

async function readLine(label: string): Promise<string> {
  await Deno.stdout.write(textEncoder.encode(label));

  const buffer = new Uint8Array(1024);
  const bytesRead = await Deno.stdin.read(buffer);

  if (bytesRead === null) {
    return "";
  }

  return textDecoder.decode(buffer.subarray(0, bytesRead)).trim();
}

function usage(error?: string): never {
  if (error) {
    console.error(error);
  }

  console.error(`Usage:
  deno run -A cli.ts create-admin-user [options]

Options:
  -m, --mail <email>       Admin email
  -p, --password <value>   Admin password
  --no-interaction         Fail instead of prompting for missing values`);
  Deno.exit(error ? 1 : 0);
}

function fail(message: string): never {
  console.error(message);
  Deno.exit(1);
}
