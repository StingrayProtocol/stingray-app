import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import useRefetchWholeFund from "./use-refetch-whole-fund";
import useGetFundBalance from "../query/use-get-fund-balance";
import { message } from "antd";
import { settle } from "../ptb-operation/settle";
import useGetFundTokenOut from "../query/use-get-fund-token-out";
import { syncDb } from "@/common/sync-db";

type UseSettleProps = UseMutationOptions<
  void,
  Error,
  {
    fundId?: string;
    initShareId?: string;
  }
> & {
  fundId?: string;
};

const useSettle = (options?: UseSettleProps) => {
  const account = useCurrentAccount();
  const { refetch } = useRefetchWholeFund();
  const { refetch: refetchBalance, data: fundBalance } = useGetFundBalance({
    fundId: options?.fundId,
  });
  const { data: tokenouts } = useGetFundTokenOut({
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
      initShareId,
    }: {
      fundId?: string;
      initShareId?: string;
    }) => {
      if (!fundBalance) {
        throw new Error("Fund balance not found");
      }
      if (!fundId) {
        throw new Error("Fund id not found");
      }
      if (!initShareId) {
        throw new Error("Initial Share id not found");
      }
      if (!tokenouts) {
        throw new Error("Tokenouts not found");
      }
      if (!account) {
        throw new Error("Account not found");
      }
      const tx = new Transaction();

      settle({
        tx,
        tokenouts,
        address: account?.address,
        fundId,
        initShareId,
      });

      const result = await signAndExecuteTransaction({
        transaction: tx,
      });
      await syncDb.settle();
      console.log(result);
    },
    onError: (error) => {
      console.error(error);
    },
    ...options,
    onSuccess: async (_data, _variables, _context) => {
      options?.onSuccess?.(_data, _variables, _context);
      message.success("Settle successfully");
      refetchBalance();
      refetch();
    },
  });
};

export default useSettle;
