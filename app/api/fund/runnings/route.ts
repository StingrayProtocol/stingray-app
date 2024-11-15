import { prisma } from "@/prisma";

export const dynamic = "force-dynamic";
export async function GET() {
  const now = Date.now();
  const funds =
    (await prisma.fund.findMany({
      where: {
        start_time: {
          lt: now.toString(),
        },
        end_time: {
          gt: now.toString(),
        },
      },
      include: {
        fund_history: true,
        trader_operation: true,
      },
    })) ?? [];
  return Response.json(
    funds?.filter(
      (fund) => Number(fund.start_time) + Number(fund.invest_duration) < now
    )
  );
}
