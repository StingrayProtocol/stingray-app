import { Fund } from "@/type";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type UseGetPoolsProps = UseQueryOptions<{
  arenas: Fund[];
  fundings: Fund[];
  runnings: Fund[];
}>;

const useGetPools = (options?: UseGetPoolsProps) => {
  return useQuery({
    queryKey: ["pools"],
    queryFn: async () => {
      const [arenas, fundings, runnings] = await Promise.all([
        fetch("/api/arena/fund/all").then((res) => res.json()),
        fetch("/api/fund/fundings").then((res) => res.json()),
        fetch("/api/fund/runnings").then((res) => res.json()),
      ]);
      return { arenas, fundings, runnings };
    },
    ...options,
  });
};

export default useGetPools;
