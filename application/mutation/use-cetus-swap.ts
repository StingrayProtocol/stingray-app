import { syncDb } from "@/common/sync-db";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { message } from "antd";
import useRefetchWholeFund from "./use-refetch-whole-fund";
import useGetFundBalance from "../query/use-get-fund-balance";
import { swap } from "../ptb-operation/swap";

type UseCetusSwapProps = UseMutationOptions<
  void,
  Error,
  {
    fundId: string;
    traderId: string;
    inToken: string;
    inAmount: string;
    outToken: string;
  }
> & { fundId?: string };

const useCetusSwap = (options?: UseCetusSwapProps) => {
  const { refetch } = useRefetchWholeFund();
  const { refetch: refetchBalance } = useGetFundBalance({
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
      inToken,
      inAmount,
      outToken,
    }: // outAmount,
    {
      traderId: string;
      fundId: string;
      inToken: string;
      inAmount: string;
      outToken: string;
      // outAmount: string;
    }) => {
      const tx = new Transaction();

      const { tx: transaction } = swap({
        tx,
        fundId,
        traderId,
        inToken,
        inAmount,
        outToken,
      });

      const result = await signAndExecuteTransaction({
        transaction,
      });
      console.log(result);
      await syncDb.swap();

      return;
    },
    onError: (error) => {
      console.error(error);
    },
    ...options,
    onSuccess: async (_data, _variables, _context) => {
      options?.onSuccess?.(_data, _variables, _context);
      message.success("Swap success");
      refetch();
      refetchBalance();
    },
  });
};

export default useCetusSwap;
