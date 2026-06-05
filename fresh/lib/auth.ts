import { deleteCookie, setCookie } from "@std/http";
import { and, eq, gt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import {
  EMAIL_REGEX,
  MIN_PASSWORD_LENGTH,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/constants.ts";
import { type User, user, userSession } from "@/lib/db/schema.ts";
import "@std/dotenv/load";

const PASSWORD_PREFIX = "pbkdf2:v1";
const PASSWORD_ITERATIONS = 310_000;
const PASSWORD_SALT_BYTES = 16;
const PASSWORD_KEY_BITS = 256;
const SESSION_TOKEN_BYTES = 32;
const textEncoder = new TextEncoder();

const databaseUrl = Deno.env.get("DATABASE_URL");

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const db = drizzle(databaseUrl);

export interface AuthUser {
  email: string;
  id: string;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= MIN_PASSWORD_LENGTH;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(PASSWORD_SALT_BYTES);
  const key = await derivePasswordKey(password, salt, PASSWORD_ITERATIONS);

  return `${PASSWORD_PREFIX}:${PASSWORD_ITERATIONS}:${toHex(salt)}:${toHex(
    key
  )}`;
}

export async function verifyPassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  const [algorithm, version, iterations, salt, storedKey] =
    passwordHash.split(":");

  if (
    `${algorithm}:${version}` !== PASSWORD_PREFIX ||
    !(iterations && salt && storedKey)
  ) {
    return false;
  }

  const iterationCount = Number(iterations);
  const key = await derivePasswordKey(password, fromHex(salt), iterationCount);
  const stored = fromHex(storedKey);

  return constantTimeEqual(key, stored);
}

export async function createUser({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AuthUser> {
  const normalizedEmail = normalizeEmail(email);

  if (!validateEmail(normalizedEmail)) {
    throw new Error(`Invalid email: ${email}`);
  }

  if (!validatePassword(password)) {
    throw new Error(
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
    );
  }

  const [created] = await db
    .insert(user)
    .values({
      email: normalizedEmail,
      passwordHash: await hashPassword(password),
    })
    .returning({ id: user.id, email: user.email });

  return created;
}

export async function verifyUserCredentials({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AuthUser | null> {
  const normalizedEmail = normalizeEmail(email);
  const [found] = await db
    .select()
    .from(user)
    .where(eq(user.email, normalizedEmail))
    .limit(1);

  if (!(found && (await verifyPassword(password, found.passwordHash)))) {
    return null;
  }

  return toAuthUser(found);
}

export async function createSession(userId: string): Promise<string> {
  const token = toHex(randomBytes(SESSION_TOKEN_BYTES));
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);

  await db.insert(userSession).values({
    userId,
    tokenHash: await hashSessionToken(token),
    expiresAt,
  });

  return token;
}

export async function getUserBySessionToken(
  token: string | undefined
): Promise<AuthUser | null> {
  if (!token) {
    return null;
  }

  const [row] = await db
    .select({ user })
    .from(userSession)
    .innerJoin(user, eq(user.id, userSession.userId))
    .where(
      and(
        eq(userSession.tokenHash, await hashSessionToken(token)),
        gt(userSession.expiresAt, new Date())
      )
    )
    .limit(1);

  return row ? toAuthUser(row.user) : null;
}

export async function deleteSession(token: string | undefined): Promise<void> {
  if (!token) {
    return;
  }

  await db
    .delete(userSession)
    .where(eq(userSession.tokenHash, await hashSessionToken(token)));
}

export function setSessionCookie(headers: Headers, token: string): void {
  setCookie(headers, {
    name: SESSION_COOKIE,
    value: token,
    path: "/",
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export function deleteSessionCookie(headers: Headers): void {
  deleteCookie(headers, SESSION_COOKIE, { path: "/" });
}

async function hashSessionToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    textEncoder.encode(token)
  );

  return toHex(new Uint8Array(digest));
}

function toAuthUser(row: User): AuthUser {
  return {
    id: row.id,
    email: row.email,
  };
}

async function derivePasswordKey(
  password: string,
  salt: Uint8Array,
  iterations: number
): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    {
      hash: "SHA-256",
      iterations,
      name: "PBKDF2",
      salt: toArrayBuffer(salt),
    },
    key,
    PASSWORD_KEY_BITS
  );

  return new Uint8Array(bits);
}

function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);

  return bytes;
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

function fromHex(value: string): Uint8Array {
  if (value.length % 2 !== 0) {
    throw new Error("Invalid hex value");
  }

  const bytes = new Uint8Array(value.length / 2);

  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = Number.parseInt(value.slice(i * 2, i * 2 + 2), 16);
  }

  return bytes;
}

function constantTimeEqual(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) {
    return false;
  }

  let diff = 0;

  for (let i = 0; i < left.length; i += 1) {
    // biome-ignore lint/suspicious/noBitwiseOperators: Constant-time byte comparison needs bitwise operations.
    diff |= left[i] ^ right[i];
  }

  return diff === 0;
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  ) as ArrayBuffer;
}
