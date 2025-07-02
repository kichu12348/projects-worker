import { Context } from "hono";
import { checkUserToken } from "./db";

export async function cookieCheck(c: Context, next: any): Promise<any> {
  const authHeader = c.req.header("Authorization");
  const token = authHeader ? authHeader.split(" ")[1] : undefined;

  if (!token) {
    return c.json({ error: "Unauthorized", test: JSON.stringify(c.req.header("cookie")) }, 401);
  }

  const isValid: boolean | null = await checkUserToken(token, c.env);
  if (!isValid) return c.json({ error: "Unauthorized", test: JSON.stringify(c.req.header("cookie")) }, 401);
  return next();
}

export async function authCheck(c: Context): Promise<any> {
  const authToken: string | undefined = c.req.param("token");
  const isValid: boolean | null = await checkUserToken(authToken, c.env);
  if (!authToken || !isValid)
    return c.json({ error: "Unauthorized", valid: false }, 401);
  return c.json({ message: "Authorized", valid: true });
}
