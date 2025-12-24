import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { registerChatRoutes } from "./replit_integrations/chat";
import { openai } from "./replit_integrations/image/client"; // Reusing openai client
import OpenAI from "openai";
import { seed } from "./seed";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Seed Database
  seed().catch(console.error);

  // Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);
  registerChatRoutes(app);

  // === FARMS ===
  app.get(api.farms.list.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const farms = await storage.getFarmsByUserId(userId);
    res.json(farms);
  });

  app.post(api.farms.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const input = api.farms.create.input.parse(req.body);
      const userId = req.user.claims.sub;
      const farm = await storage.createFarm({ ...input, userId });
      res.status(201).json(farm);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.get(api.farms.get.path, isAuthenticated, async (req: any, res) => {
    const farm = await storage.getFarm(Number(req.params.id));
    if (!farm) return res.status(404).json({ message: "Farm not found" });
    
    // Check ownership
    if (farm.userId !== req.user.claims.sub) {
       return res.status(403).json({ message: "Unauthorized" });
    }

    const crops = await storage.getCropsByFarmId(farm.id);
    const activities = await storage.getActivitiesByFarmId(farm.id);
    res.json({ ...farm, crops, activities });
  });

  // === CROPS ===
  app.post(api.crops.create.path, isAuthenticated, async (req, res) => {
    const farmId = Number(req.params.farmId);
    const input = api.crops.create.input.parse(req.body);
    const crop = await storage.createCrop({ ...input, farmId });
    res.status(201).json(crop);
  });

  // === ACTIVITIES ===
  app.post(api.activities.create.path, isAuthenticated, async (req, res) => {
    const farmId = Number(req.params.farmId);
    const input = api.activities.create.input.parse(req.body);
    const activity = await storage.createActivity({ ...input, farmId });
    res.status(201).json(activity);
  });

  app.get(api.activities.list.path, isAuthenticated, async (req, res) => {
    const farmId = Number(req.params.farmId);
    const activities = await storage.getActivitiesByFarmId(farmId);
    res.json(activities);
  });

  // === ADVISORIES (AI) ===
  app.get(api.advisories.list.path, isAuthenticated, async (req, res) => {
    const farmId = Number(req.params.farmId);
    const advisories = await storage.getAdvisoriesByFarmId(farmId);
    res.json(advisories);
  });

  app.post(api.advisories.generate.path, isAuthenticated, async (req, res) => {
    const farmId = Number(req.params.farmId);
    const farm = await storage.getFarm(farmId);
    if (!farm) return res.status(404).json({ message: "Farm not found" });

    // AI Generation Logic
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [
          { role: "system", content: "You are an expert agricultural advisor. Generate a short, actionable advisory based on farm details." },
          { role: "user", content: `Farm: ${farm.name}, Type: ${farm.type}, Location: ${JSON.stringify(farm.location)}. Generate a weather-based advisory.` }
        ],
        max_completion_tokens: 200,
      });

      const message = completion.choices[0].message.content || "No advisory generated.";
      
      const advisory = await storage.createAdvisory({
        farmId,
        type: "AI_GENERATED",
        message,
        data: { generated: true }
      });
      
      res.status(201).json(advisory);
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ message: "Failed to generate advisory" });
    }
  });

  // === TRACEABILITY (PUBLIC) ===
  app.get(api.traceability.get.path, async (req, res) => {
    const data = await storage.getTraceabilityData(req.params.batchIdentifier);
    if (!data) return res.status(404).json({ message: "Batch not found" });
    res.json(data);
  });

  return httpServer;
}
