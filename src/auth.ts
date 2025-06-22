import { Context } from "hono";
import { checkUserToken } from "./db";

export async function cookieCheck(c: Context, next: any): Promise<any> {
  const cookie = c.req
    .header("cookie")
    ?.split(";")
    .find((c) => c.trim().startsWith("admin-auth="))
    ?.split("=")[1]
    .trim();

  console.log("Cookie:", cookie);
  console.log("Header:", c.req.header("cookie"));

  if (!cookie) {
    return c.json({ error: "Unauthorized",test:JSON.stringify(c.req.header("cookie")) }, 401);
  }

  const isValid: boolean | null = await checkUserToken(cookie, c.env);
  if (!isValid) return c.json({ error: "Unauthorized",test:JSON.stringify(c.req.header("cookie")) }, 401);
  return next();
}

export async function authCheck(c: Context): Promise<any> {
  const authToken: string | undefined = c.req.param("token");
  const isValid: boolean | null = await checkUserToken(authToken, c.env);
  if (!authToken || !isValid)
    return c.json({ error: "Unauthorized", valid: false }, 401);
  return c.json({ message: "Authorized", valid: true });
}
