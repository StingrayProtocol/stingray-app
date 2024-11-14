import { syncDb } from "@/common/sync-db";
import {
  SUILEND_DEPOSIT,
  SUILEND_LENDING_MARKET,
  SUILEND_PLATFORM_TYPE,
  SUILEND_WITHDRAW,
} from "@/constant/defi-data/suilend";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { message } from "antd";
import useRefetchWholeFund from "./use-refetch-whole-fund";
import useGetFundBalance from "../query/use-get-fund-balance";

type UseSuilendWithdrawProps = UseMutationOptions<
  void,
  Error,
  {
    liquidityAmount: number;
    name: string;
    fund: string;
    trader: string;
    reStakeAmount: number;
  }
> & {
  fund?: string;
};

const useSuilendWithdraw = (options?: UseSuilendWithdrawProps) => {
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
      liquidityAmount,
      name,
      fund,
      trader,
      reStakeAmount,
    }: {
      liquidityAmount: number;
      name: string;
      fund: string;
      trader: string;
      reStakeAmount: number;
    }) => {
      console.log(name, fund, trader, reStakeAmount, liquidityAmount);
      const packageId = process.env.NEXT_PUBLIC_PACKAGE;
      const configId = process.env.NEXT_PUBLIC_GLOBAL_CONFIG;
      if (!packageId || !configId) {
        throw new Error("Global config or package not found");
      }
      const suilendWithdrawInfo = SUILEND_WITHDRAW.find(
        (item) => item.name === name
      );
      if (!suilendWithdrawInfo) {
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
          tx.pure.u64(Number(liquidityAmount)),
          tx.object("0x6"),
        ],
        typeArguments: [
          suilendWithdrawInfo.inputType,
          suilendWithdrawInfo.outputType,
          "0x2::sui::SUI",
        ],
      });

      const proof_coin = tx.moveCall({
        package: "0x2",
        module: "coin",
        function: "from_balance",
        arguments: [takeAsset],
        typeArguments: [suilendWithdrawInfo.inputType],
      });
      const outputAsset = tx.moveCall({
        package: packageId,
        module: "suilend",
        function: "withdraw",
        arguments: [
          tx.object(takeRequest),
          proof_coin,
          tx.object(SUILEND_LENDING_MARKET),
          tx.pure.u64(suilendWithdrawInfo.reserveIdx),
          tx.object("0x6"),
        ],
        typeArguments: [SUILEND_PLATFORM_TYPE, suilendWithdrawInfo.outputType],
      });

      const put_balance = tx.moveCall({
        package: "0x2",
        module: "coin",
        function: "into_balance",
        arguments: [outputAsset],
        typeArguments: [suilendWithdrawInfo.outputType],
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
          suilendWithdrawInfo.inputType,
          suilendWithdrawInfo.outputType,
          "0x2::sui::SUI",
        ],
      });
      if (!isNaN(Number(reStakeAmount)) && Number(reStakeAmount) > 0) {
        const suilendDepositInfo = SUILEND_DEPOSIT.find(
          (item) => item.name === name
        );
        if (!suilendDepositInfo) {
          throw new Error("Bucket withdraw info not found");
        }
        console.log(reStakeAmount, "stake");

        const [takeAsset, takeRequest] = tx.moveCall({
          package: packageId,
          module: "fund",
          function: "take_1_liquidity_for_1_liquidity_by_trader",
          arguments: [
            tx.object(configId),
            tx.object(fund),
            tx.object(trader),
            tx.pure.u64(Number(reStakeAmount)),
            tx.object("0x6"),
          ],
          typeArguments: [
            suilendDepositInfo.inputType,
            suilendDepositInfo.outputType,
            "0x2::sui::SUI",
          ],
        });

        const deposit_coin = tx.moveCall({
          package: "0x2",
          module: "coin",
          function: "from_balance",
          arguments: [takeAsset],
          typeArguments: [suilendDepositInfo.inputType],
        });

        const proof_coin = tx.moveCall({
          package: packageId,
          module: "suilend",
          function: "deposit",
          arguments: [
            tx.object(takeRequest),
            deposit_coin,
            tx.object(SUILEND_LENDING_MARKET),
            tx.pure.u64(suilendDepositInfo.reserveIdx),
            tx.object("0x6"),
          ],
          typeArguments: [SUILEND_PLATFORM_TYPE, suilendDepositInfo.inputType],
        });

        const put_balance = tx.moveCall({
          package: "0x2",
          module: "coin",
          function: "into_balance",
          arguments: [proof_coin],
          typeArguments: [suilendDepositInfo.outputType],
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
            suilendDepositInfo.inputType,
            suilendDepositInfo.outputType,
            "0x2::sui::SUI",
          ],
        });
      }

      const result = await signAndExecuteTransaction({
        transaction: tx,
      });
      console.log(result);
      await syncDb.withdraw("Suilend");
      await syncDb.deposit("Suilend");
    },
    onError: (error) => {
      console.error(error);
    },
    ...options,
    onSuccess: async (_data, _variables, _context) => {
      options?.onSuccess?.(_data, _variables, _context);
      message.success("Withdraw success");
      refetchBalance();
      refetch();
    },
  });
};

export default useSuilendWithdraw;
