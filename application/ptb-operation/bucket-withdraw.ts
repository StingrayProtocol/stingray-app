import {
  BUCKET_DEPOSIT,
  BUCKET_PROTOCOL,
  BUCKET_WITHDRAW,
  FLASK,
  FOUNTAIN,
} from "@/constant/defi-data/bucket";
import { Transaction } from "@mysten/sui/transactions";

export const bucketWithdraw = ({
  tx,
  name,
  reStakeAmount,
  fundId,
  traderId,
}: {
  tx: Transaction;
  name: string;
  reStakeAmount: number;
  fundId: string;
  traderId: string;
}): {
  tx: Transaction;
} => {
  const packageId = process.env.NEXT_PUBLIC_PACKAGE;
  const configId = process.env.NEXT_PUBLIC_GLOBAL_CONFIG;
  if (!packageId || !configId) {
    throw new Error("Global config or package not found");
  }
  const bucketWithdrawInfo = BUCKET_WITHDRAW.find((item) => item.name === name);
  if (!bucketWithdrawInfo) {
    throw new Error("Bucket withdraw info not found");
  }

  const [takeAsset, takeRequest] = tx.moveCall({
    package: packageId,
    module: "fund",
    function: "take_1_nonliquidity_for_2_liquidity_by_trader",
    arguments: [
      tx.object(configId),
      tx.object(fundId),
      tx.object(traderId),
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
      tx.object(fundId),
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

  if (!isNaN(Number(reStakeAmount)) && Number(reStakeAmount) > 0) {
    const bucketDepositInfo = BUCKET_DEPOSIT.find((item) => item.name === name);
    if (!bucketDepositInfo) {
      throw new Error("Bucket withdraw info not found");
    }
    const [takeAsset, takeRequest] = tx.moveCall({
      package: packageId,
      module: "fund",
      function: "take_1_liquidity_for_1_nonliquidity_by_trader",
      arguments: [
        tx.object(configId),
        tx.object(fundId),
        tx.object(traderId),
        tx.pure.u64(Number(reStakeAmount)),
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
        tx.object(fundId),
        tx.object(takeRequest),
        proof,
      ],
      typeArguments: [
        bucketDepositInfo.inputType,
        bucketDepositInfo.outputType,
        "0x2::sui::SUI",
      ],
    });
  }
  return { tx };
};
