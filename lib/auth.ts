import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import {
  account,
  accountRelations,
  session,
  sessionRelations,
  user,
  userRelations,
  verification,
} from "./db/auth-schema";
import { db } from "./db/queries";

export const auth = betterAuth({
  plugins: [nextCookies()],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      userRelations,
      account,
      accountRelations,
      session,
      sessionRelations,
      verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
});
