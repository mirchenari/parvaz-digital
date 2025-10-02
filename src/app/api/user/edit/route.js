import promiseClient from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(req) {
  try {
    const client = await promiseClient;
    const db = client.db("ParvazDigital");
    const body = await req.json();
    const { id, ...editObject } = body;
    const objectedId = new ObjectId(id);

    const userExist = await db.collection("users").findOne({ _id: objectedId });
    if (!userExist) {
      return Response.json({ message: "کاربر وجود ندارد." }, { status: 400 });
    }

    const putResult = await db
      .collection("users")
      .updateOne({ _id: objectedId }, { $set: editObject });

    const newUserDb = await db.collection("users").findOne({ _id: objectedId });
    const newUser = {
      id: newUserDb._id,
      email: newUserDb.email,
      fName: newUserDb.fName,
      lName: newUserDb.lName,
      address: newUserDb.address,
      post: newUserDb.post,
      role: newUserDb.role || "user",
      activeOrder: newUserDb.activeOrder,
    };

    return Response.json({ putResult: putResult, user: newUser });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
