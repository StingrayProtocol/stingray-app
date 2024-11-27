import { FundBalance } from "@/type";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type UseGetFundBalanceProps = Omit<
  UseQueryOptions<FundBalance> & {
    fundId?: string;
  },
  "queryKey"
>;

const useGetFundBalance = ({ fundId, ...options }: UseGetFundBalanceProps) => {
  return useQuery({
    queryKey: ["fund-balance", fundId],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/fund-balance?fundId=${fundId}`,
        {
          method: "GET",
        }
      );
      return response.json();
    },
    ...options,
    enabled: !!fundId,
    refetchInterval: 3000,
  });
};

export default useGetFundBalance;
