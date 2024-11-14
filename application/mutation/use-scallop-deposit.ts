import {
  SCALLOP_DEPOSIT,
  SCALLOP_MARKET,
  SCALLOP_VERSION,
} from "@/constant/defi-data/scallop";

import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import useRefetchWholeFund from "./use-refetch-whole-fund";
import useGetFundBalance from "../query/use-get-fund-balance";
import { message } from "antd";
import { syncDb } from "@/common/sync-db";

type UseScallopDespositProps = UseMutationOptions<
  void,
  Error,
  {
    name: string;
    fund: string;
    trader: string;
    amount: string;
  }
> & {
  fund?: string;
};

const useScallopDeposit = (options?: UseScallopDespositProps) => {
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
    }: {
      name: string;
      fund: string;
      trader: string;
      amount: string;
    }) => {
      const packageId = process.env.NEXT_PUBLIC_PACKAGE;
      const configId = process.env.NEXT_PUBLIC_GLOBAL_CONFIG;
      if (!packageId || !configId) {
        throw new Error("Global config or package not found");
      }
      const scallopDepositInfo = SCALLOP_DEPOSIT.find(
        (item) => item.name === name
      );
      if (!scallopDepositInfo) {
        throw new Error("Bucket withdraw info not found");
      }
      const tx = new Transaction();

      const [takeAsset, takeRequest] = tx.moveCall({
        package: packageId,
        module: "fund",
        function: "take_1_liquidity_for_1_liquidity_by_trader",
        arguments: [
          tx.object(configId),
          tx.object(fund),
          tx.object(trader),
          tx.pure.u64(Number(amount) * scallopDepositInfo.inputDecimal),
          tx.object("0x6"),
        ],
        typeArguments: [
          scallopDepositInfo.inputType,
          scallopDepositInfo.outputType,
          "0x2::sui::SUI",
        ],
      });

      const deposit_coin = tx.moveCall({
        package: "0x2",
        module: "coin",
        function: "from_balance",
        arguments: [takeAsset],
        typeArguments: [scallopDepositInfo.inputType],
      });

      const proof_coin = tx.moveCall({
        package: packageId,
        module: "scallop",
        function: "deposit",
        arguments: [
          tx.object(takeRequest),
          deposit_coin,
          tx.object(SCALLOP_VERSION),
          tx.object(SCALLOP_MARKET),
          tx.object("0x6"),
        ],
        typeArguments: [scallopDepositInfo.inputType],
      });

      const put_balance = tx.moveCall({
        package: "0x2",
        module: "coin",
        function: "into_balance",
        arguments: [proof_coin],
        typeArguments: [scallopDepositInfo.outputType],
      });

      tx.moveCall({
        package: packageId,
        module: "fund",
        function: "put_1_liquidity_for_1_liquidity_by_all",
        arguments: [
          tx.object(configId),
          tx.object(fund),
          tx.object(takeRequest),
          put_balance,
        ],
        typeArguments: [
          scallopDepositInfo.inputType,
          scallopDepositInfo.outputType,
          "0x2::sui::SUI",
        ],
      });

      const result = await signAndExecuteTransaction({
        transaction: tx,
      });
      console.log(result);
      await syncDb.deposit("Scallop");
    },
    onError: (error) => {
      console.error(error);
    },
    ...options,
    onSuccess: async (_data, _variables, _context) => {
      options?.onSuccess?.(_data, _variables, _context);
      message.success("Deposit success");
      refetchBalance();
      refetch();
    },
  });
};

export default useScallopDeposit;
