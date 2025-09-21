import promiseClient from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const client = await promiseClient;
    const db = client.db("ParvazDigital");
    const body = await req.json();
    const { updateId, ...order } = body;
    const objectedId = new ObjectId(body.userId);

    const userExist = await db.collection("users").findOne({ _id: objectedId });

    if (!userExist) {
      return Response.json({ message: "کاربر وجود ندارد." }, { status: 400 });
    }

    if (!updateId) {
      const postResult = await db
        .collection("orders")
        .insertOne({ ...order, createdAt: new Date() });

      await db
        .collection("users")
        .updateOne(
          { _id: objectedId },
          { $set: { activeOrder: postResult.insertedId } }
        );

      return Response.json(postResult, { status: 201 });
    }

    const updateIdObjected = new ObjectId(updateId);

    const postResult = await db
      .collection("orders")
      .replaceOne(
        { _id: updateIdObjected },
        { ...order, editedAt: new Date() }
      );

    return Response.json({ insertedId: updateId });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
