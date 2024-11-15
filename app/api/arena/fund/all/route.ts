import { prisma } from "@/prisma";

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
  console.log(
    funds,
    "arena fund!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  );

  return Response.json(funds);
}
