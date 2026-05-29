import { useQuery } from "@tanstack/react-query";
import { deploymentsApi } from "@/services/api";
import type { Deployment, DeploymentDetail } from "@/types";

export function useDeployments() {
  return useQuery<Deployment[]>({
    queryKey: ["deployments"],
    queryFn: async () => {
      const res = await deploymentsApi.list();
      return res.data;
    },
    staleTime: 15_000,
  });
}

export function useDeployment(id: string) {
  return useQuery<DeploymentDetail>({
    queryKey: ["deployments", id],
    queryFn: async () => {
      return await deploymentsApi.get(id);
    },
    staleTime: 10_000,
    enabled: !!id,
  });
}
