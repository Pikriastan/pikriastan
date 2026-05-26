import { genSaltSync, hashSync } from "bcrypt-ts";
import { uuid } from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";

export const primaryKeyId = () =>
  uuid("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => uuidv7());

export function generateHashedPassword(password: string) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);

  return hash;
}
