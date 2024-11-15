import { PositionValue } from "@/type";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type UseGetPositionValueProps = Omit<
  UseQueryOptions<PositionValue>,
  "queryKey"
> & {
  fundId?: string;
};

const useGetPositionValue = (options?: UseGetPositionValueProps) => {
  const fundId = options?.fundId;
  return useQuery({
    queryKey: ["position-value", fundId],
    queryFn: async () => {
      const response = await fetch(
        `/api/fund-balance/position-value?fundId=${fundId}`
      );
      return response.json();
    },
    ...options,
    enabled: !!fundId,
    refetchInterval: 15000,
  });
};

export default useGetPositionValue;
