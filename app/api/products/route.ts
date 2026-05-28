import { getProducts } from "@/lib/db/queries";

export async function GET() {
  const data = await getProducts();

  return Response.json(data);
}
