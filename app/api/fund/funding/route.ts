import { prisma } from "@/prisma";

export async function GET() {
  const now = Date.now();
  const funds =
    (await prisma.fund.findMany({
      where: {
        start_time: {
          lte: now,
        },
      },
    })) ?? [];
  return Response.json(
    funds?.filter((fund) => fund.start_time + fund.invest_duration >= now)
  );
}
