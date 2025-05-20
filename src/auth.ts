import { Context } from "hono";
import { checkUserToken } from "./db";

export async function cookieCheck(c: Context, next: any): Promise<any> {
  const cookie = c.req
    .header("cookie")
    ?.split(";")
    .find((c) => c.trim().startsWith("admin-auth="))
    ?.split("=")[1]
    .trim();
  
  const isValid: boolean|null = await checkUserToken(cookie,c.env);
  if (!cookie || !isValid) return c.json({ error: "Unauthorized" }, 401);
  return next();
}
