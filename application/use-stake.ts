import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation } from "@tanstack/react-query";

const useStake = () => {
  const client = useSuiClient();
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction({
      onError: (error) => {
        console.error(error);
      },
    });
  return useMutation({
    mutationFn: async () => {
      if (!account) {
        throw new Error("Account not found");
      }
      const tx = new Transaction();
      const coin = await client.getCoins({
        owner: account?.address,
        coinType:
          "0xa9b4c8a8c2e2e1e070cde7e6443601dce5c1020a9ec881dc7be928b984ac3df4::token::TOKEN",
      });
      tx.moveCall({
        package:
          "0x35b773e91f49ac2026819171ea13319e20a9345f68d99188681c075e3b2ec6d2",
        module: "pool",
        function: "stake",
        arguments: [
          tx.object(
            "0x647d57c0a7b1b7a829d14de0a2db60d6df266a7cc096ba11074650c3153e1eae"
          ),
          tx.splitCoins(tx.object(coin.data[0].coinObjectId), [100]),
          tx.object("0x6"),
        ],
        typeArguments: [
          "0xa9b4c8a8c2e2e1e070cde7e6443601dce5c1020a9ec881dc7be928b984ac3df4::token::TOKEN",
        ],
      });
      tx.moveCall({
        package:
          "0x35b773e91f49ac2026819171ea13319e20a9345f68d99188681c075e3b2ec6d2",
        module: "pool",
        function: "stake",
        arguments: [
          tx.object(
            "0x647d57c0a7b1b7a829d14de0a2db60d6df266a7cc096ba11074650c3153e1eae"
          ),
          tx.splitCoins(tx.object(coin.data[0].coinObjectId), [100]),
          tx.object("0x6"),
        ],
        typeArguments: [
          "0xa9b4c8a8c2e2e1e070cde7e6443601dce5c1020a9ec881dc7be928b984ac3df4::token::TOKEN",
        ],
      });
      // tx.setGasBudget(100);
      const result = await signAndExecuteTransaction({
        transaction: tx,
      });
      console.log(result);
    },
  });
};

export default useStake;
