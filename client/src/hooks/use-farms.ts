import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertFarm, type InsertCrop, type InsertActivitySchema, type GenerateAdvisoryRequest } from "@shared/routes";

// === FARMS ===

export function useFarms() {
  return useQuery({
    queryKey: [api.farms.list.path],
    queryFn: async () => {
      const res = await fetch(api.farms.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch farms");
      return api.farms.list.responses[200].parse(await res.json());
    },
  });
}

export function useFarm(id: number) {
  return useQuery({
    queryKey: [api.farms.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.farms.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch farm details");
      return api.farms.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateFarm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertFarm) => {
      const res = await fetch(api.farms.create.path, {
        method: api.farms.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create farm");
      return api.farms.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.farms.list.path] });
    },
  });
}

// === CROPS ===

export function useCreateCrop(farmId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<InsertCrop, "farmId">) => {
      const url = buildUrl(api.crops.create.path, { farmId });
      const res = await fetch(url, {
        method: api.crops.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to add crop");
      return api.crops.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.farms.get.path, farmId] });
    },
  });
}

// === ACTIVITIES ===

export function useCreateActivity(farmId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<InsertActivitySchema, "farmId">) => {
      const url = buildUrl(api.activities.create.path, { farmId });
      const res = await fetch(url, {
        method: api.activities.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to log activity");
      return api.activities.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.farms.get.path, farmId] });
    },
  });
}
