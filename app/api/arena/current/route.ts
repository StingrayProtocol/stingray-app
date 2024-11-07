import { prisma } from "@/prisma";

export async function GET() {
  const [weekArena, monthArena] = await Promise.all([
    await prisma.arena.findFirst({
      where: {
        period_type: "WEEK",
      },
      orderBy: {
        timestamp: "desc",
      },
    }),
    await prisma.arena.findFirst({
      where: {
        period_type: "MONTH",
      },
      orderBy: {
        timestamp: "desc",
      },
    }),
  ]);

  return Response.json({
    arena: {
      week: weekArena,
      month: monthArena,
    },
  });
}
