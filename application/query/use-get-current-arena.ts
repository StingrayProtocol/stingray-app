import { useQuery } from "@tanstack/react-query";

const useGetCurrentArena = () => {
  return useQuery({
    queryKey: ["current-arena"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/arena/current`
      );
      const data = await response.json();

      return data;
    },
  });
};

export default useGetCurrentArena;
