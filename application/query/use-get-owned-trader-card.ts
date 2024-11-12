import { TraderCard } from "@/type";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type UseGetOwnedTraderCardProps = UseQueryOptions<void, Error, TraderCard>;

const useGetOwnedTraderCard = (options?: UseGetOwnedTraderCardProps) => {
  const account = useCurrentAccount();

  return useQuery({
    queryKey: ["owned-trader-card", account?.address],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/trader-card/owned?owner=${account?.address}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      return response.json();
    },
    ...options,
    enabled: !!account,
  });
};

export default useGetOwnedTraderCard;
