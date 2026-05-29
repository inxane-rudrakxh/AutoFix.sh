import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as deploymentsApi } from "./router-OYXG_VES.mjs";
function useDeployments() {
  return useQuery({
    queryKey: ["deployments"],
    queryFn: async () => {
      const res = await deploymentsApi.list();
      return res.data;
    },
    staleTime: 15e3
  });
}
function useDeployment(id) {
  return useQuery({
    queryKey: ["deployments", id],
    queryFn: async () => {
      return await deploymentsApi.get(id);
    },
    staleTime: 1e4,
    enabled: !!id
  });
}
export {
  useDeployments as a,
  useDeployment as u
};
