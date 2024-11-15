import { prisma } from "@/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const address = url.searchParams.get("investor");
  if (!address) {
    return Response.error();
  }

  const [fundings, claimables] = await Promise.all([
    await prisma.fund.findMany({
      where: {
        start_time: {
          lt: Date.now().toString(),
        },
        end_time: {
          gt: Date.now().toString(),
        },
      },
      include: {
        fund_history: {
          where: {
            investor: address,
          },
        },
        trader_operation: true,
      },
    }),
    await prisma.fund.findMany({
      where: {
        end_time: {
          lt: Date.now().toString(),
        },
      },
      include: {
        fund_history: {
          where: {
            investor: address,
          },
        },
        trader_operation: true,
      },
    }),
  ]);
  return Response.json({
    fundings:
      fundings?.filter(
        (fund) =>
          Number(fund.start_time) + Number(fund.invest_duration) >= Date.now()
      ) || [],
    runnings:
      fundings?.filter(
        (fund) =>
          Number(fund.start_time) + Number(fund.invest_duration) < Date.now()
      ) || [],
    claimables: claimables || [],
  });
}