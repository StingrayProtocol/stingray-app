import { Fund } from "@/type";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type UseGetAllArenaProps = UseQueryOptions<Fund[]>;

const useGetAllArena = (options?: UseGetAllArenaProps) => {
  return useQuery({
    queryKey: ["all-arena"],
    queryFn: async () => {
      const response = await fetch("/api/arena/fund/all");
      return response.json();
    },
    ...options,
  });
};

export default useGetAllArena;
