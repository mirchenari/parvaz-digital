import promiseClient from "@/lib/mongodb";

export async function POST(req) {
  try {
    const client = await promiseClient;
    const db = client.db("ParvazDigital");

    const body = await req.json();

    const captchaExist = await db
      .collection("captcha")
      .find({ email: body.email, expiresAt: { $gt: new Date() } })
      .toArray();

    if (captchaExist.length == 0) {
      return new Response(
        JSON.stringify({ message: "کد شما منقضی شده؛ لطفا دوباره تلاش کنید." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    if (body.captcha !== captchaExist[0].captcha) {
      return new Response(
        JSON.stringify({ message: "کد وارد شده اشتباه است." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const userExist = await db
      .collection("users")
      .find({ email: body.email })
      .toArray();

    if (userExist.length == 0) {
      return new Response(
        JSON.stringify({ email: body.email, isSigned: false }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ user: userExist[0], isSigned: true }),
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
