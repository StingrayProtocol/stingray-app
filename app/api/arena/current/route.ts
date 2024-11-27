import { prisma } from "@/prisma";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const arenas = await prisma.arena.findMany();

  return Response.json(arenas);
}
