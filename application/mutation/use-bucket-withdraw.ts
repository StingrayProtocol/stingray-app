import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import useRefetchWholeFund from "./use-refetch-whole-fund";
import useGetFundBalance from "../query/use-get-fund-balance";
import { message } from "antd";
import { syncDb } from "@/common/sync-db";
import { bucketWithdraw } from "../ptb-operation/bucket-withdraw";

type UseBucketWithdrawProps = UseMutationOptions<
  void,
  Error,
  {
    name: string;
    fundId: string;
    traderId: string;
    reStakeAmount: number;
  }
> & {
  fundId?: string;
};

const useBucketWithdraw = (options?: UseBucketWithdrawProps) => {
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
      name,
      fundId,
      traderId,
      reStakeAmount,
    }: {
      name: string;
      fundId: string;
      traderId: string;
      reStakeAmount: number;
    }) => {
      const tx = new Transaction();

      bucketWithdraw({
        tx,
        name,
        fundId,
        traderId,
        reStakeAmount,
      });

      const result = await signAndExecuteTransaction({
        transaction: tx,
      });
      console.log(result);
      await syncDb.withdraw("Bucket");
      await syncDb.deposit("Bucket");
    },
    onError: (error) => {
      console.error(error);
    },
    ...options,
    onSuccess: async (_data, _variables, _context) => {
      options?.onSuccess?.(_data, _variables, _context);
      message.success("Withdraw success");
      refetch();
      refetchBalance();
    },
  });
};

export default useBucketWithdraw;
