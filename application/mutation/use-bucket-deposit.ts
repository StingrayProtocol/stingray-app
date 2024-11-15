import { syncDb } from "@/common/sync-db";
import {
  BUCKET_DEPOSIT,
  BUCKET_PROTOCOL,
  BUCKET_WITHDRAW,
  FLASK,
  FOUNTAIN,
} from "@/constant/defi-data/bucket";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import useRefetchWholeFund from "./use-refetch-whole-fund";
import useGetFundBalance from "../query/use-get-fund-balance";
import { message } from "antd";

type UseBucketDespositProps = UseMutationOptions<
  void,
  Error,
  {
    name: string;
    fund: string;
    trader: string;
    amount: string;
    hasDeposit?: boolean;
  }
> & {
  fund?: string;
};

const useBucketDeposit = (options?: UseBucketDespositProps) => {
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
      name,
      fund,
      trader,
      amount,
      hasDeposit,
    }: {
      name: string;
      fund: string;
      trader: string;
      amount: string;
      hasDeposit?: boolean;
    }) => {
      const packageId = process.env.NEXT_PUBLIC_PACKAGE;
      const configId = process.env.NEXT_PUBLIC_GLOBAL_CONFIG;
      if (!packageId || !configId) {
        throw new Error("Global config or package not found");
      }
      const bucketDepositInfo = BUCKET_DEPOSIT.find(
        (item) => item.name === name
      );
      if (!bucketDepositInfo) {
        throw new Error("Bucket withdraw info not found");
      }
      const tx = new Transaction();

      if (hasDeposit) {
        // Withdraw
        const bucketWithdrawInfo = BUCKET_WITHDRAW.find(
          (item) => item.name === name
        );
        if (!bucketWithdrawInfo) {
          throw new Error("Bucket withdraw info not found");
        }
        const [takeAsset, takeRequest] = tx.moveCall({
          package: packageId,
          module: "fund",
          function: "take_1_nonliquidity_for_2_liquidity_by_trader",
          arguments: [
            tx.object(configId),
            tx.object(fund),
            tx.object(trader),
            tx.object("0x6"),
          ],
          typeArguments: [
            bucketWithdrawInfo.inputType,
            bucketWithdrawInfo.outputType1,
            bucketWithdrawInfo.outputType2,
            "0x2::sui::SUI",
          ],
        });

        const [outputAsset1, outputAsset2] = tx.moveCall({
          package: packageId,
          module: "bucket",
          function: "withdraw",
          arguments: [
            tx.object(takeRequest),
            takeAsset,
            tx.object(BUCKET_PROTOCOL),
            tx.object(FLASK),
            tx.object(FOUNTAIN),
            tx.object("0x6"),
          ],
        });

        tx.moveCall({
          package: packageId,
          module: "fund",
          function: "put_1_nonliquidity_for_2_liquidity_by_all",
          arguments: [
            tx.object(configId),
            tx.object(fund),
            tx.object(takeRequest),
            outputAsset1,
            outputAsset2,
          ],
          typeArguments: [
            bucketWithdrawInfo.inputType,
            bucketWithdrawInfo.outputType1,
            bucketWithdrawInfo.outputType2,
            "0x2::sui::SUI",
          ],
        });
      }

      const [takeAsset, takeRequest] = tx.moveCall({
        package: packageId,
        module: "fund",
        function: "take_1_liquidity_for_1_nonliquidity_by_trader",
        arguments: [
          tx.object(configId),
          tx.object(fund),
          tx.object(trader),
          tx.pure.u64(Number(amount) * bucketDepositInfo.inputDecimal),
          tx.object("0x6"),
        ],
        typeArguments: [
          bucketDepositInfo.inputType,
          bucketDepositInfo.outputType,
          "0x2::sui::SUI",
        ],
      });

      const proof = tx.moveCall({
        package: packageId,
        module: "bucket",
        function: "deposit",
        arguments: [
          tx.object(takeRequest),
          takeAsset,
          tx.object(BUCKET_PROTOCOL),
          tx.object(FLASK),
          tx.object(FOUNTAIN),
          tx.object("0x6"),
        ],
      });

      tx.moveCall({
        package: packageId,
        module: "fund",
        function: "put_1_liquidity_for_1_nonliquidity_by_all",
        arguments: [
          tx.object(configId),
          tx.object(fund),
          tx.object(takeRequest),
          proof,
        ],
        typeArguments: [
          bucketDepositInfo.inputType,
          bucketDepositInfo.outputType,
          "0x2::sui::SUI",
        ],
      });

      const result = await signAndExecuteTransaction({
        transaction: tx,
      });
      console.log(result);
      await syncDb.withdraw("Bucket");
      await syncDb.deposit("Bucket");
    },
    onError: (error) => {
      console.error(error);
    },
    ...options,
    onSuccess: async (_data, _variables, _context) => {
      options?.onSuccess?.(_data, _variables, _context);
      message.success("Deposit success");
      refetch();
      refetchBalance();
    },
  });
};

export default useBucketDeposit;
