import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import useRefetchWholeFund from "./use-refetch-whole-fund";
import useGetFundBalance from "../query/use-get-fund-balance";
import { message } from "antd";
import { syncDb } from "@/common/sync-db";
import { scallopWithdraw } from "../ptb-operation/scallop-withdraw";

type UseScallopWithdrawProps = UseMutationOptions<
  void,
  Error,
  {
    liquidityAmount: number;
    name: string;
    fundId: string;
    traderId: string;
    reStakeAmount: number;
  }
> & {
  fundId?: string;
};

const useScallopWithdraw = (options?: UseScallopWithdrawProps) => {
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
      liquidityAmount,
      name,
      fundId,
      traderId,
      reStakeAmount,
    }: {
      liquidityAmount: number;
      name: string;
      fundId: string;
      traderId: string;
      reStakeAmount: number;
    }) => {
      const tx = new Transaction();

      scallopWithdraw({
        tx,
        liquidityAmount,
        name,
        fundId,
        traderId,
        reStakeAmount,
      });

      const result = await signAndExecuteTransaction({
        transaction: tx,
      });
      console.log(result);
      await syncDb.withdraw("Scallop");
      await syncDb.deposit("Scallop");
    },
    onError: (error) => {
      console.error(error);
    },
    ...options,
    onSuccess: async (_data, _variables, _context) => {
      options?.onSuccess?.(_data, _variables, _context);
      message.success("Withdraw success");
      refetchBalance();
      refetch();
    },
  });
};

export default useScallopWithdraw;
