import promiseClient from "@/lib/mongodb";

export async function GET(req, { params }) {
  try {
    const { x } = params;
    const client = await promiseClient;
    const db = client.db("ParvazDigital");

    if (x == "users") {
      return Response.json([]);
    }

    const data = await db.collection(x).find({}).toArray();
    return Response.json(data);
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
