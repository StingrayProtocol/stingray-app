import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import useRefetchWholeFund from "./use-refetch-whole-fund";
import useGetFundBalance from "../query/use-get-fund-balance";
import { message } from "antd";
import { syncDb } from "@/common/sync-db";
import { scallopDeposit } from "../ptb-operation/scallop-deposit";

type UseScallopDespositProps = UseMutationOptions<
  void,
  Error,
  {
    name: string;
    fundId: string;
    traderId: string;
    amount: string;
  }
> & {
  fundId?: string;
};

const useScallopDeposit = (options?: UseScallopDespositProps) => {
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
    }: {
      name: string;
      fundId: string;
      traderId: string;
      amount: string;
    }) => {
      const tx = new Transaction();

      scallopDeposit({
        tx,
        name,
        fundId,
        traderId,
        amount,
      });

      const result = await signAndExecuteTransaction({
        transaction: tx,
      });
      console.log(result);
      await syncDb.deposit("Scallop");
    },
    onError: (error) => {
      console.error(error);
    },
    ...options,
    onSuccess: async (_data, _variables, _context) => {
      options?.onSuccess?.(_data, _variables, _context);
      message.success("Deposit success");
      refetchBalance();
      refetch();
    },
  });
};

export default useScallopDeposit;
