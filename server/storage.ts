// Referenced from javascript_database blueprint - updated for WorkWave profiles
import { profiles, type Profile, type InsertProfile } from "../shared/schema.js";
import { eq, ilike, or, and } from "drizzle-orm";

// Lazily import the database connection. In many dev environments the
// DATABASE_URL won't be provided (or the developer doesn't want to spin up
// a DB). Importing `./db` at module load time causes the process to throw
// if DATABASE_URL is missing. To make the app resilient we import the DB
// only when needed and fall back to an in-memory store when no database is
// available.

let _db: any | undefined;
async function getDb() {
  if (_db) return _db;
  try {
    const mod = await import("./db");
    _db = mod.db;
    return _db;
  } catch (err) {
    // DB is not available; leave _db undefined and let callers use the
    // in-memory fallback implementation.
    return undefined;
  }
}

export interface IStorage {
  // Profile operations
  getProfile(id: string): Promise<Profile | undefined>;
  getAllProfiles(): Promise<Profile[]>;
  getPublicProfiles(): Promise<Profile[]>;
  searchProfiles(query: string, filters?: { skill?: string; location?: string }): Promise<Profile[]>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: string, profile: Partial<InsertProfile>): Promise<Profile | undefined>;
  deleteProfile(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getProfile(id: string): Promise<Profile | undefined> {
    const db = await getDb();
    if (!db) {
      // in-memory fallback
      return undefined;
    }
    const [profile] = await db.select().from(profiles).where(eq(profiles.id, id));
    return profile || undefined;
  }

  async getAllProfiles(): Promise<Profile[]> {
    const db = await getDb();
    if (!db) return [];
    return await db.select().from(profiles).orderBy(profiles.createdAt);
  }

  async getPublicProfiles(): Promise<Profile[]> {
    const db = await getDb();
    if (!db) return [];
    return await db
      .select()
      .from(profiles)
      .where(eq(profiles.isPublic, true))
      .orderBy(profiles.createdAt);
  }

  async searchProfiles(
    query: string,
    filters?: { skill?: string; location?: string }
  ): Promise<Profile[]> {
    let conditions = [];

    // Text search in name, skill, location
    if (query) {
      conditions.push(
        or(
          ilike(profiles.name, `%${query}%`),
          ilike(profiles.skill, `%${query}%`),
          ilike(profiles.location, `%${query}%`)
        )
      );
    }

    // Filter by skill
    if (filters?.skill) {
      conditions.push(ilike(profiles.skill, `%${filters.skill}%`));
    }

    // Filter by location
    if (filters?.location) {
      conditions.push(ilike(profiles.location, `%${filters.location}%`));
    }

    // Only show public profiles in search
    conditions.push(eq(profiles.isPublic, true));

    const db = await getDb();
    if (!db) return [];

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    return await db
      .select()
      .from(profiles)
      .where(whereClause)
      .orderBy(profiles.createdAt);
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const db = await getDb();
    if (!db) {
      // naive in-memory create fallback
      const now = new Date().toISOString();
      const profile: any = { ...insertProfile, id: String(Math.random()).slice(2), createdAt: now };
      return profile as Profile;
    }
    const [profile] = await db
      .insert(profiles)
      .values(insertProfile)
      .returning();
    return profile;
  }

  async updateProfile(
    id: string,
    updateData: Partial<InsertProfile>
  ): Promise<Profile | undefined> {
    const db = await getDb();
    if (!db) return undefined;
    const [profile] = await db
      .update(profiles)
      .set(updateData)
      .where(eq(profiles.id, id))
      .returning();
    return profile || undefined;
  }

  async deleteProfile(id: string): Promise<boolean> {
    const db = await getDb();
    if (!db) return false;
    const result = await db.delete(profiles).where(eq(profiles.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }
}

export const storage = new DatabaseStorage();
