import { useQuery } from "@tanstack/react-query";

export const useGetArenaInfo = () => {
  return useQuery({
    queryKey: ["arena", "info"],
    queryFn: async () => {
      const now = Date.now();
      const arenas = await 
      return arenas;
    },
  });
};
