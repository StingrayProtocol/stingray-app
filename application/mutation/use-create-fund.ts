import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation } from "@tanstack/react-query";

const useCreateFund = () => {
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction({
      onError: (error) => {
        console.error(error);
      },
    });
  return useMutation({
    mutationFn: async ({
      trader,
      description = "",
      traderFee = 20,
    }: {
      trader: string;
      description: string;
      traderFee: number;
    }) => {
      if (!account) {
        throw new Error("Account not found");
      }
      if (
        !process.env.NEXT_PUBLIC_GLOBAL_CONFIG ||
        !process.env.NEXT_PUBLIC_PACKAGE
      ) {
        throw new Error("Global config or package not found");
      }
      const tx = new Transaction();

      tx.moveCall({
        package: process.env.NEXT_PUBLIC_PACKAGE,
        module: "fund",
        function: "create",
        arguments: [
          tx.object(process.env.NEXT_PUBLIC_GLOBAL_CONFIG), //global config
          tx.pure.string(description),
          tx.object(trader), // trader
          tx.pure.u64(traderFee), // trader fee
          tx.pure.bool(false), // is arena
          tx.pure.u64(Date.now() + 10000), //start time
          tx.pure.u64(86400000), //invest duration
          tx.pure.u64(Date.now() + 1000000), // end time
          tx.splitCoins(tx.gas, [100000000]), // coin // temporary sui only
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
  });
};

export default useCreateFund;
