import { TraderCard } from "@/type";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type UseGetTraderCardProps = Omit<
  UseQueryOptions<void, Error, TraderCard> & {
    objectId?: string;
  },
  "queryKey"
>;

const useGetTraderCardId = (options?: UseGetTraderCardProps) => {
  const objectId = options?.objectId;
  return useQuery({
    queryKey: ["trader-card", objectId],
    queryFn: async () => {
      if (!objectId) {
        throw new Error("objectId not found");
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/trader-card/by-id?objectId=${objectId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      return response.json();
    },
    ...options,
    enabled: !!objectId,
  });
};

export default useGetTraderCardId;
