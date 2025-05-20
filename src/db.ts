import { initialProjects, Project } from './seed';
import { D1Database } from '@cloudflare/workers-types';

export function getDb(env?: any): D1Database {
  if (process.env.NODE_ENV === 'development' && (!env || !env.DB)) {
    return {
      prepare: () => ({
        bind: () => ({ first: () => null, all: () => ({ results: [] }) }),
        first: () => null,
        all: () => ({ results: [] })
      }),
      exec: async () => {},
      batch: async () => [],
      dump: async () => new Uint8Array()
    } as unknown as D1Database;
  }
  
  if (!env || !env.DB) {
    throw new Error('Database binding not found. Make sure you have configured the D1 database in wrangler.toml and are passing the env object correctly.');
  }
  return env.DB;
}

export async function seedProjects(env?: any): Promise<boolean> {
  console.log('Checking if database needs seeding...');
  const db = getDb(env);
  
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        tech TEXT NOT NULL,
        features TEXT NOT NULL,
        links TEXT NOT NULL,
        collaborators TEXT
      )
    `).run();

    const countResult = await db.prepare('SELECT COUNT(*) as count FROM projects').first();
    const count = Number(countResult?.count) || 0;
    
    if (count > 0) {
      console.log(`Database already contains ${count} projects. No seeding needed.`);
      return false;
    }
    
    console.log('Database is empty, seeding with initial projects...');

    await db.batch(initialProjects.map(project => 
      db.prepare(`
        INSERT INTO projects (title, description, tech, features, links, collaborators)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        project.title,
        project.description,
        JSON.stringify(project.tech),
        JSON.stringify(project.features),
        JSON.stringify(project.links),
        project.collaborators ? JSON.stringify(project.collaborators) : null
      )
    ));
    
    console.log(`Successfully seeded ${initialProjects.length} projects to the database`);

    return true;
    
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
}

export async function getProjects(env?: any): Promise<Project[] | null> {
  try {
    const db = getDb(env);
    const projects = await db.prepare('SELECT * FROM projects').all();
    
    if (!projects.results || projects.results.length === 0) {
      return null;
    }
    
    // Parse JSON fields
    return projects.results.map((project: any) => ({
      ...project,
      tech: typeof project.tech === 'string' ? JSON.parse(project.tech) : project.tech,
      features: typeof project.features === 'string' ? JSON.parse(project.features) : project.features,
      links: typeof project.links === 'string' ? JSON.parse(project.links) : project.links,
      collaborators: project.collaborators && typeof project.collaborators === 'string' ? JSON.parse(project.collaborators) : project.collaborators
    }));
  } catch (error) {
    console.error('Error getting projects:', error);
    throw error;
  }
}

export async function getProjectById(id: number, env?: any): Promise<any | null> {
  try {
    const db = getDb(env);
    const project = await db.prepare('SELECT * FROM projects WHERE id = ?').bind(id).first();
    
    if (!project) {
      return null;
    }

    return {
        ...project,
      tech: typeof project.tech === 'string' ? JSON.parse(project.tech) : project.tech,
      features: typeof project.features === 'string' ? JSON.parse(project.features) : project.features,
      links: typeof project.links === 'string' ? JSON.parse(project.links) : project.links,
      collaborators: project.collaborators && typeof project.collaborators === 'string' ? JSON.parse(project.collaborators) : project.collaborators
    };
  } catch (error) {
    console.error('Error getting project by ID:', error);
    throw error;
  }
}

export async function addProject(project: Project, env?: any): Promise<any | null> {
  try {
    const db = getDb(env);
    const result = await db.prepare(`
      INSERT INTO projects (title, description, tech, features, links, collaborators)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      project.title,
      project.description,
      JSON.stringify(project.tech),
      JSON.stringify(project.features),
      JSON.stringify(project.links),
      project.collaborators ? JSON.stringify(project.collaborators) : null
    ).run();

    return result;
  } catch (error) {
    console.error('Error adding project:', error);
    throw error;
  }
}

export async function updateProject(id: number, project: Project, env?: any): Promise<any | null> {
  try {
    const db = getDb(env);
    const result = await db.prepare(`
      UPDATE projects
      SET title = ?, description = ?, tech = ?, features = ?, links = ?, collaborators = ?
      WHERE id = ?
    `).bind(
      project.title,
      project.description,
      JSON.stringify(project.tech),
      JSON.stringify(project.features),
      JSON.stringify(project.links),
      project.collaborators ? JSON.stringify(project.collaborators) : null,
      id
    ).run();

    return result;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}


export async function deleteProject(id: number, env?: any): Promise<any | null> {
  try {
    const db = getDb(env);
    const result = await db.prepare('DELETE FROM projects WHERE id = ?').bind(id).run();
    return result;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

export async function dropDatabase(env?: any): Promise<any | null> {
  return;
  try {
    const db = getDb(env);
    await db.exec('DROP TABLE IF EXISTS projects');
  } catch (error) {
    console.error('Error dropping database:', error);
    throw error;
  }
}