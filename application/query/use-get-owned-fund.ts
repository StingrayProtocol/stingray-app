import { useQuery } from "@tanstack/react-query";
import useGetOwnedTraderCard from "./use-get-owned-trader-card";

const useGetOwnedFund = () => {
  const { data: traderCard } = useGetOwnedTraderCard();

  return useQuery({
    queryKey: ["owned-fund", traderCard?.object_id],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/fund/owned?owner=${traderCard?.object_id}`,
        {
          method: "GET",
        }
      );
      return response.json();
    },
    enabled: !!traderCard,
  });
};

export default useGetOwnedFund;
