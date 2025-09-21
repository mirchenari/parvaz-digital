import promiseClient from "@/lib/mongodb";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const client = await promiseClient;
    const db = client.db("ParvazDigital");
    const body = await req.json();

    const userExist = await db
      .collection("users")
      .findOne({ email: body.email });

    if (userExist) {
      return new Response(
        JSON.stringify({ message: "کاربر از قبل وحود دارد." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const hashPass = await bcrypt.hash(body.password, 10);

    const user = {
      email: body.email,
      fName: body.fName,
      lName: body.lName,
      address: body.address,
      post: body.post,
      password: hashPass,
    };

    const postResult = await db.collection("users").insertOne(user);

    return new Response(
      JSON.stringify({ ...body, id: postResult.insertedId }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
