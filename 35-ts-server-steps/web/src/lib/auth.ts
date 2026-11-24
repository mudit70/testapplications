import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { db } from "@/db";
import { session, user } from "@/db/schema";

// Database sessions: auth() reads the session row and its user through the adapter.
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, { usersTable: user, sessionsTable: session }),
  providers: [GitHub],
  callbacks: {
    async session(params) {
      return params.session;
    },
  },
});
