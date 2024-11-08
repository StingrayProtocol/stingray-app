import { Arena } from "@/type";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type UseGetCurrentArenaProps = UseQueryOptions<{
  arena: {
    week: Arena;
    month: Arena;
  };
}>;

const useGetCurrentArena = (options?: UseGetCurrentArenaProps) => {
  return useQuery({
    queryKey: ["current-arena"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/arena/current`
      );
      const data = await response.json();

      return data;
    },
    ...options,
  });
};

export default useGetCurrentArena;
