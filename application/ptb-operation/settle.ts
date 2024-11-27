import { Transaction } from "@mysten/sui/transactions";

export const settle = ({
  tx,
  fundId,
  tokenouts,
  address,
  initShareId,
}: {
  tx: Transaction;
  fundId: string;
  tokenouts: string[];
  address: string;
  initShareId: string;
}): {
  tx: Transaction;
} => {
  const packageId = process.env.NEXT_PUBLIC_PACKAGE;
  const configId = process.env.NEXT_PUBLIC_GLOBAL_CONFIG;
  if (!packageId || !configId) {
    throw new Error("Global config or package not found");
  }

  tokenouts.forEach((tokenout) => {
    console.log(tokenout);
    tx.moveCall({
      package: packageId,
      module: "fund",
      function: "check_and_clean",
      arguments: [tx.object(fundId)],
      typeArguments: ["0x2::sui::SUI", tokenout],
    });
  });

  const request = tx.moveCall({
    package: packageId,
    module: "fund",
    function: "create_settle_request",
    arguments: [
      tx.object(configId),
      tx.object(fundId),
      tx.pure.bool(true),
      tx.object(initShareId),
    ],
    typeArguments: ["0x2::sui::SUI"],
  });

  const coin = tx.moveCall({
    package: packageId,
    module: "fund",
    function: "settle",
    arguments: [tx.object(configId), tx.object(fundId), tx.object(request)],
    typeArguments: ["0x2::sui::SUI"],
  });

  tx.transferObjects([coin], address);

  return { tx };
};
