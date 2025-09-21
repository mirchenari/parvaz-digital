import promiseClient from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const client = await promiseClient;
    const db = client.db("ParvazDigital");
    const body = await req.json();

    const categoryExist = await db
      .collection("categories")
      .findOne({ title: body.category });

    if (!categoryExist) {
      return Response.json(
        { message: "این دسته بندی وجود ندارد." },
        { status: 400 }
      );
    }

    const proExsist = await db
      .collection("products")
      .findOne({ title: body.title });

    if (proExsist) {
      return Response.json(
        { message: "محصول از قبل وجود دارد." },
        { status: 400 }
      );
    }

    const editCategory = await db.collection("categories").updateOne(
      { _id: categoryExist._id },
      {
        $inc: {
          productsNum: 1,
        },
      }
    );

    const postResult = await db.collection("products").insertOne({
      ...body.product,
      categoryId: categoryExist._id,
    });

    return Response.json([postResult, editCategory], { status: 201 });
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

    const productExist = await db
      .collection("products")
      .findOne({ _id: objectedId });

    if (!productExist) {
      return Response.json(
        { message: "این محصول وجود ندارد." },
        { status: 400 }
      );
    }

    const editCatResult = await db
      .collection("categories")
      .updateOne(
        { _id: productExist.categoryId },
        { $inc: { productsNum: -1 } }
      );

    const delResult = await db
      .collection("products")
      .deleteOne({ _id: objectedId });

    return Response.json({ editCatResult, delResult });
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

    const putResult = await db
      .collection("products")
      .updateOne({ _id: objectedId }, { $set: { ...body.product } });

    return Response.json(putResult);
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
