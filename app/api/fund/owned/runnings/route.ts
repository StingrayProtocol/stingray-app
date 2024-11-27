import { prisma } from "@/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export async function GET(req: Request) {
  const url = new URL(req.url);
  const owner = url.searchParams.get("owner");
  if (!owner) {
    return Response.error();
  }

  const funds =
    (await prisma.fund.findMany({
      where: {
        owner_id: owner,
        start_time: {
          lt: Date.now().toString(),
        },
        end_time: {
          gt: Date.now().toString(),
        },
        settle_result: {
          none: {},
        },
      },
      include: {
        fund_history: true,
        trader_operation: true,
      },
    })) ?? [];

  return Response.json(
    funds?.filter(
      (fund) =>
        Number(fund.start_time) + Number(fund.invest_duration) < Date.now()
    )
  );
}
