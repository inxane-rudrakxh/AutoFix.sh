import { useQuery } from "@tanstack/react-query";
import { deploymentsApi } from "@/services/api";
import { mockDeployments, mockDeploymentDetail } from "@/lib/mock-data";
import type { Deployment, DeploymentDetail } from "@/types";

export function useDeployments() {
  return useQuery<Deployment[]>({
    queryKey: ["deployments"],
    queryFn: async () => {
      try {
        const res = await deploymentsApi.list();
        return res.data;
      } catch (error) {
        console.error("Failed to fetch deployments, falling back to mock data:", error);
        return mockDeployments;
      }
    },
    staleTime: 15_000,
  });
}

export function useDeployment(id: string) {
  return useQuery<DeploymentDetail>({
    queryKey: ["deployments", id],
    queryFn: async () => {
      try {
        return await deploymentsApi.get(id);
      } catch (error) {
        console.error(`Failed to fetch deployment ${id}, falling back to mock:`, error);
        return mockDeploymentDetail(id);
      }
    },
    staleTime: 10_000,
    refetchInterval: (query) => {
      const data = query.state.data;
      const isActive =
        data?.status === "running" ||
        data?.status === "monitoring" ||
        data?.status === "analyzing" ||
        data?.status === "generating_fix" ||
        data?.status === "validating";
      return isActive ? 3000 : false;
    },
    enabled: !!id,
  });
}
