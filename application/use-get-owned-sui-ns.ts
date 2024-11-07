import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type UseGetOwnedSuiNS = Omit<
  UseQueryOptions<
    {
      lists: {
        name: string;
        image_url: string;
      }[];
      nextCursor: string | null | undefined;
      hasNextPage: boolean;
    },
    Error,
    void
  > & {
    cursor: string | null | undefined;
  },
  "queryKey"
>;

const useGetOwnedSuiNS = ({ cursor, ...options }: UseGetOwnedSuiNS) => {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  return useQuery({
    queryKey: ["owned-sui-ns", account?.address, cursor],
    queryFn: async () => {
      if (!account) {
        throw new Error("Account not found");
      }
      if (!process.env.NEXT_PUBLIC_SUI_NS_TYPE) {
        throw new Error("SUI_NS_TYPE not found");
      }
      const result = await suiClient.getOwnedObjects({
        filter: {
          StructType: process.env.NEXT_PUBLIC_SUI_NS_TYPE,
        },
        owner: account.address,
        options: {
          showDisplay: true,
        },
      });
      return {
        lists: result.data.map((item) => ({
          name: item.data?.display?.data?.name || "",
          image_url: item.data?.display?.data?.image_url || "",
        })),
        nextCursor: result.nextCursor,
        hasNextPage: result.hasNextPage,
      };
    },
    ...options,
  });
};

export default useGetOwnedSuiNS;
