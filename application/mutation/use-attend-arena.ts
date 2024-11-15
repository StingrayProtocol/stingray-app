import { syncDb } from "@/common/sync-db";
import { postWalrusApi } from "@/common/walrus-api";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { message } from "antd";
import useGetAllFund from "../query/use-get-all-fund";
import tempImage from "@/public/Stingray-Color.png";

type UseAttendArenaProps = UseMutationOptions<
  void,
  Error,
  {
    arenaId?: string;
    trader: string;
    name?: string;
    description?: string;
    traderFee: number;
    limit: number;
    imageUrl?: string;
    amount: number;
    startTime: number;
    endTime: number;
    tradeDuration?: number;
  }
>;

const useAttendArena = (options?: UseAttendArenaProps) => {
  const account = useCurrentAccount();
  const { refetch } = useGetAllFund();
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction({
      onError: (error) => {
        console.error(error);
      },
    });
  return useMutation({
    mutationFn: async ({
      arenaId,
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
      arenaId?: string;
      trader: string;
      name: string;
      description: string;
      traderFee: number;
      limit: number;
      imageUrl?: string;
      amount: number;
      startTime: number;
      endTime: number;
      tradeDuration?: number;
      roi: number;
    }) => {
      if (!account) {
        throw new Error("Account not found");
      }
      if (!tradeDuration) {
        throw new Error("ArenaType not found");
      }
      if (!arenaId) {
        throw new Error("ArenaId not found");
      }
      if (
        !process.env.NEXT_PUBLIC_GLOBAL_CONFIG ||
        !process.env.NEXT_PUBLIC_PACKAGE
      ) {
        throw new Error("Global config or package not found");
      }
      console.log({
        arenaId,
        trader,
        name,
        description,
        traderFee,
        limit,
        imageUrl,
        amount,
        startTime,
        endTime,
        tradeDuration,
        roi,
      });
      const response = await fetch(imageUrl);
      const fundImageBlob = await response.blob();
      message.loading("Uploading image to Walrus");
      const fundImageID = await postWalrusApi(fundImageBlob);

      const tx = new Transaction();

      const arenaRequest = tx.moveCall({
        package: process.env.NEXT_PUBLIC_PACKAGE,
        module: "arena",
        function: "create_arena_request",
        arguments: [tx.pure.u8(0)], // 0 week, 1 month, 2 3 month, 3 year
        typeArguments: ["0x2::sui::SUI"],
      }); //arena_request

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
          tx.pure.bool(true), // is arena
          tx.pure.u64(startTime), //start time
          tx.pure.u64(endTime - startTime), //invest duration
          tx.pure.u64(endTime + tradeDuration), // end time
          tx.pure.u64(limit * 10 ** 9), // limit amount
          tx.pure.u64(roi * 100), // roi
          tx.splitCoins(tx.gas, [amount * 10 ** 9]), // coin // temporary sui only
        ],
        typeArguments: ["0x2::sui::SUI"],
      }); //fund

      // attend arena
      tx.moveCall({
        package: process.env.NEXT_PUBLIC_PACKAGE,
        module: "arena",
        function: "attend",
        arguments: [
          tx.object(process.env.NEXT_PUBLIC_GLOBAL_CONFIG), //global config
          arenaRequest,
          tx.object(arenaId), //arena
          fund[0], //fund
          tx.object(trader), // trader
          tx.object("0x6"),
        ],
        typeArguments: ["0x2::sui::SUI"],
      });

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
      refetch();
    },
  });
};

export default useAttendArena;
