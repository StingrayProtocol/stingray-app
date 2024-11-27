import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { message } from "antd";
import { Fund } from "@/type";
import { claim } from "../ptb-operation/claim";
import useGetTraderCard from "../query/use-get-trader-card";
import { syncDb } from "@/common/sync-db";
import useRefetchWholeFund from "./use-refetch-whole-fund";

type UseAddFundProps = UseMutationOptions<
  void,
  Error,
  {
    fund?: Fund;
  }
>;

const useClaim = (options?: UseAddFundProps) => {
  const account = useCurrentAccount();
  const { refetch } = useRefetchWholeFund();
  const { data: traderCard } = useGetTraderCard({
    address: account?.address,
  });
  // const { refetch } = useRefetchWholeFund();
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction({
      onError: (error) => {
        console.error(error);
      },
    });
  return useMutation({
    mutationFn: async ({ fund }: { fund: Fund }) => {
      if (!account) {
        throw new Error("Account not found");
      }

      if (!traderCard) {
        throw new Error("Trader card not found");
      }

      const history = [...(fund.fund_history ?? [])].sort((a, b) => {
        return Number(a.timestamp) - Number(b.timestamp);
      });
      console.log(fund);
      console.log(traderCard.object_id);
      const shares =
        history
          ?.filter((history) => !history?.redeemed)
          ?.filter((history) => history.investor === account?.address)
          ?.map((history) => history.share_id) || [];

      console.log(shares);
      if (!shares.length) {
        throw new Error("Share not found");
      }

      if (
        !process.env.NEXT_PUBLIC_GLOBAL_CONFIG ||
        !process.env.NEXT_PUBLIC_PACKAGE
      ) {
        throw new Error("Global config or package not found");
      }

      const tx = new Transaction();
      claim({
        tx,
        fundId: fund.object_id,
        shares,
        address: account.address,
      });

      const result = await signAndExecuteTransaction({
        transaction: tx,
      });
      await syncDb.claim();
      console.log(result);
    },
    onError: (error) => {
      console.error(error);
    },
    ...options,
    onSuccess: async (_data, _variables, _context) => {
      options?.onSuccess?.(_data, _variables, _context);
      message.success("Claim successfully");
      refetch();
    },
  });
};

export default useClaim;
