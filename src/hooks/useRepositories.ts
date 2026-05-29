import { useQuery } from "@tanstack/react-query";
import { repositoriesApi } from "@/services/api";
import { mockRepositories } from "@/lib/mock-data";
import type { Repository } from "@/types";

export function useRepositories() {
  return useQuery<Repository[]>({
    queryKey: ["repositories"],
    queryFn: async () => {
      try {
        return await repositoriesApi.list();
      } catch {
        return mockRepositories;
      }
    },
    staleTime: 30_000,
  });
}
