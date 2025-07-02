import { initialProjects, Project } from "./seed";
import { D1Database } from "@cloudflare/workers-types";

export async function initDatabase(env?: any): Promise<boolean | void> {
  const db = getDb(env);
  try {
    await db.exec(
      "CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL,description TEXT NOT NULL,tech TEXT NOT NULL,features TEXT NOT NULL,links TEXT NOT NULL,collaborators TEXT)"
    );
    await db.exec(
      "CREATE TABLE IF NOT EXISTS contact_form (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,email TEXT NOT NULL,message TEXT,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
    );
    return true;
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

export function getDb(env?: any): D1Database {
  if (process.env.NODE_ENV === "development" && (!env || !env.DB)) {
    return {
      prepare: () => ({
        bind: () => ({ first: () => null, all: () => ({ results: [] }) }),
        first: () => null,
        all: () => ({ results: [] }),
      }),
      exec: async () => {},
      batch: async () => [],
      dump: async () => new Uint8Array(),
    } as unknown as D1Database;
  }

  if (!env || !env.DB) {
    throw new Error(
      "Database binding not found. Make sure you have configured the D1 database in wrangler.toml and are passing the env object correctly."
    );
  }
  return env.DB;
}

export async function seedProjects(env?: any): Promise<boolean> {
  console.log("Checking if database needs seeding...");
  const db = getDb(env);

  try {
    await db
      .prepare(
        `
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        tech TEXT NOT NULL,
        features TEXT NOT NULL,
        links TEXT NOT NULL,
        collaborators TEXT
      );

      CREATE TABLE IF NOT EXISTS contact_form (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `
      )
      .run();

    const countResult = await db
      .prepare("SELECT COUNT(*) as count FROM projects")
      .first();
    const count = Number(countResult?.count) || 0;

    if (count > 0) {
      console.log(
        `Database already contains ${count} projects. No seeding needed.`
      );
      return false;
    }

    console.log("Database is empty, seeding with initial projects...");

    await db.batch(
      initialProjects.map((project) =>
        db
          .prepare(
            `
        INSERT INTO projects (title, description, tech, features, links, collaborators)
        VALUES (?, ?, ?, ?, ?, ?)
      `
          )
          .bind(
            project.title,
            project.description,
            JSON.stringify(project.tech),
            JSON.stringify(project.features),
            JSON.stringify(project.links),
            project.collaborators ? JSON.stringify(project.collaborators) : null
          )
      )
    );

    console.log(
      `Successfully seeded ${initialProjects.length} projects to the database`
    );

    return true;
  } catch (error) {
    console.error("Error seeding data:", error);
    throw error;
  }
}

export async function getProjects(env?: any): Promise<Project[] | null> {
  try {
    const db = getDb(env);
    const projects = await db.prepare("SELECT * FROM projects").all();

    if (!projects.results || projects.results.length === 0) {
      return null;
    }

    // Parse JSON fields
    return projects.results.map((project: any) => ({
      ...project,
      tech:
        typeof project.tech === "string"
          ? JSON.parse(project.tech)
          : project.tech,
      features:
        typeof project.features === "string"
          ? JSON.parse(project.features)
          : project.features,
      links:
        typeof project.links === "string"
          ? JSON.parse(project.links)
          : project.links,
      collaborators:
        project.collaborators && typeof project.collaborators === "string"
          ? JSON.parse(project.collaborators)
          : project.collaborators,
    }));
  } catch (error) {
    console.error("Error getting projects:", error);
    throw error;
  }
}

export async function getProjectById(
  id: number,
  env?: any
): Promise<any | null> {
  try {
    const db = getDb(env);
    const project = await db
      .prepare("SELECT * FROM projects WHERE id = ?")
      .bind(id)
      .first();

    if (!project) {
      return null;
    }

    return {
      ...project,
      tech:
        typeof project.tech === "string"
          ? JSON.parse(project.tech)
          : project.tech,
      features:
        typeof project.features === "string"
          ? JSON.parse(project.features)
          : project.features,
      links:
        typeof project.links === "string"
          ? JSON.parse(project.links)
          : project.links,
      collaborators:
        project.collaborators && typeof project.collaborators === "string"
          ? JSON.parse(project.collaborators)
          : project.collaborators,
    };
  } catch (error) {
    console.error("Error getting project by ID:", error);
    throw error;
  }
}

export async function addProject(
  project: Project,
  env?: any
): Promise<any | null> {
  try {
    const db = getDb(env);
    const result = await db
      .prepare(
        `
      INSERT INTO projects (title, description, tech, features, links, collaborators)
      VALUES (?, ?, ?, ?, ?, ?)
    `
      )
      .bind(
        project.title,
        project.description,
        JSON.stringify(project.tech),
        JSON.stringify(project.features),
        JSON.stringify(project.links),
        project.collaborators ? JSON.stringify(project.collaborators) : null
      )
      .run();

    return result;
  } catch (error) {
    console.error("Error adding project:", error);
    throw error;
  }
}

export async function updateProject(
  id: number,
  project: Project,
  env?: any
): Promise<any | null> {
  try {
    const db = getDb(env);
    const result = await db
      .prepare(
        `UPDATE projects
          SET title = ?, description = ?, tech = ?, features = ?, links = ?, collaborators = ?
          WHERE id = ?`
      )
      .bind(
        project.title,
        project.description,
        JSON.stringify(project.tech),
        JSON.stringify(project.features),
        JSON.stringify(project.links),
        project.collaborators ? JSON.stringify(project.collaborators) : null,
        id
      )
      .run();

    return result;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
}

export async function deleteProject(
  id: number,
  env?: any
): Promise<any | null> {
  try {
    const db = getDb(env);
    const result = await db
      .prepare("DELETE FROM projects WHERE id = ?")
      .bind(id)
      .run();
    return result;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
}

export async function dropDatabase(env?: any): Promise<any | null> {
  return;
  try {
    const db = getDb(env);
    await db.exec("DROP TABLE IF EXISTS projects");
  } catch (error) {
    console.error("Error dropping database:", error);
    throw error;
  }
}

const randomString = (length: number): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$@!%*?&";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export async function getUserToken(env: any): Promise<string | null> {
  try {
    const db: D1Database = getDb(env);
    await db
      .prepare(
        "CREATE TABLE IF NOT EXISTS user_tokens (token TEXT PRIMARY KEY)"
      )
      .run();

    const token = randomString(32);

    await db
      .prepare("INSERT OR REPLACE INTO user_tokens (token) VALUES (?)")
      .bind(token)
      .run();
    return token;
  } catch (error) {
    console.error("Error getting user token:", error);
    throw error;
  }
}

export async function checkUserToken(
  token: string | undefined,
  env: any
): Promise<boolean | null> {
  if (!token) return false;
  try {
    const db: D1Database = getDb(env);
    const result = await db
      .prepare(
        "SELECT token,COUNT(*) AS count FROM user_tokens WHERE token = ?"
      )
      .bind(token)
      .first();
    const count = Number(result?.count) || 0;
    const isValid = result && count > 0 && result.token === token;
    return isValid;
  } catch (error) {
    console.error("Error checking user token:", error);
    throw error;
  }
}

interface ContactFormEntry {
  name: string;
  email: string;
  message: string;
}

//contact form functions

export async function addContactFormEntry(
  entry: ContactFormEntry,
  env?: any
): Promise<any | null> {
  try {
    const db = getDb(env);
    const result = await db
      .prepare(
        `
      INSERT INTO contact_form (name, email, message)
      VALUES (?, ?, ?)
    `
      )
      .bind(entry.name, entry.email, entry.message)
      .run();

    return result;
  } catch (error) {
    console.error("Error adding contact form entry:", error);
    throw error;
  }
}

export async function getContactFormEntries(
  env?: any
): Promise<ContactFormEntry[] | null> {
  try {
    const db = getDb(env);
    const entries = await db.prepare("SELECT * FROM contact_form").all();

    if (!entries.results || entries.results.length === 0) {
      return null;
    }

    return entries.results.map((entry: any) => ({
      name: entry.name,
      email: entry.email,
      message: entry.message,
    }));
  } catch (error) {
    console.error("Error getting contact form entries:", error);
    throw error;
  }
}
