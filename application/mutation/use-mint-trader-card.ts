import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation } from "@tanstack/react-query";

const useMintTraderCard = () => {
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction({
      onError: (error) => {
        console.error(error);
      },
    });
  return useMutation({
    mutationFn: async ({ suiNS }: { suiNS: string }) => {
      if (!account) {
        throw new Error("Account not found");
      }
      if (
        !process.env.NEXT_PUBLIC_GLOBAL_CONFIG ||
        !process.env.NEXT_PUBLIC_HOST_CONTROLLER ||
        !process.env.NEXT_PUBLIC_PACKAGE
      ) {
        throw new Error("Global config, host controller or package not found");
      }
      // const suiNSs = await getOwnedSuiNS({ owner: account?.address });
      console.log(suiNS);
      const tx = new Transaction();

      tx.moveCall({
        package: process.env.NEXT_PUBLIC_PACKAGE,
        module: "trader",
        function: "mint",
        arguments: [
          tx.object(process.env.NEXT_PUBLIC_GLOBAL_CONFIG),
          tx.object(process.env.NEXT_PUBLIC_HOST_CONTROLLER),
          // tx.object(suiNS), //sui ns
          tx.pure.string((Date.now() + 1000).toString()),
          tx.pure.string((Date.now() + 1000).toString()),
          tx.splitCoins(tx.gas, [10000000]),
          tx.object("0x6"),
        ],
        // typeArguments: [
        //   "0xa9b4c8a8c2e2e1e070cde7e6443601dce5c1020a9ec881dc7be928b984ac3df4::token::TOKEN",
        // ],
      });

      // tx.setGasBudget(100);
      const result = await signAndExecuteTransaction({
        transaction: tx,
      });
      console.log(result);
    },
  });
};

export default useMintTraderCard;
