import { postWalrusApi } from "@/common/walrus-api";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { message } from "antd";
import useGetOwnedTraderCard from "../query/use-get-owned-trader-card";
import { syncDb } from "@/common/sync-db";
type UseMintTraderCardProps = UseMutationOptions<
  void,
  Error,
  { suiNS: string; intro: string; imageUrl: string; canvasBlob: Blob }
> & {
  fund: string;
};

const useMintTraderCard = (options?: UseMintTraderCardProps) => {
  const account = useCurrentAccount();
  const { refetch } = useGetOwnedTraderCard();

  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction({
      onError: (error) => {
        console.error(error);
      },
    });
  return useMutation({
    mutationFn: async ({
      suiNS,
      intro = "",
      imageUrl,
      canvasBlob,
    }: {
      suiNS?: string;
      intro: string;
      imageUrl: string;
      canvasBlob: Blob;
    }) => {
      if (!account) {
        throw new Error("Account not found");
      }
      console.log(suiNS);

      // if (!suiNS) {
      //   throw new Error("SuiNS not found");
      // }
      if (
        !process.env.NEXT_PUBLIC_GLOBAL_CONFIG ||
        !process.env.NEXT_PUBLIC_HOST_CONTROLLER ||
        !process.env.NEXT_PUBLIC_PACKAGE
      ) {
        throw new Error("Global config, host controller or package not found");
      }

      // const traderCard = await fetch({
      //   method: "POST",
      //   body: canvasBuffer
      // })
      // console.log(traderCard);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      message.loading("Uploading image to Walrus");
      const [pfp, traderCard] = await Promise.all([
        postWalrusApi(blob),
        postWalrusApi(canvasBlob),
      ]);
      const tx = new Transaction();
      message.loading("Confirm transaction in your wallet");

      tx.moveCall({
        package: process.env.NEXT_PUBLIC_PACKAGE,
        module: "trader",
        function: "mint",
        arguments: [
          tx.object(process.env.NEXT_PUBLIC_GLOBAL_CONFIG),
          tx.object(process.env.NEXT_PUBLIC_HOST_CONTROLLER),
          // tx.object(suiNS), //sui ns
          tx.pure.string(pfp),
          tx.pure.string(traderCard),
          tx.pure.string(intro),
          // tx.splitCoins(tx.gas, [Math.pow(10, 9)]),
          // tx.splitCoins(tx.gas, [0]),
          tx.object("0x6"),
        ],
      });
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
    onSuccess: async () => {
      message.success(
        "Congratulations! You have successfully minted your trader card!"
      );
      await syncDb.traderCard();

      refetch();
    },
  });
};

export default useMintTraderCard;
