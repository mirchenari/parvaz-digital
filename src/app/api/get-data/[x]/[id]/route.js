import promiseClient from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  try {
    const { x, id } = params;
    const client = await promiseClient;
    const db = client.db("ParvazDigital");
    const objectedId = new ObjectId(id);

    if (x == "users") {
      return Response.json([]);
    }

    const data =
      x === "comments"
        ? await db.collection(x).find({ productId: id }).toArray()
        : await db.collection(x).findOne({ _id: objectedId });

    if (!data) {
      return Response.json(
        { message: "اطلاعات خواسته شده یافت نشد" },
        { status: 400 }
      );
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
