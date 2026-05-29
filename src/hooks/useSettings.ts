import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "@/services/api";

export function useSettings() {
  return useQuery({
    queryKey: ["settings", "status"],
    queryFn: async () => {
      return await settingsApi.status();
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => settingsApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "status"] });
    },
  });
}
