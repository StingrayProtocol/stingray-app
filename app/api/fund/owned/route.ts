import { prisma } from "@/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const owner = url.searchParams.get("owner");
  if (!owner) {
    return Response.error();
  }

  const funds =
    (await prisma.fund.findMany({
      where: {
        owner_id: owner,
      },
    })) ?? [];
  return Response.json(funds);
}
