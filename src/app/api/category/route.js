import promiseClient from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const client = await promiseClient;
    const db = client.db("ParvazDigital");
    const body = await req.json();

    const catExsit = await db
      .collection("categories")
      .findOne({ title: body.title });
    if (catExsit) {
      return Response.json(
        { message: "این دسته بندی وجود دارد." },
        { status: 400 }
      );
    }

    const postResult = await db
      .collection("categories")
      .insertOne({ title: body.title, productsNum: 0 });
    return Response.json(postResult, { status: 201 });
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

    const catExist = await db
      .collection("categories")
      .findOne({ _id: objectedId });

    if (!catExist) {
      return Response.json(
        { message: "این دسته بندی وجود ندارد." },
        { status: 400 }
      );
    }

    const delResult = await db
      .collection("categories")
      .deleteOne({ _id: objectedId });

    const delProductsResult = await db
      .collection("products")
      .deleteMany({ categoryId: objectedId });

    return Response.json([delResult, delProductsResult]);
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

    const catExist = await db
      .collection("categories")
      .findOne({ title: body.title });

    if (catExist) {
      return Response.json(
        { message: "این دسته بندی وجود دارد." },
        { status: 400 }
      );
    }

    const putResult = await db
      .collection("categories")
      .updateOne({ _id: objectedId }, { $set: { title: body.title } });

    return Response.json(putResult);
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
