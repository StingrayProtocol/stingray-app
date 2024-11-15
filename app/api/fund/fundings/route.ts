import { prisma } from "@/prisma";

export async function GET() {
  const funds =
    (await prisma.fund.findMany({
      where: {
        start_time: {
          lt: Date.now().toString(),
        },
      },
      include: {
        fund_history: true,
        trader_operation: true,
      },
    })) ?? [];
  console.log(funds, "fundings!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  return Response.json(
    funds?.filter(
      (fund) =>
        Number(fund.start_time) + Number(fund.invest_duration) >= Date.now()
    )
  );
}
