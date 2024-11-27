import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type UseGetFundTokenOutProps = Omit<
  UseQueryOptions<string[]> & {
    fundId?: string;
  },
  "queryKey"
>;

const useGetFundTokenOut = ({
  fundId,
  ...options
}: UseGetFundTokenOutProps) => {
  return useQuery({
    queryKey: ["fund-token-out", fundId],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/fund/all-token-out?fundId=${fundId}`,
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

export default useGetFundTokenOut;
