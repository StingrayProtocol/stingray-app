import { InvestTarget, SwapInfo } from "@/type";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation } from "@tanstack/react-query";

const useCetusSwap = () => {
  return useMutation({
    mutationFn: async ({ target }: { target: InvestTarget }) => {
      const packageId = process.env.NEXT_PUBLIC_PACKAGE;
      if (!packageId) {
        throw new Error("Package not found");
      }
      const configId = process.env.NEXT_PUBLIC_GLOBAL_CONFIG;
      if (!configId) {
        throw new Error("Config not found");
      }
      const tx = new Transaction();
      if (swapInfo.firstToken.amount == 0) {
        const [secondAsset, takeRequest] = tx.moveCall({
          package: packageId,
          module: "fund",
          function: "take_1_liquidity_for_1_liquidity",
          arguments: [
            tx.object(configId),
            tx.object(target.fund),
            tx.object(target.trader),
            tx.pure.u64(
              swapInfo.secondToken.amount * swapInfo.secondToken.decimal
            ),
            tx.object("0x6"),
          ],
          typeArguments: [
            swapInfo.secondToken.type,
            swapInfo.firstToken.type,
            target.fundType,
          ],
        });

        const firstAsset = tx.moveCall({
          package: packageId,
          module: "cetus",
          function: "take_zero_balance",
          typeArguments: [swapInfo.firstToken.type],
        });

        tx.moveCall({
          package: packageId,
          module: "cetus",
          function: "swap",
          arguments: [
            tx.object(takeRequest),
            firstAsset,
            secondAsset,
            tx.object(CETUS_CONFIG),
            tx.object(swapInfo.pool),
            tx.pure.bool(false),
            tx.pure.bool(true),
            tx.object("0x6"),
          ],
          typeArguments: [
            swapInfo.secondToken.type,
            swapInfo.firstToken.type,
            swapInfo.poolFirstType,
            swapInfo.poolSecondType,
          ],
        });

        tx.moveCall({
          package: packageId,
          module: "fund",
          function: "put_1_liquidity_for_1_liquidity",
          arguments: [
            tx.object(configId),
            tx.object(target.fund),
            tx.object(takeRequest),
            firstAsset,
          ],
          typeArguments: [
            swapInfo.secondToken.type,
            swapInfo.firstToken.type,
            target.fundType,
          ],
        });

        tx.moveCall({
          package: packageId,
          module: "cetus",
          function: "drop_zero_balance",
          arguments: [secondAsset],
          typeArguments: [swapInfo.secondToken.type],
        });
      } else {
        //swapInfo.firstToken.amount == 0

        const [firstAsset, takeRequest] = tx.moveCall({
          package: packageId,
          module: "fund",
          function: "take_1_liquidity_for_1_liquidity",
          arguments: [
            tx.object(configId),
            tx.object(target.fund),
            tx.object(target.trader),
            tx.pure.u64(
              swapInfo.firstToken.amount * swapInfo.firstToken.decimal
            ),
            tx.object("0x6"),
          ],
          typeArguments: [
            swapInfo.firstToken.type,
            swapInfo.secondToken.type,
            target.fundType,
          ],
        });

        const secondAsset = tx.moveCall({
          package: packageId,
          module: "cetus",
          function: "take_zero_balance",
          typeArguments: [swapInfo.secondToken.type],
        });
        console.log(secondAsset);
        tx.moveCall({
          package: packageId,
          module: "cetus",
          function: "swap",
          arguments: [
            tx.object(takeRequest),
            firstAsset,
            secondAsset,
            tx.object(CETUS_CONFIG),
            tx.object(swapInfo.pool),
            tx.pure.bool(true),
            tx.pure.bool(true),
            tx.object("0x6"),
          ],
          typeArguments: [
            swapInfo.firstToken.type,
            swapInfo.secondToken.type,
            swapInfo.poolFirstType,
            swapInfo.poolSecondType,
          ],
        });

        tx.moveCall({
          package: packageId,
          module: "fund",
          function: "put_1_liquidity_for_1_liquidity",
          arguments: [
            tx.object(configId),
            tx.object(target.fund),
            tx.object(takeRequest),
            secondAsset,
          ],
          typeArguments: [
            swapInfo.firstToken.type,
            swapInfo.secondToken.type,
            target.fundType,
          ],
        });

        tx.moveCall({
          package: packageId,
          module: "cetus",
          function: "drop_zero_balance",
          arguments: [firstAsset],
          typeArguments: [swapInfo.firstToken.type],
        });
      }
    },
  });
};

export default useCetusSwap;
