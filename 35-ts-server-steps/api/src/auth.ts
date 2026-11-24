import type { Request } from "express";
import { expressjwt as jwt } from "express-jwt";

const getTokenFromHeaders = (req: Request): string | undefined => {
  const [scheme, token] = (req.headers.authorization ?? "").split(" ");
  return scheme === "Token" || scheme === "Bearer" ? token : undefined;
};

const auth = {
  required: jwt({
    secret: process.env.JWT_SECRET ?? "change-me",
    getToken: getTokenFromHeaders,
    algorithms: ["HS256"],
  }),
  optional: jwt({
    secret: process.env.JWT_SECRET ?? "change-me",
    credentialsRequired: false,
    getToken: getTokenFromHeaders,
    algorithms: ["HS256"],
  }),
};

export default auth;
