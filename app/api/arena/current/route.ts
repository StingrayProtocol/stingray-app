import { prisma } from "@/prisma";
export const dynamic = "force-dynamic";

export async function GET() {
  const arenas = await prisma.arena.findMany();

  return Response.json(arenas);
}
