import promiseClient from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

export async function PUT(req) {
  try {
    const client = await promiseClient;
    const db = client.db("ParvazDigital");
    const body = await req.json();
    const objectedId = new ObjectId(body.id);

    const userExist = await db.collection("users").findOne({ _id: objectedId });
    if (!userExist) {
      return Response.json({ message: "کاربر وجود ندارد." }, { status: 400 });
    }

    const isTruePass = await bcrypt.compare(
      body.currentPass,
      userExist.password
    );

    if (!isTruePass) {
      return Response.json(
        { message: "رمز عبور وارد شده اشتباه است." },
        { status: 400 }
      );
    }

    const newPassHashed = await bcrypt.hash(body.newPass, 10);

    const changeResult = await db
      .collection("users")
      .updateOne({ _id: objectedId }, { $set: { password: newPassHashed } });

    return Response.json({
      ...changeResult,
      message: "رمز عبور با موفقیت تغییر یافت.",
    });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
