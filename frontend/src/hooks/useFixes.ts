import { useQuery } from "@tanstack/react-query";
import { fixesApi } from "@/services/api";
import { mockFixDetails } from "@/lib/mock-data";
import type { FixDetail } from "@/types";

export function useFixes() {
  return useQuery<FixDetail[]>({
    queryKey: ["fixes"],
    queryFn: async () => {
      try {
        return await fixesApi.list();
      } catch (error) {
        console.error("Failed to fetch fixes, falling back to mock data:", error);
        return mockFixDetails;
      }
    },
    staleTime: 15_000,
  });
}

export function useFix(id: string) {
  return useQuery<FixDetail>({
    queryKey: ["fixes", id],
    queryFn: async () => {
      try {
        return await fixesApi.get(id);
      } catch (error) {
        console.error(`Failed to fetch fix ${id}, falling back to mock data:`, error);
        return mockFixDetails.find((f) => f.id === id) || mockFixDetails[0];
      }
    },
    enabled: !!id,
  });
}
