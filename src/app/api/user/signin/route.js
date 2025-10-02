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

    if (!userExist) {
      return new Response(
        JSON.stringify({ message: "ایمیل وارد شده استباه است." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const isValid = await bcrypt.compare(body.password, userExist.password);

    if (!isValid) {
      return new Response(JSON.stringify({ message: "رمز عبور اشتباه است" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        id: userExist._id,
        email: userExist.email,
        fName: userExist.fName,
        lName: userExist.lName,
        address: userExist.address,
        post: userExist.post,
        role: userExist.role || "user",
        activeOrder: userExist.activeOrder,
      }),
      {
        status: 200,
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
