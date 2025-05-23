import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  getProjects,
  getProjectById,
  seedProjects,
  deleteProject,
  updateProject,
  addProject,
  dropDatabase,
  getUserToken,
} from "./db";
import { D1Database } from "@cloudflare/workers-types";
import { authCheck, cookieCheck } from "./auth";

interface Env {
  [key: string]: unknown;
}

type AppEnv = Env & {
  DB: D1Database;
};

const app = new Hono<{ Bindings: AppEnv }>();

app.use("/api/*", cors(
  {
    origin: "https://www.kichu.space",
    allowHeaders: ["content-type", "X-Custom-Header", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS", "DELETE", "PUT"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    credentials: true,
  }
));
app.use(
  "/api/v2/*",
  cors({
    origin: "https://www.kichu.space",
    allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  })
);

app.get("/", (c) => {
  return c.text("hola da Worker is working abbarently");
});

app.get("/api/projects", async (c) => {
  try {
    const projects = await getProjects(c.env);
    if (!projects) {
      return c.json({ error: "No projects found" }, 404);
    }
    return c.json(projects);
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    return c.json(
      { error: "Failed to fetch projects", details: error.message },
      500
    );
  }
});

app.get("/api/projects/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const project = await getProjectById(Number(id), c.env);
    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }
    return c.json(project);
  } catch (error: any) {
    console.error("Error fetching project:", error);
    return c.json(
      { error: "Failed to fetch project", details: error.message },
      500
    );
  }
});

// app.get("/api/seed", async (c) => {
//   try {
//     console.log(c.env);
//     const result = await seedProjects(c.env);
//     if (!result) {
//       return c.json({ message: "Projects already seeded" });
//     }
//     return c.json({ message: "Projects seeded successfully" });
//   } catch (error: any) {
//     console.error("Error seeding database:", error);
//     return c.json(
//       { error: "Failed to seed database", details: error.message },
//       500
//     );
//   }
// });

app.post("/api/projects", cookieCheck, async (c) => {
  try {
    const project = await c.req.json();
    const newProject = await addProject(project, c.env);
    return c.json(newProject, 201);
  } catch (error: any) {
    console.error("Error adding project:", error);
    return c.json(
      { error: "Failed to add project", details: error.message },
      500
    );
  }
});

app.put("/api/projects/:id", cookieCheck, async (c) => {
  try {
    const id = c.req.param("id");
    const project = await c.req.json();
    const updatedProject = await updateProject(Number(id), project, c.env);
    if (!updatedProject) {
      return c.json({ error: "Project not found" }, 404);
    }
    return c.json(updatedProject);
  } catch (error: any) {
    console.error("Error updating project:", error);
    return c.json(
      { error: "Failed to update project", details: error.message },
      500
    );
  }
});

app.delete("/api/projects/:id", cookieCheck, async (c) => {
  try {
    const id = c.req.param("id");
    const deletedProject = await deleteProject(Number(id), c.env);
    if (!deletedProject) {
      return c.json({ error: "Project not found" }, 404);
    }
    return c.json({ message: "Project deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting project:", error);
    return c.json(
      { error: "Failed to delete project", details: error.message },
      500
    );
  }
});

app.get("/api/user-token", async (c) => {
  try {
    const token = await getUserToken(c.env);
    if (!token) {
      return c.json({ error: "No token found" }, 404);
    }
    return c.json({ token });
  } catch (error: any) {
    console.error("Error fetching user token:", error);
    return c.json(
      { error: "Failed to fetch user token", details: error.message },
      500
    );
  }
});

app.get("/api/auth/is-valid/:token", authCheck);

// app.get("/api/drop", async (c) => {
//   try {
//     const result = await dropDatabase(c.env);
//     if (!result) {
//       return c.json({ message: "Database already dropped" });
//     }
//     return c.json({ message: "Database dropped successfully" });
//   } catch (error: any) {
//     console.error("Error dropping database:", error);
//     return c.json(
//       { error: "Failed to drop database", details: error.message },
//       500
//     );
//   }
// });

// Debug endpoint to check environment
app.get("/debug/env", (c) => {
  return c.json({
    hasDb: !!c.env.DB,
    envKeys: Object.keys(c.env),
    nodeEnv: process.env.NODE_ENV,
  });
});

export default app;
