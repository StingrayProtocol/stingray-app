/* eslint-disable @typescript-eslint/no-explicit-any */
import { coins } from "@/constant/coin";
import { prisma } from "@/prisma";
import { Farming } from "@/type";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const fundId = url.searchParams.get("fundId");
  if (!fundId) {
    return Response.error();
  }

  const [fund, suilendOperations, scallopOperations] = await Promise.all([
    prisma.fund.findUnique({
      where: {
        object_id: fundId,
      },
      include: {
        fund_history: true,
        trader_operation: true,
      },
    }),
    prisma.$queryRaw`
      SELECT *
      FROM (
          SELECT *, 
          LAG(action) OVER (ORDER BY timestamp DESC, event_seq DESC) AS prev_action,
          LAG(protocol) OVER (ORDER BY timestamp DESC, event_seq DESC) AS prev_protocol,
          SUM(CASE WHEN action = 'Withdraw' AND protocol = 'Suilend' THEN 1 ELSE 0 END) OVER (ORDER BY timestamp DESC, event_seq DESC) AS withdraw_encountered
          FROM trader_operation
          ORDER BY timestamp DESC, event_seq DESC
      ) AS subquery
      WHERE action = 'Deposit' AND protocol = 'Suilend' AND fund_object_id = ${fundId}
        AND withdraw_encountered = 0
      ORDER BY timestamp, event_seq DESC;`,
    prisma.$queryRaw`
      SELECT *
      FROM (
          SELECT *, 
          LAG(action) OVER (ORDER BY timestamp DESC, event_seq DESC) AS prev_action,
          LAG(protocol) OVER (ORDER BY timestamp DESC, event_seq DESC) AS prev_protocol,
          SUM(CASE WHEN action = 'Withdraw' AND protocol = 'Scallop' THEN 1 ELSE 0 END) OVER (ORDER BY timestamp DESC, event_seq DESC) AS withdraw_encountered
          FROM trader_operation
          ORDER BY timestamp DESC, event_seq DESC
      ) AS subquery
      WHERE action = 'Deposit' AND protocol = 'Scallop' AND fund_object_id = ${fundId}
        AND withdraw_encountered = 0
      ORDER BY timestamp, event_seq DESC;`,
  ]);

  const getDisplayValue = (value: string, decimal: number) => {
    return (Number(value) / Math.pow(10, decimal))
      .toFixed(decimal)
      .replace(/\.?0+$/, "");
  };

  return Response.json(
    coins.map((coin) => {
      let balance = 0;
      const farmings: Farming[] = [];
      const coinTypeName = coin.typename.slice(2);
      // funded (spot)
      if (coin.name === "SUI") {
        const funded =
          fund?.fund_history?.reduce((acc, curr) => {
            acc += Number(curr.amount);
            return acc;
          }, 0) ?? 0;
        balance = funded;
      }
      // swapped (spot)
      const swapPaid =
        fund?.trader_operation?.reduce((acc, curr) => {
          if (curr.token_in === coinTypeName && curr.action === "Swap") {
            acc += Number(curr.amount_in);
          }
          return acc;
        }, 0) ?? 0;

      const swapReceived =
        fund?.trader_operation?.reduce((acc, curr) => {
          if (curr.token_out === coinTypeName && curr.action === "Swap") {
            acc += Number(curr.amount_out);
          }
          return acc;
        }, 0) ?? 0;

      // deposit (spot)

      const depositPaid =
        fund?.trader_operation?.reduce((acc, curr) => {
          if (curr.token_in === coinTypeName && curr.action === "Deposit") {
            acc += Number(curr.amount_in);
          }
          return acc;
        }, 0) ?? 0;

      // withdraw (spot)

      const withdrawReceived =
        fund?.trader_operation?.reduce((acc, curr) => {
          if (curr.token_out === coinTypeName && curr.action === "Withdraw") {
            acc += Number(curr.amount_out);
            return acc;
          }
          return acc;
        }, 0) ?? 0;

      // deposit received (liquidity token and farming total)
      // withdraw received (liquidity token and farming total)
      const farmingPositionSuilend = (
        suilendOperations as any[]
      )?.reduce<Farming>(
        (acc, curr) => {
          if (
            curr.token_in === coinTypeName &&
            curr.action === "Deposit" &&
            curr.protocol === "Suilend"
          ) {
            acc.name = coin.name;
            acc.value = (Number(acc.value) + Number(curr.amount_in)).toString();
            acc.liquidityTypename = curr.token_out;
            acc.liquidityValue = Number(curr.amount_out) + acc.liquidityValue;
            acc.protocol = "Suilend";
          }
          if (
            curr.token_out === coinTypeName &&
            curr.action === "Withdraw" &&
            curr.protocol === "Suilend"
          ) {
            acc.name = coin.name;
            acc.value = (
              Number(acc.value) - Number(curr.amount_out)
            ).toString();
            acc.liquidityTypename = curr.token_in;
            acc.liquidityValue = acc.liquidityValue - Number(curr.amount_in);
            acc.protocol = "Suilend";
          }
          return acc;
        },
        {
          name: "",
          value: "0",
          liquidityTypename: "",
          liquidityValue: 0,
          protocol: "",
        }
      );
      if (farmingPositionSuilend && farmingPositionSuilend?.name !== "") {
        farmings.push({
          ...farmingPositionSuilend,
          value: getDisplayValue(farmingPositionSuilend.value, coin.decimal),
        });
      }
      const farmingPositionScallop = (
        scallopOperations as any[]
      )?.reduce<Farming>(
        (acc, curr) => {
          if (
            curr.token_in === coinTypeName &&
            curr.action === "Deposit" &&
            curr.protocol === "Scallop"
          ) {
            acc.name = coin.name;
            acc.value = (Number(acc.value) + Number(curr.amount_in)).toString();
            acc.liquidityTypename = curr.token_out;
            acc.liquidityValue = Number(curr.amount_out) + acc.liquidityValue;
            acc.protocol = "Scallop";
          }
          if (
            curr.token_out === coinTypeName &&
            curr.action === "Withdraw" &&
            curr.protocol === "Scallop"
          ) {
            acc.name = coin.name;
            acc.value = (
              Number(acc.value) - Number(curr.amount_out)
            ).toString();
            acc.liquidityTypename = curr.token_in;
            acc.liquidityValue = acc.liquidityValue - Number(curr.amount_in);
            acc.protocol = "Scallop";
          }
          return acc;
        },
        {
          name: "",
          value: "0",
          liquidityTypename: "",
          liquidityValue: 0,
          protocol: "",
        }
      );

      if (farmingPositionScallop && farmingPositionScallop?.name !== "") {
        farmings.push({
          ...farmingPositionScallop,
          value: getDisplayValue(farmingPositionScallop.value, coin.decimal),
        });
      }

      const bucketOperation = fund?.trader_operation?.filter(
        (operation) =>
          operation.protocol === "Bucket" &&
          (operation.token_in === coinTypeName ||
            operation.token_out === coinTypeName)
      );
      const farmingPositionBucket =
        bucketOperation?.[bucketOperation?.length - 1]?.action === "Deposit"
          ? {
              name: coin.name,
              value: getDisplayValue(
                bucketOperation?.[bucketOperation?.length - 1].amount_in,
                coin.decimal
              ),
              liquidityTypename:
                bucketOperation?.[bucketOperation?.length - 1].token_out,
              liquidityValue: Number(
                bucketOperation?.[bucketOperation?.length - 1].amount_out
              ),
              protocol: "Bucket",
            }
          : undefined;
      if (farmingPositionBucket && farmingPositionBucket?.name !== "") {
        farmings.push(farmingPositionBucket);
      }

      balance =
        balance + swapReceived - swapPaid - depositPaid + withdrawReceived;

      return {
        name: coin.name,
        typename: coin.typename,
        value: getDisplayValue(balance.toString(), coin.decimal),
        decimal: coin.decimal,
        farmings,
      };
    })
  );
}
