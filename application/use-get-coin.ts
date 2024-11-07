import { useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation } from "@tanstack/react-query";

const useGetCoin = () => {
  const suiClient = useSuiClient();
  return useMutation({
    mutationFn: async ({
      owner,
      coinType,
      amount,
    }: {
      owner: string;
      coinType: string;
      amount: number;
    }) => {
      const tx = new Transaction();
      const coins = await suiClient.getCoins({
        owner,
        coinType,
        limit: 10,
      });
      const coinId = tx.mergeCoins(
        coins.data[0].coinObjectId,
        coins.data.slice(1).map((c) => c.coinObjectId)
      );
      tx.splitCoins(tx.object(coinId), [amount]);
      return tx;
    },
  });
};

export default useGetCoin;
