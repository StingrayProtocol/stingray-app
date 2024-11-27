import { syncDb } from "@/common/sync-db";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import useRefetchWholeFund from "./use-refetch-whole-fund";
import useGetFundBalance from "../query/use-get-fund-balance";
import { message } from "antd";
import { bucketDeposit } from "../ptb-operation/bucket-deposit";

type UseBucketDespositProps = UseMutationOptions<
  void,
  Error,
  {
    name: string;
    fundId: string;
    traderId: string;
    amount: string;
    hasDeposit?: boolean;
  }
> & {
  fundId?: string;
};

const useBucketDeposit = (options?: UseBucketDespositProps) => {
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
      amount,
      hasDeposit,
      originalAmount,
    }: {
      name: string;
      fundId: string;
      traderId: string;
      amount: string;
      hasDeposit?: boolean;
      originalAmount?: number;
    }) => {
      const tx = new Transaction();

      bucketDeposit({
        tx,
        name,
        fundId,
        traderId,
        amount,
        hasDeposit,
        originalAmount,
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
      message.success("Deposit success");
      refetch();
      refetchBalance();
    },
  });
};

export default useBucketDeposit;
