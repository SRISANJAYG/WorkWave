import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { insertProfileSchema } from "../shared/schema.js";
import { generateProfileContent } from "./openai.js";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all public profiles (for browse page)
  app.get("/api/profiles", async (req, res) => {
    try {
      const profiles = await storage.getPublicProfiles();
      res.json(profiles);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      res.status(500).json({ error: "Failed to fetch profiles" });
    }
  });

  // Search profiles with filters
  app.get("/api/profiles/search", async (req, res) => {
    try {
      const { q = "", skill, location } = req.query;
      
      const profiles = await storage.searchProfiles(
        q as string,
        {
          skill: skill as string | undefined,
          location: location as string | undefined,
        }
      );
      
      res.json(profiles);
    } catch (error) {
      console.error("Error searching profiles:", error);
      res.status(500).json({ error: "Failed to search profiles" });
    }
  });

  // Get single profile by ID
  app.get("/api/profiles/:id", async (req, res) => {
    try {
      const profile = await storage.getProfile(req.params.id);
      
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  // Generate AI content for profile
  app.post("/api/profiles/generate", async (req, res) => {
    try {
      const generateSchema = z.object({
        name: z.string().min(1),
        skill: z.string().min(1),
        location: z.string().min(1),
        languages: z.array(z.string()),
        experience: z.string().min(1),
        workingHours: z.string().min(1),
      });

      const data = generateSchema.parse(req.body);
      
      const generatedContent = await generateProfileContent(data);
      
      res.json(generatedContent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid input data", details: error.errors });
      }
      console.error("Error generating profile content:", error);
      res.status(500).json({ error: "Failed to generate profile content" });
    }
  });

  // Create new profile
  app.post("/api/profiles", async (req, res) => {
    try {
      const data = insertProfileSchema.parse(req.body);
      const profile = await storage.createProfile(data);
      res.status(201).json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid profile data", details: error.errors });
      }
      console.error("Error creating profile:", error);
      res.status(500).json({ error: "Failed to create profile" });
    }
  });

  // Update profile
  app.patch("/api/profiles/:id", async (req, res) => {
    try {
      const data = insertProfileSchema.partial().parse(req.body);
      const profile = await storage.updateProfile(req.params.id, data);
      
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid profile data", details: error.errors });
      }
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // Delete profile
  app.delete("/api/profiles/:id", async (req, res) => {
    try {
      const success = await storage.deleteProfile(req.params.id);
      
      if (!success) {
        return res.status(404).json({ error: "Profile not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting profile:", error);
      res.status(500).json({ error: "Failed to delete profile" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
