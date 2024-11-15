import { prisma } from "@/prisma";
export const dynamic = "force-dynamic";

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
        arena: true,
      },
    })) ?? [];

  return Response.json(funds);
}
