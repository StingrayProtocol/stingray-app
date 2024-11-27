import { prisma } from "@/prisma";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const funds =
    (await prisma.fund.findMany({
      where: {
        arena_object_id: {
          not: null,
        },
      },
      include: {
        fund_history: true,
        trader_operation: true,
        arena: true,
        owner: true,
      },
    })) ?? [];

  return Response.json(funds);
}
