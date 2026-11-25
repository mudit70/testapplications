import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export const db = drizzle(createClient({ url: "file:teams.db" }), { schema });
