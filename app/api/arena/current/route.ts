import { prisma } from "@/prisma";

export async function GET() {
  const arenas = await prisma.arena.findMany();

  return Response.json(arenas);
}
