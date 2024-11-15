import { prisma } from "@/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const objectId = url.searchParams.get("objectId");
  if (!objectId) {
    return Response.error();
  }
  console.log(objectId);
  const funds =
    (await prisma.trader_card.findFirst({
      where: {
        object_id: objectId,
      },
    })) ?? null;
  return Response.json(funds);
}
