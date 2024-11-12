import { prisma } from "@/prisma";

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
        owner_address:
          "0x00e3c7c9137dd016571befcb51475e96ca38e25cbea0daf06a63c4f37ede0e6c",
      },
    })) ?? null;
  return Response.json(funds);
}
