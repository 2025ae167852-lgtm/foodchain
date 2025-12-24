import { pgTable, text, serial, integer, boolean, timestamp, jsonb, doublePrecision } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Import Auth and Chat models to re-export and use in relations
import { users } from "./models/auth";
import { conversations } from "./models/chat";

export * from "./models/auth";
export * from "./models/chat";

// === TABLE DEFINITIONS ===

export const farms = pgTable("farms", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // Links to auth users
  name: text("name").notNull(),
  location: jsonb("location").$type<{lat: number, lng: number}>().notNull(),
  size: doublePrecision("size").notNull(), // In hectares
  type: text("type").notNull(), // e.g., 'Organic', 'Conventional'
  createdAt: timestamp("created_at").defaultNow(),
});

export const crops = pgTable("crops", {
  id: serial("id").primaryKey(),
  farmId: integer("farm_id").notNull(),
  name: text("name").notNull(), // e.g., 'Corn', 'Wheat'
  variety: text("variety"),
  plantingDate: timestamp("planting_date"),
  expectedHarvestDate: timestamp("expected_harvest_date"),
  status: text("status").default("growing"), // growing, harvested
});

export const advisories = pgTable("advisories", {
  id: serial("id").primaryKey(),
  farmId: integer("farm_id").notNull(),
  type: text("type").notNull(), // weather, pest, irrigation
  message: text("message").notNull(),
  data: jsonb("data"), // detailed weather data etc
  createdAt: timestamp("created_at").defaultNow(),
  isRead: boolean("is_read").default(false),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  farmId: integer("farm_id").notNull(),
  type: text("type").notNull(), // planting, spraying, irrigation, harvesting
  date: timestamp("date").notNull(),
  details: text("details"),
  loggedAt: timestamp("logged_at").defaultNow(),
});

export const batches = pgTable("batches", {
  id: serial("id").primaryKey(),
  farmId: integer("farm_id").notNull(),
  cropId: integer("crop_id").notNull(),
  batchIdentifier: text("batch_identifier").notNull().unique(), // Unique ID for QR
  quantity: doublePrecision("quantity").notNull(),
  harvestDate: timestamp("harvest_date").notNull(),
  status: text("status").default("harvested"), // harvested, processing, retail, sold
});

export const traceabilityEvents = pgTable("traceability_events", {
  id: serial("id").primaryKey(),
  batchId: integer("batch_id").notNull(),
  stage: text("stage").notNull(), // Harvest, Transport, Processing, Storage, Retail
  location: text("location").notNull(),
  handler: text("handler").notNull(), // Name of person/company
  timestamp: timestamp("timestamp").defaultNow(),
  documentHash: text("document_hash"), // IPFS CID simulation
  blockchainTxHash: text("blockchain_tx_hash"), // Blockchain simulation
});

export const carbonRecords = pgTable("carbon_records", {
  id: serial("id").primaryKey(),
  batchId: integer("batch_id").notNull(),
  emissions: doublePrecision("emissions").notNull(), // kg CO2e
  certificateHash: text("certificate_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===

export const farmsRelations = relations(farms, ({ many }) => ({
  crops: many(crops),
  advisories: many(advisories),
  activities: many(activities),
  batches: many(batches),
}));

export const cropsRelations = relations(crops, ({ one }) => ({
  farm: one(farms, {
    fields: [crops.farmId],
    references: [farms.id],
  }),
}));

export const batchesRelations = relations(batches, ({ one, many }) => ({
  farm: one(farms, {
    fields: [batches.farmId],
    references: [farms.id],
  }),
  crop: one(crops, {
    fields: [batches.cropId],
    references: [crops.id],
  }),
  events: many(traceabilityEvents),
  carbon: one(carbonRecords, {
    fields: [batches.id],
    references: [carbonRecords.batchId],
  }),
}));

export const traceabilityEventsRelations = relations(traceabilityEvents, ({ one }) => ({
  batch: one(batches, {
    fields: [traceabilityEvents.batchId],
    references: [batches.id],
  }),
}));

// === BASE SCHEMAS ===

export const insertFarmSchema = createInsertSchema(farms).omit({ id: true, createdAt: true });
export const insertCropSchema = createInsertSchema(crops).omit({ id: true });
export const insertAdvisorySchema = createInsertSchema(advisories).omit({ id: true, createdAt: true, isRead: true });
export const insertActivitySchema = createInsertSchema(activities).omit({ id: true, loggedAt: true });
export const insertBatchSchema = createInsertSchema(batches).omit({ id: true });
export const insertTraceabilityEventSchema = createInsertSchema(traceabilityEvents).omit({ id: true, timestamp: true });
export const insertCarbonRecordSchema = createInsertSchema(carbonRecords).omit({ id: true, createdAt: true });

// === EXPLICIT API CONTRACT TYPES ===

export type Farm = typeof farms.$inferSelect;
export type InsertFarm = z.infer<typeof insertFarmSchema>;
export type Crop = typeof crops.$inferSelect;
export type InsertCrop = z.infer<typeof insertCropSchema>;
export type Advisory = typeof advisories.$inferSelect;
export type Activity = typeof activities.$inferSelect;
export type Batch = typeof batches.$inferSelect;
export type TraceabilityEvent = typeof traceabilityEvents.$inferSelect;
export type CarbonRecord = typeof carbonRecords.$inferSelect;

export type CreateFarmRequest = InsertFarm;
export type CreateCropRequest = InsertCrop;
export type CreateActivityRequest = InsertActivitySchema;
export type InsertActivitySchema = z.infer<typeof insertActivitySchema>;

export type FarmWithDetails = Farm & {
  crops: Crop[];
  activities: Activity[];
};

export type GenerateAdvisoryRequest = {
  farmId: number;
};
