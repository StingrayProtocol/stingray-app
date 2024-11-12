import { postWalrus } from "@/common/walrus-api";

export async function POST(req: Request) {
  const blob = await req.blob();
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const result = await postWalrus({
    type: "image/png",
    query: "epochs=5",
    content: buffer,
  });
  return Response.json(result);
}
