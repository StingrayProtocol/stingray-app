import { prisma } from "@/prisma";

export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  const url = new URL(req.url);
  const owner = url.searchParams.get("owner");
  if (!owner) {
    return Response.error();
  }
  console.log(owner);
  const funds =
    (await prisma.trader_card.findFirst({
      where: {
        owner_address: owner,
      },
    })) ?? null;
  return Response.json(funds);
}
