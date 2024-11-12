import { prisma } from "@/prisma";

export async function GET() {
  const funds =
    (await prisma.fund.findMany({
      include: {
        fund_history: true,
      },
    })) ?? [];
  return Response.json(funds);
}
