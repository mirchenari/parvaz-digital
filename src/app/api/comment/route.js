import promiseClient from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const client = await promiseClient;
    const db = client.db("ParvazDigital");
    const body = await req.json();

    const newComment = {
      ...body,
      createdAt: new Date(),
    };

    const postResult = await db.collection("comments").insertOne(newComment);

    return Response.json(postResult, { status: 201 });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const client = await promiseClient;
    const db = client.db("ParvazDigital");
    const body = await req.json();
    const objectedId = new ObjectId(body.id);

    const commentExist = await db
      .collection("comments")
      .findOne({ _id: objectedId });

    if (!commentExist) {
      return Response.json({ message: "آیدی اشتباه است." }, { status: 400 });
    }

    const postResult = await db
      .collection("comments")
      .updateOne({ _id: objectedId }, { $set: { isConfirm: true } });

    return Response.json(postResult);
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
    try {
    const client = await promiseClient;
    const db = client.db("ParvazDigital");
    const body = await req.json();
    const objectedId = new ObjectId(body.id);

    const commentExist = await db
      .collection("comments")
      .findOne({ _id: objectedId });

    if (!commentExist) {
      return Response.json({ message: "آیدی اشتباه است." }, { status: 400 });
    }

    const delResult = await db
      .collection("comments")
      .deleteOne({ _id: objectedId });

    return Response.json(delResult);
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}