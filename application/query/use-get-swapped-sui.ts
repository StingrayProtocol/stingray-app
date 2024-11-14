import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type UseGetSwappedSuiProps = Omit<
  UseQueryOptions<{
    sui: number;
  }> & {
    fundId?: string;
  },
  "queryKey"
>;

const useGetSwappedSui = ({ fundId, ...options }: UseGetSwappedSuiProps) => {
  return useQuery({
    queryKey: ["swapped-sui", fundId],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/fund-balance/swap?fundId=${fundId}`,
        {
          method: "GET",
        }
      );
      return response.json();
    },
    ...options,
    enabled: !!fundId,
  });
};

export default useGetSwappedSui;
