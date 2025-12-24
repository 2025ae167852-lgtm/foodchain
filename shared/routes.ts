import { z } from 'zod';
import { 
  insertFarmSchema, 
  insertCropSchema, 
  insertActivitySchema, 
  farms, 
  crops, 
  advisories, 
  activities,
  batches,
  traceabilityEvents,
  carbonRecords,
  insertBatchSchema
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  farms: {
    list: {
      method: 'GET' as const,
      path: '/api/farms',
      responses: {
        200: z.array(z.custom<typeof farms.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/farms',
      input: insertFarmSchema,
      responses: {
        201: z.custom<typeof farms.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/farms/:id',
      responses: {
        200: z.custom<typeof farms.$inferSelect & { crops: typeof crops.$inferSelect[], activities: typeof activities.$inferSelect[] }>(),
        404: errorSchemas.notFound,
      },
    },
  },
  crops: {
    create: {
      method: 'POST' as const,
      path: '/api/farms/:farmId/crops',
      input: insertCropSchema.omit({ farmId: true }),
      responses: {
        201: z.custom<typeof crops.$inferSelect>(),
      },
    },
  },
  activities: {
    create: {
      method: 'POST' as const,
      path: '/api/farms/:farmId/activities',
      input: insertActivitySchema.omit({ farmId: true }),
      responses: {
        201: z.custom<typeof activities.$inferSelect>(),
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/farms/:farmId/activities',
      responses: {
        200: z.array(z.custom<typeof activities.$inferSelect>()),
      },
    }
  },
  advisories: {
    list: {
      method: 'GET' as const,
      path: '/api/farms/:farmId/advisories',
      responses: {
        200: z.array(z.custom<typeof advisories.$inferSelect>()),
      },
    },
    generate: {
      method: 'POST' as const,
      path: '/api/farms/:farmId/advisories/generate',
      responses: {
        201: z.custom<typeof advisories.$inferSelect>(),
      },
    },
  },
  traceability: {
    get: {
      method: 'GET' as const,
      path: '/api/traceability/:batchIdentifier',
      responses: {
        200: z.custom<typeof batches.$inferSelect & { events: typeof traceabilityEvents.$inferSelect[], carbon: typeof carbonRecords.$inferSelect | null, farm: typeof farms.$inferSelect, crop: typeof crops.$inferSelect }>(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
