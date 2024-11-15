import { prisma } from "@/prisma";
export const dynamic = "force-dynamic";

export async function GET() {
  const funds =
    (await prisma.fund.findMany({
      include: {
        fund_history: true,
        trader_operation: true,
      },
    })) ?? [];
  console.log(funds, "All!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  return Response.json(funds);
}
