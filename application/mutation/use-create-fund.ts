import { postWalrusApi } from "@/common/walrus-api";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { message } from "antd";
import useGetOwnedFund from "../query/use-get-owned-fund";
import { syncDb } from "@/common/sync-db";
import tempImage from "@/public/Stingray-Color.png";

type UseCreateFundProps = UseMutationOptions<
  void,
  Error,
  {
    trader: string;
    name?: string;
    description?: string;
    traderFee: number;
    limit: number;
    imageUrl?: string;
    amount: number;
    startTime: number;
    endTime: number;
    tradeDuration: number;
  }
>;

const useCreateFund = (options?: UseCreateFundProps) => {
  const account = useCurrentAccount();
  const { refetch } = useGetOwnedFund();
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction({
      onError: (error) => {
        console.error(error);
      },
    });
  return useMutation({
    mutationFn: async ({
      trader,
      name = "",
      description = "",
      traderFee = 20,
      limit = 1,
      imageUrl = tempImage.src,
      amount = 0.01,
      startTime,
      endTime,
      tradeDuration,
      roi,
    }: {
      trader: string;
      name: string;
      description: string;
      traderFee: number;
      limit: number;
      imageUrl?: string;
      amount: number;
      startTime: number;
      endTime: number;
      tradeDuration: number;
      roi: number;
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

      console.log(startTime);
      console.log(new Date(startTime).toISOString());
      console.log(new Date(startTime).toLocaleTimeString());
      console.log(new Date(startTime).toUTCString());
      console.log(new Date(endTime).toUTCString());

      console.log(endTime);
      console.log(tradeDuration);
      console.log(endTime - startTime);

      const response = await fetch(imageUrl);
      const fundImageBlob = await response.blob();
      message.loading("Uploading image to Walrus");
      const fundImageID = await postWalrusApi(fundImageBlob);

      const tx = new Transaction();

      const fund = tx.moveCall({
        package: process.env.NEXT_PUBLIC_PACKAGE,
        module: "fund",
        function: "create",
        arguments: [
          tx.object(process.env.NEXT_PUBLIC_GLOBAL_CONFIG), //global config
          tx.pure.string(name),
          tx.pure.string(description),
          tx.pure.string(fundImageID), // image
          tx.object(trader), // trader
          tx.pure.u64(traderFee * 100), // trader fee
          tx.pure.bool(false), // is arena
          tx.pure.u64(Date.now()), //start time
          tx.pure.u64(endTime - startTime), //invest duration
          tx.pure.u64(endTime + tradeDuration), // end time
          tx.pure.u64(limit * 10 ** 9), // limit amount
          tx.pure.u64(roi * 100), // roi
          tx.splitCoins(tx.gas, [amount * 10 ** 9]), // coin // temporary sui only
        ],
        typeArguments: ["0x2::sui::SUI"],
      }); //fund

      // fund to share object
      tx.moveCall({
        package: process.env.NEXT_PUBLIC_PACKAGE,
        module: "fund",
        function: "to_share_object",
        arguments: [
          fund[0], //fund
        ],
        typeArguments: ["0x2::sui::SUI"],
      });

      // mint share
      const share = tx.moveCall({
        package: process.env.NEXT_PUBLIC_PACKAGE,
        module: "fund_share",
        function: "mint",
        arguments: [
          tx.object(process.env.NEXT_PUBLIC_GLOBAL_CONFIG), //global config
          fund[1], //mint request
        ],
        typeArguments: ["0x2::sui::SUI"],
      });

      tx.transferObjects([share], account.address);
      const result = await signAndExecuteTransaction({
        transaction: tx,
      });
      console.log(result);
    },
    onError: (error) => {
      console.error(error);
    },
    ...options,
    onSuccess: async () => {
      await syncDb.fund();
      await refetch();
      message.success("Congratulations! You have successfully created a fund!");
    },
  });
};

export default useCreateFund;
