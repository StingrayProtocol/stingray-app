import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type UseGetOwnedSuiNSProps = Omit<
  UseQueryOptions<
    {
      lists: {
        id: string;
        name: string;
        image_url: string;
      }[];
      nextCursor: string | null | undefined;
      hasNextPage: boolean;
    },
    Error,
    {
      lists: {
        id: string;
        name: string;
        image_url: string;
      }[];
      nextCursor: string | null | undefined;
      hasNextPage: boolean;
    }
  > & {
    cursor: string | null | undefined;
  },
  "queryKey"
>;

const useGetOwnedSuiNS = (options?: UseGetOwnedSuiNSProps) => {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  return useQuery({
    queryKey: ["owned-sui-ns", account?.address],
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
        limit: 20,
      });
      return {
        lists: result.data.map((item) => ({
          id: item.data?.objectId || "",
          name: item.data?.display?.data?.name || "",
          image_url: item.data?.display?.data?.image_url || "",
        })),
        nextCursor: result.nextCursor,
        hasNextPage: result.hasNextPage,
      };
    },
    enabled: !!account,
    ...options,
  });
};

export default useGetOwnedSuiNS;
