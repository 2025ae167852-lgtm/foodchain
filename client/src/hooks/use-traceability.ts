import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useTraceability(batchIdentifier: string) {
  return useQuery({
    queryKey: [api.traceability.get.path, batchIdentifier],
    queryFn: async () => {
      const url = buildUrl(api.traceability.get.path, { batchIdentifier });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch traceability data");
      return api.traceability.get.responses[200].parse(await res.json());
    },
    enabled: !!batchIdentifier,
    retry: false,
  });
}
