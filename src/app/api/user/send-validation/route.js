import { Resend } from "resend";
import promiseClient from "@/lib/mongodb";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const client = await promiseClient;
    const db = client.db("ParvazDigital");
    const body = await req.json();

    const userExist = await db
      .collection("users")
      .findOne({ email: body.email });

    if (userExist) {
      return new Response(JSON.stringify({ isDone: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const captchExist = await db
      .collection("captcha")
      .find({ email: body.email, expiresAt: { $gt: new Date() } })
      .toArray();

    if (captchExist.length == 1) {
      return new Response(JSON.stringify({ isDone: true }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const captchaNumber = String(
      Math.floor(Math.random() * 1_000_000)
    ).padStart(6, "0");

    const sendData = await resend.emails.send({
      from: "ParvazDigital <onboarding@resend.dev>",
      to: body.email,
      subject: "ایمیل خود را تایید کنید.",
      html: `<h1> ${captchaNumber} </h1> <p>این کد را به هیچ کس ندهید!</p>`,
    });

    await db.collection("captcha").insertOne({
      email: body.email,
      captcha: captchaNumber,
      expiresAt: new Date(Date.now() + 30000),
    });

    return new Response(JSON.stringify({ data: sendData }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
