import { useQuery } from "@tanstack/react-query";
import { fixesApi } from "@/services/api";
import type { FixDetail } from "@/types";

export function useFixes() {
  return useQuery<FixDetail[]>({
    queryKey: ["fixes"],
    queryFn: async () => {
      return await fixesApi.list();
    },
    staleTime: 15_000,
  });
}

export function useFix(id: string) {
  return useQuery<FixDetail>({
    queryKey: ["fixes", id],
    queryFn: async () => {
      return await fixesApi.get(id);
    },
    enabled: !!id,
  });
}
