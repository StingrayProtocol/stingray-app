import { Fund } from "@/type";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type UseGetInvestFundProps = UseQueryOptions<{
  fundings: Fund[];
  runnings: Fund[];
  claimables: Fund[];
}>;

const useGetInvestFund = (options?: UseGetInvestFundProps) => {
  const account = useCurrentAccount();
  return useQuery({
    queryKey: ["invest-fund"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/fund/invest?investor=${account?.address}`,
        {
          method: "GET",
        }
      );
      return response.json();
    },
    ...options,
    enabled: !!account,
  });
};

export default useGetInvestFund;
