import { useQuery } from "@tanstack/react-query";
import { logsApi } from "@/services/api";
import { mockLogStream } from "@/lib/mock-data";
import type { LogLine } from "@/types";

export function useLogs(runId?: string) {
  return useQuery<LogLine[]>({
    queryKey: ["logs", runId ?? "all"],
    queryFn: async () => {
      try {
        return await logsApi.list(runId);
      } catch {
        return mockLogStream;
      }
    },
    staleTime: 5_000,
    refetchInterval: 5_000, // poll every 5s when backend is live
  });
}
