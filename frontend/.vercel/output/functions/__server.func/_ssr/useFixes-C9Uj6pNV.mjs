import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { f as fixesApi } from "./router-OYXG_VES.mjs";
function useFixes() {
  return useQuery({
    queryKey: ["fixes"],
    queryFn: async () => {
      return await fixesApi.list();
    },
    staleTime: 15e3
  });
}
export {
  useFixes as u
};
