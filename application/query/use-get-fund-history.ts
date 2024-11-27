import { FundHistory } from "@/type";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type UseGetFundHistoryProps = Omit<
  UseQueryOptions<FundHistory[]> & {
    fundId?: string;
  },
  "queryKey"
>;

const useGetFundHistory = (options?: UseGetFundHistoryProps) => {
  const fundId = options?.fundId;
  return useQuery({
    queryKey: ["fund-history", fundId],
    queryFn: async () => {
      const response = await fetch(`/api/fund/history?fundId=${fundId}`);
      return response.json();
    },
    refetchInterval: 3000,
    ...options,
  });
};

export default useGetFundHistory;
