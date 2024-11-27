import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import useRefetchWholeFund from "./use-refetch-whole-fund";
import useGetFundBalance from "../query/use-get-fund-balance";
import { message } from "antd";
import { syncDb } from "@/common/sync-db";
import { settleBackToSui } from "../ptb-operation/settle-back-sui";

type UseTradeBackToSuiProps = UseMutationOptions<
  void,
  Error,
  {
    fundId?: string;
    traderId?: string;
  }
> & {
  fundId?: string;
};

const useTradeBackToSui = (options?: UseTradeBackToSuiProps) => {
  const { refetch } = useRefetchWholeFund();
  const { refetch: refetchBalance, data: fundBalance } = useGetFundBalance({
    fundId: options?.fundId,
  });
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction({
      onError: (error) => {
        console.error(error);
      },
    });
  return useMutation({
    mutationFn: async ({
      fundId,
      traderId,
    }: {
      fundId?: string;
      traderId?: string;
    }) => {
      if (!fundBalance) {
        throw new Error("Fund balance not found");
      }
      if (!fundId) {
        throw new Error("Fund id not found");
      }
      if (!traderId) {
        throw new Error("Trader id not found");
      }
      const tx = new Transaction();

      settleBackToSui({
        tx,
        fundBalance,
        fundId,
        traderId,
      });

      const result = await signAndExecuteTransaction({
        transaction: tx,
      });
      console.log(result);
      await syncDb.withdraw("Scallop");
      await syncDb.withdraw("Suilend");
      await syncDb.withdraw("Bucket");
      await syncDb.swap();
    },
    onError: (error) => {
      console.error(error);
    },
    ...options,
    onSuccess: async (_data, _variables, _context) => {
      options?.onSuccess?.(_data, _variables, _context);
      message.success("All trade back to SUI successfully");
      refetchBalance();
      refetch();
    },
  });
};

export default useTradeBackToSui;
