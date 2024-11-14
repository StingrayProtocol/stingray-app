import { TraderCard } from "@/type";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type UseGetTraderCardProps = Omit<
  UseQueryOptions<void, Error, TraderCard> & {
    address?: string;
  },
  "queryKey"
>;

const useGetTraderCard = (options?: UseGetTraderCardProps) => {
  const address = options?.address;
  return useQuery({
    queryKey: ["trader-card", address],
    queryFn: async () => {
      if (!address) {
        throw new Error("Address not found");
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/trader-card/owned?owner=${address}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      return response.json();
    },
    ...options,
    enabled: !!address,
  });
};

export default useGetTraderCard;
