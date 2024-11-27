import { prisma } from "@/prisma";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const funds =
    (await prisma.fund.findMany({
      include: {
        fund_history: true,
        trader_operation: true,
      },
    })) ?? [];
  return Response.json(funds);
}
