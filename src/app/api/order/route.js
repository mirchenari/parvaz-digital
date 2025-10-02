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
    const orderExist = await db
      .collection("orders")
      .findOne({ _id: updateIdObjected });

    await db
      .collection("orders")
      .replaceOne(
        { _id: updateIdObjected },
        { ...order, createdAt: orderExist.createdAt }
      );

    return Response.json({ insertedId: updateId });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const client = await promiseClient;
    const db = client.db("ParvazDigital");
    const body = await req.json();
    const userIdObjected = new ObjectId(body.userId);

    const userExist = await db
      .collection("users")
      .findOne({ _id: userIdObjected });

    if (!userExist) {
      return Response.json({ message: "کاربر وجود ندارد." }, { status: 400 });
    }

    if (!userExist.activeOrder) {
      return new Response(null, { status: 204 });
    }

    const orderIdObjected = new ObjectId(userExist.activeOrder);

    const delResult = await db
      .collection("orders")
      .deleteOne({ _id: orderIdObjected });

    const userEditResult = await db
      .collection("users")
      .updateOne({ _id: userIdObjected }, { $unset: { activeOrder: "" } });

    return Response.json({ ...delResult, ...userEditResult });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
