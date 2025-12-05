import Link from "next/link";
import AddToCart from "@/components/client/addToCart";
import Comment from "@/components/client/comment";
import { notFound } from "next/navigation";
import buildUrl from "@/functions/buildUrl";

export async function generateMetadata({ searchParams }) {
  const productId = searchParams.product;
  try {
    const res = await fetch(
      `${process.env.PUBLIC_BASE_URL}/api/get-data/products/${productId}`
    );
    const product = await res.json();
    if (!res.ok) {
      throw new Error(product.message);
    }
    return {
      title: `${product.title} | پرواز دیجیتال`,
      description: product.description.slice(0, 150),
      openGraph: {
        title: `${product.title} | پرواز دیجیتال`,
        description: product.description.slice(0, 150),
        images: [
          {
            url: product.currentImage,
            width: 1200,
            height: 630,
            alt: product.title,
          },
        ],
        type: "article",
        siteName: "پرواز دیجیتال",
      },
    };
  } catch (err) {
    return {
      title: "محصول یافت نشد | پرواز دیجیتال",
      description: "این محصول در فروشگاه پرواز دیجیتال موجود نیست.",
    };
  }
}

export default async function ProductDetails({ searchParams }) {
  const productId = searchParams.product;
  let product;
  let category;
  let error;

  try {
    const res = await fetch(
      `${process.env.PUBLIC_BASE_URL}/api/get-data/products/${productId}`
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message);
    }
    product = data;
  } catch (err) {
    console.error(err);
    error = { isErr: true, mess: err.message };
  }

  if (product) {
    try {
      const res = await fetch(
        `${process.env.PUBLIC_BASE_URL}/api/get-data/categories/${product.categoryId}`
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      category = data;
    } catch (err) {
      console.error(err);
      error = { isErr: true, mess: err.message };
    }

    return (
      <>
        <section className="px-10 py-2.5 hidden sm:block">
          <div className="flex gap-2.5 text-sm text-blue-400">
            <Link href="/">فروشگاه پرواز دیجیتال</Link>
            <span> / </span>
            <Link
              href={`/category/${buildUrl(category.title)}?category=${
                category._id
              }`}
              target="_blank"
            >
              {category.title}
            </Link>
            <span> / </span>
            <p className="text-black">{product.title}</p>
          </div>
        </section>
        <section className="px-5 sm:px-10 mb-5 mt-5 sm:mt-0 sm:grid grid-cols-3 gap-5">
          <div className="col-span-2 border border-gray-200 rounded-2xl p-2.5 sm:p-8">
            <div className="flex flex-col-reverse sm:grid grid-cols-3 gap-2.5 items-center mb-8">
              <div className="col-span-2 flex flex-col gap-5">
                <h1 className="font-bold text-xl">{product.title}</h1>
                <p className="text-justify">{product.description}</p>
              </div>
              <div>
                <img src={product.currentImage} alt={product.title} />
              </div>
            </div>
            <div>
              <div className="bg-gray-200 p-3 border-b-2 border-b-gray-500">
                <div className="font-bold">
                  <h4>نظرات کاربران</h4>
                </div>
              </div>
              <Comment product={product} />
            </div>
          </div>
          <div className="fixed bottom-0 right-0 left-0 h-[135px] sm:h-auto sm:static z-20">
            <AddToCart product={product} />
          </div>
        </section>
      </>
    );
  } else {
    notFound();
  }
}
