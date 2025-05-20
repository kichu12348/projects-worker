import { Context } from "hono";

export function cookieCheck(c: Context, next: any): any {
  const cookie = c.req
    .header("cookie")
    ?.split(";")
    .find((c) => c.trim().startsWith("admin-auth="))
    ?.split("=")[1];
  if (!cookie || cookie !== "true") {
    return c.json({ error: "Unauthorized" }, 401);
  }
  return next();
}
