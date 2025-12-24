import { db } from "./db";
import { 
  farms, crops, advisories, activities, batches, traceabilityEvents, carbonRecords,
  type InsertFarm, type InsertCrop, type InsertActivitySchema, type Batch, type TraceabilityEvent, type CarbonRecord
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";
// Import authStorage to include in IStorage if needed, or just export it alongside
import { authStorage, type IAuthStorage } from "./replit_integrations/auth/storage";
import { chatStorage, type IChatStorage } from "./replit_integrations/chat/storage";

export interface IStorage extends IAuthStorage, IChatStorage {
  // Farms
  createFarm(farm: InsertFarm): Promise<typeof farms.$inferSelect>;
  getFarmsByUserId(userId: string): Promise<(typeof farms.$inferSelect)[]>;
  getFarm(id: number): Promise<typeof farms.$inferSelect | undefined>;
  
  // Crops
  createCrop(crop: InsertCrop): Promise<typeof crops.$inferSelect>;
  getCropsByFarmId(farmId: number): Promise<(typeof crops.$inferSelect)[]>;
  
  // Activities
  createActivity(activity: InsertActivitySchema): Promise<typeof activities.$inferSelect>;
  getActivitiesByFarmId(farmId: number): Promise<(typeof activities.$inferSelect)[]>;
  
  // Advisories
  createAdvisory(advisory: typeof advisories.$inferInsert): Promise<typeof advisories.$inferSelect>;
  getAdvisoriesByFarmId(farmId: number): Promise<(typeof advisories.$inferSelect)[]>;
  
  // Traceability
  getBatchByIdentifier(identifier: string): Promise<typeof batches.$inferSelect | undefined>;
  getBatchEvents(batchId: number): Promise<(typeof traceabilityEvents.$inferSelect)[]>;
  getBatchCarbon(batchId: number): Promise<typeof carbonRecords.$inferSelect | undefined>;
  getTraceabilityData(batchIdentifier: string): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // Inherit/delegate auth/chat storage methods or implement them?
  // We'll compose them or implement them directly.
  // Since IAuthStorage is implemented in auth/storage.ts, we can just use that instance for auth routes.
  // But for the main application storage, we might want a unified class.
  // Let's implement the specific methods here.
  
  // Auth Delegation
  getUser = authStorage.getUser;
  upsertUser = authStorage.upsertUser;
  
  // Chat Delegation
  getConversation = chatStorage.getConversation;
  getAllConversations = chatStorage.getAllConversations;
  createConversation = chatStorage.createConversation;
  deleteConversation = chatStorage.deleteConversation;
  getMessagesByConversation = chatStorage.getMessagesByConversation;
  createMessage = chatStorage.createMessage;

  // Farms
  async createFarm(farm: InsertFarm) {
    const [newFarm] = await db.insert(farms).values(farm).returning();
    return newFarm;
  }
  
  async getFarmsByUserId(userId: string) {
    return db.select().from(farms).where(eq(farms.userId, userId));
  }
  
  async getFarm(id: number) {
    const [farm] = await db.select().from(farms).where(eq(farms.id, id));
    return farm;
  }
  
  // Crops
  async createCrop(crop: InsertCrop) {
    const [newCrop] = await db.insert(crops).values(crop).returning();
    return newCrop;
  }
  
  async getCropsByFarmId(farmId: number) {
    return db.select().from(crops).where(eq(crops.farmId, farmId));
  }
  
  // Activities
  async createActivity(activity: InsertActivitySchema) {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }
  
  async getActivitiesByFarmId(farmId: number) {
    return db.select().from(activities).where(eq(activities.farmId, farmId)).orderBy(desc(activities.date));
  }
  
  // Advisories
  async createAdvisory(advisory: typeof advisories.$inferInsert) {
    const [newAdvisory] = await db.insert(advisories).values(advisory).returning();
    return newAdvisory;
  }
  
  async getAdvisoriesByFarmId(farmId: number) {
    return db.select().from(advisories).where(eq(advisories.farmId, farmId)).orderBy(desc(advisories.createdAt));
  }
  
  // Traceability
  async getBatchByIdentifier(identifier: string) {
    const [batch] = await db.select().from(batches).where(eq(batches.batchIdentifier, identifier));
    return batch;
  }
  
  async getBatchEvents(batchId: number) {
    return db.select().from(traceabilityEvents).where(eq(traceabilityEvents.batchId, batchId)).orderBy(traceabilityEvents.timestamp);
  }
  
  async getBatchCarbon(batchId: number) {
    const [record] = await db.select().from(carbonRecords).where(eq(carbonRecords.batchId, batchId));
    return record;
  }
  
  async getTraceabilityData(batchIdentifier: string) {
    const batch = await this.getBatchByIdentifier(batchIdentifier);
    if (!batch) return null;
    
    const events = await this.getBatchEvents(batch.id);
    const carbon = await this.getBatchCarbon(batch.id);
    const farm = await this.getFarm(batch.farmId);
    const [crop] = await db.select().from(crops).where(eq(crops.id, batch.cropId));
    
    return {
      ...batch,
      farm,
      crop,
      events,
      carbon
    };
  }
}

export const storage = new DatabaseStorage();
