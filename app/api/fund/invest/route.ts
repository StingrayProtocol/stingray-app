import { prisma } from "@/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;
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
        fund_history: {
          some: {
            investor: address,
          },
        },
        settle_result: {
          none: {},
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
        OR: [
          {
            end_time: {
              lt: Date.now().toString(),
            },
          },
          {
            settle_result: {
              some: {}, // Ensures at least one related settle_result exists
            },
          },
        ],
        fund_history: {
          some: {
            investor: address,
          },
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
