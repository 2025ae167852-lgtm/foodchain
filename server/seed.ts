import { storage } from "./storage";
import { db } from "./db";
import { users } from "@shared/models/auth";
import { eq } from "drizzle-orm";

export async function seed() {
  const existingUser = await db.select().from(users).limit(1);
  if (existingUser.length > 0) return;

  console.log("Seeding database...");

  // Create a demo user (This won't have a password for login, but useful for structure)
  // Replit Auth handles real users. We'll just create a farm for the first user that logs in?
  // Or we can create a dummy user for testing if we bypass auth.
  // Since we use Replit Auth, we can't easily seed a "loginable" user without their real ID.
  // So we will seed *static* data that doesn't depend on user, or just wait for first user.
  
  // Actually, we can seed some public data?
  // Traceability events are public.
  // Let's create a dummy "Demo Farm" and some batches.
  // We need a userId for the farm. I'll use a placeholder 'demo-user'.
  
  const demoUserId = 'demo-user';
  
  // Upsert user (to avoid FK violation if we enforced it, though auth users table is used)
  await storage.upsertUser({
    id: demoUserId,
    email: 'demo@example.com',
    firstName: 'Demo',
    lastName: 'Farmer',
  });

  const farm = await storage.createFarm({
    userId: demoUserId,
    name: "Green Valley Organics",
    location: { lat: 34.0522, lng: -118.2437 },
    size: 50.5,
    type: "Organic"
  });

  const crop = await storage.createCrop({
    farmId: farm.id,
    name: "Heirloom Tomatoes",
    variety: "Cherokee Purple",
    plantingDate: new Date("2024-03-15"),
    expectedHarvestDate: new Date("2024-07-01"),
    status: "harvested"
  });

  const batch = await db.insert(require("@shared/schema").batches).values({
    farmId: farm.id,
    cropId: crop.id,
    batchIdentifier: "BATCH-2024-GT-001",
    quantity: 500,
    harvestDate: new Date("2024-07-02"),
    status: "processing"
  }).returning();
  
  const batchId = batch[0].id;

  await db.insert(require("@shared/schema").traceabilityEvents).values([
    {
      batchId,
      stage: "Harvest",
      location: "Field A, Green Valley",
      handler: "John Doe",
      timestamp: new Date("2024-07-02T08:00:00Z"),
      details: "Hand-picked at peak ripeness."
    },
    {
      batchId,
      stage: "Transport",
      location: "Transit to Processing Center",
      handler: "Logistics Co.",
      timestamp: new Date("2024-07-02T14:00:00Z"),
    },
    {
      batchId,
      stage: "Processing",
      location: "Processing Center #4",
      handler: "FreshPack Inc.",
      timestamp: new Date("2024-07-03T09:00:00Z"),
      details: "Washed, sorted, and packed."
    }
  ]);

  await db.insert(require("@shared/schema").carbonRecords).values({
    batchId,
    emissions: 120.5,
    certificateHash: "0xabc123..."
  });

  console.log("Seeding complete!");
}
