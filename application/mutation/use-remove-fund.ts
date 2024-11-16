import { syncDb } from "@/common/sync-db";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { message } from "antd";
import useRefetchWholeFund from "./use-refetch-whole-fund";
import { Fund } from "@/type";

type UseAddFundProps = UseMutationOptions<
  void,
  Error,
  {
    amount: number;
    fund?: Fund;
  }
>;

const useRemoveFund = (options?: UseAddFundProps) => {
  const account = useCurrentAccount();
  const { refetch } = useRefetchWholeFund();
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction({
      onError: (error) => {
        console.error(error);
      },
    });
  return useMutation({
    mutationFn: async ({
      amount = 0.01,
      fund,
    }: {
      amount: number;
      fund: Fund;
    }) => {
      if (!account) {
        throw new Error("Account not found");
      }
      const shares =
        fund.fund_history
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
      console.log(amount * 10 ** 9);
      tx.moveCall({
        package: process.env.NEXT_PUBLIC_PACKAGE,
        module: "fund",
        function: "deinvest",
        arguments: [
          tx.object(process.env.NEXT_PUBLIC_GLOBAL_CONFIG), //global config
          tx.object(fund.object_id), //fund id
          tx.makeMoveVec({
            elements: shares.map((share) => tx.object(share)),
          }), //shares
          tx.pure.u64(amount * 10 ** 9), //amount
          tx.object("0x6"),
        ],
        typeArguments: ["0x2::sui::SUI"],
      }); //fund

      const result = await signAndExecuteTransaction({
        transaction: tx,
      });
      console.log(result);
    },
    onError: (error) => {
      console.error(error);
    },
    ...options,
    onSuccess: async (_data, _variables, _context) => {
      options?.onSuccess?.(_data, _variables, _context);
      await syncDb.fundHistory();
      refetch();
      message.success("Fund removed successfully");
    },
  });
};

export default useRemoveFund;
