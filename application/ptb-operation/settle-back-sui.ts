import { FundBalance } from "@/type";
import { Transaction } from "@mysten/sui/transactions";
import { suilendWithdraw } from "./suilend-withdraw";
import { scallopWithdraw } from "./scallop-withdraw";
import { bucketWithdraw } from "./bucket-withdraw";
import { swap } from "./swap";
import { coins } from "@/constant/coin";

export const settleBackToSui = ({
  tx,
  fundBalance,
  fundId,
  traderId,
}: {
  tx: Transaction;
  fundBalance: FundBalance;
  fundId: string;
  traderId: string;
}) => {
  const swapBalance: { [key: string]: number } = {};

  fundBalance.forEach((balance) => {
    swapBalance[balance.name] = Number(balance.value);
  });

  fundBalance.forEach((balance) => {
    balance.farmings.forEach((farming) => {
      if (farming.protocol === "Suilend") {
        console.log("suilendWithdraw", farming);
        suilendWithdraw({
          tx,
          name: balance.name,
          traderId,
          fundId,
          liquidityAmount: farming.liquidityValue,
          reStakeAmount: 0,
        });
        swapBalance[balance.name] += Number(farming.value);
      }
      if (farming.protocol === "Scallop") {
        console.log("scallopWithdraw", farming);
        scallopWithdraw({
          tx,
          name: balance.name,
          traderId,
          fundId,
          liquidityAmount: farming.liquidityValue,
          reStakeAmount: 0,
        });
        swapBalance[balance.name] += Number(farming.value);
      }
      if (farming.protocol === "Bucket") {
        console.log("bucketWithdraw", farming);
        bucketWithdraw({
          tx,
          name: balance.name,
          traderId,
          fundId,
          reStakeAmount: 0,
        });
        swapBalance[balance.name] += Number(farming.value);
      }
      console.log(swapBalance);
    });
  });
  Object.entries(swapBalance).forEach(([name, value]) => {
    if (name === "SUI") return;
    if (value <= 0) return;
    // count++;

    // if (count > 1) return;

    const coin = coins.find((coin) => coin.name === name);
    if (!coin) return;
    console.log(value);
    console.log(Math.floor(value * Math.pow(10, coin?.decimal)) - 1);
    console.log(
      ((Math.floor(value * Math.pow(10, coin?.decimal)) - 1) /
        Math.pow(10, coin?.decimal)) *
        Math.pow(10, coin?.decimal)
    );
    swap({
      tx,
      inToken: name,
      outToken: "SUI",
      inAmount: (
        (Math.floor(value * Math.pow(10, coin?.decimal)) - 1) /
        Math.pow(10, coin?.decimal)
      ).toString(),
      traderId,
      fundId,
      isMax: true,
    });
  });

  return tx;
};
