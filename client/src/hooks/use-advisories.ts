import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useAdvisories(farmId: number) {
  return useQuery({
    queryKey: [api.advisories.list.path, farmId],
    queryFn: async () => {
      const url = buildUrl(api.advisories.list.path, { farmId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch advisories");
      return api.advisories.list.responses[200].parse(await res.json());
    },
    enabled: !!farmId,
  });
}

export function useGenerateAdvisory(farmId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const url = buildUrl(api.advisories.generate.path, { farmId });
      const res = await fetch(url, {
        method: api.advisories.generate.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to generate advisory");
      return api.advisories.generate.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.advisories.list.path, farmId] });
    },
  });
}
