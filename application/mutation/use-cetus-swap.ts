import { syncDb } from "@/common/sync-db";
import { CETUS_CONFIG, CETUS_SWAP } from "@/constant/defi-data/cetus";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { message } from "antd";
import useRefetchWholeFund from "./use-refetch-whole-fund";
import useGetFundBalance from "../query/use-get-fund-balance";

type UseCetusSwapProps = UseMutationOptions<
  void,
  Error,
  {
    fund: string;
    trader: string;
    inToken: string;
    inAmount: string;
    outToken: string;
  }
> & { fund?: string };

const useCetusSwap = (options?: UseCetusSwapProps) => {
  const { refetch } = useRefetchWholeFund();
  const { refetch: refetchBalance } = useGetFundBalance({
    fundId: options?.fund,
  });
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction({
      onError: (error) => {
        console.error(error);
      },
    });
  return useMutation({
    mutationFn: async ({
      fund,
      trader,
      inToken,
      inAmount,
      outToken,
    }: // outAmount,
    {
      trader: string;
      fund: string;
      inToken: string;
      inAmount: string;
      outToken: string;
      // outAmount: string;
    }) => {
      const packageId = process.env.NEXT_PUBLIC_PACKAGE;
      if (!packageId) {
        throw new Error("Package not found");
      }
      const configId = process.env.NEXT_PUBLIC_GLOBAL_CONFIG;
      if (!configId) {
        throw new Error("Config not found");
      }

      const tx = new Transaction();
      if (inToken === "SUI" || outToken === "SUI") {
        const suiAmount = inToken === "SUI" ? inAmount : 0;
        const otherAmount = inToken === "SUI" ? 0 : inAmount;
        const name = inToken === "SUI" ? outToken : inToken;

        const swapInfo = CETUS_SWAP.find((item) => item.name === name);
        if (!swapInfo) {
          throw new Error("Swap info not found");
        }
        if (Number(otherAmount) == 0) {
          //sui to other
          const [secondAsset, takeRequest] = tx.moveCall({
            package: packageId,
            module: "fund",
            function: "take_1_liquidity_for_1_liquidity_by_trader",
            arguments: [
              tx.object(configId),
              tx.object(fund),
              tx.object(trader),
              tx.pure.u64(Number(suiAmount) * swapInfo.secondToken.decimal),
              tx.object("0x6"),
            ],
            typeArguments: [
              swapInfo.secondToken.type,
              swapInfo.firstToken.type,
              "0x2::sui::SUI",
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
            function: "put_1_liquidity_for_1_liquidity_by_all",
            arguments: [
              tx.object(configId),
              tx.object(fund),
              tx.object(takeRequest),
              firstAsset,
            ],
            typeArguments: [
              swapInfo.secondToken.type,
              swapInfo.firstToken.type,
              "0x2::sui::SUI",
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
          //other to sui

          const [firstAsset, takeRequest] = tx.moveCall({
            package: packageId,
            module: "fund",
            function: "take_1_liquidity_for_1_liquidity_by_trader",
            arguments: [
              tx.object(configId),
              tx.object(fund),
              tx.object(trader),
              tx.pure.u64(Number(otherAmount) * swapInfo.firstToken.decimal),
              tx.object("0x6"),
            ],
            typeArguments: [
              swapInfo.firstToken.type,
              swapInfo.secondToken.type,
              "0x2::sui::SUI",
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
            function: "put_1_liquidity_for_1_liquidity_by_all",
            arguments: [
              tx.object(configId),
              tx.object(fund),
              tx.object(takeRequest),
              secondAsset,
            ],
            typeArguments: [
              swapInfo.firstToken.type,
              swapInfo.secondToken.type,
              "0x2::sui::SUI",
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
      } else {
        //other to other
        console.log(inToken, outToken);
        const otherAmount = inAmount;
        const swapInfo = CETUS_SWAP.find((item) => item.name === inToken);
        if (!swapInfo) {
          throw new Error("Swap info not found");
        }
        const secondSwapInfo = CETUS_SWAP.find(
          (item) => item.name === outToken
        );
        if (!secondSwapInfo) {
          throw new Error("Swap info not found");
        }

        // "other to SUI" to other
        const [firstAsset, takeRequest] = tx.moveCall({
          package: packageId,
          module: "fund",
          function: "take_1_liquidity_for_1_liquidity_by_trader",
          arguments: [
            tx.object(configId),
            tx.object(fund),
            tx.object(trader),
            tx.pure.u64(Number(otherAmount) * swapInfo.firstToken.decimal),
            tx.object("0x6"),
          ],
          typeArguments: [
            swapInfo.firstToken.type,
            swapInfo.secondToken.type,
            "0x2::sui::SUI",
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
        console.log("secondAsset!!!!!!!!!!!!");
        const secondAssetValue = tx.moveCall({
          package: "0x2",
          module: "balance",
          function: "value",
          arguments: [secondAsset],
          typeArguments: ["0x2::sui::SUI"],
        });

        tx.moveCall({
          package: packageId,
          module: "fund",
          function: "put_1_liquidity_for_1_liquidity_by_all",
          arguments: [
            tx.object(configId),
            tx.object(fund),
            tx.object(takeRequest),
            secondAsset,
          ],
          typeArguments: [
            swapInfo.firstToken.type,
            swapInfo.secondToken.type,
            "0x2::sui::SUI",
          ],
        });

        tx.moveCall({
          package: packageId,
          module: "cetus",
          function: "drop_zero_balance",
          arguments: [firstAsset],
          typeArguments: [swapInfo.firstToken.type],
        });

        // other to "SUI to other"

        const [secondSecondAsset, secondTakeRequest] = tx.moveCall({
          package: packageId,
          module: "fund",
          function: "take_1_liquidity_for_1_liquidity_by_trader",
          arguments: [
            tx.object(configId),
            tx.object(fund),
            tx.object(trader),
            secondAssetValue,
            tx.object("0x6"),
          ],
          typeArguments: [
            secondSwapInfo.secondToken.type,
            secondSwapInfo.firstToken.type,
            "0x2::sui::SUI",
          ],
        });

        const secondFirstAsset = tx.moveCall({
          package: packageId,
          module: "cetus",
          function: "take_zero_balance",
          typeArguments: [secondSwapInfo.firstToken.type],
        });

        tx.moveCall({
          package: packageId,
          module: "cetus",
          function: "swap",
          arguments: [
            tx.object(secondTakeRequest),
            secondFirstAsset,
            secondSecondAsset,
            tx.object(CETUS_CONFIG),
            tx.object(secondSwapInfo.pool),
            tx.pure.bool(false),
            tx.pure.bool(true),
            tx.object("0x6"),
          ],
          typeArguments: [
            secondSwapInfo.secondToken.type,
            secondSwapInfo.firstToken.type,
            secondSwapInfo.poolFirstType,
            secondSwapInfo.poolSecondType,
          ],
        });

        tx.moveCall({
          package: packageId,
          module: "fund",
          function: "put_1_liquidity_for_1_liquidity_by_all",
          arguments: [
            tx.object(configId),
            tx.object(fund),
            tx.object(secondTakeRequest),
            secondFirstAsset,
          ],
          typeArguments: [
            secondSwapInfo.secondToken.type,
            secondSwapInfo.firstToken.type,
            "0x2::sui::SUI",
          ],
        });

        tx.moveCall({
          package: packageId,
          module: "cetus",
          function: "drop_zero_balance",
          arguments: [secondSecondAsset],
          typeArguments: [swapInfo.secondToken.type],
        });
      }
      const result = await signAndExecuteTransaction({
        transaction: tx,
      });
      console.log(result);
      return;
    },
    onError: (error) => {
      console.error(error);
    },
    ...options,
    onSuccess: async (_data, _variables, _context) => {
      options?.onSuccess?.(_data, _variables, _context);
      message.success("Swap success");
      await syncDb.swap();
      refetchBalance();
      refetch();
    },
  });
};

export default useCetusSwap;
