import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import useGetOwnedTraderCard from "./use-get-owned-trader-card";
import { Fund } from "@/type";

type UseGetOwnedFundProps = UseQueryOptions<Fund[]>;

const useGetOwnedFund = (options?: UseGetOwnedFundProps) => {
  const { data: traderCard } = useGetOwnedTraderCard();

  return useQuery({
    queryKey: ["owned-fund", traderCard?.object_id],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/fund/owned/runnings?owner=${traderCard?.object_id}`,
        {
          method: "GET",
        }
      );
      return response.json();
    },
    enabled: !!traderCard,
    ...options,
  });
};

export default useGetOwnedFund;
