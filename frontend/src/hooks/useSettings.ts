import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "@/services/api";

export function useSettings() {
  return useQuery({
    queryKey: ["settings", "status"],
    queryFn: async () => {
      try {
        return await settingsApi.status();
      } catch (error) {
        console.error("Failed to fetch settings status, falling back to defaults:", error);
        return {
          github_app_name: "autofix-sh",
          github_org: "acme-corp",
          github_installation_id: 1247248,
          sandbox_image: "node:20-alpine",
          sandbox_timeout: 180,
          has_openai_key: true,
          has_webhook_secret: true,
        };
      }
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
