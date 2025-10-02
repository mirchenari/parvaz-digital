import ProductPreview from "@/components/server/ProductPreview";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({ searchParams }) {
  const id = searchParams.category;
  try {
    const res = await fetch(
      `${process.env.PUBLIC_BASE_URL}/api/get-data/categories/${id}`
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message);
    }
    return {
      title: `خرید انواع ${data.title} | پرواز دیجیتال`,
      description: `خرید انواع ${data.title} های روز دنیا با بهترین قیمت، ارسالی سریع و پشتیبانی مطمئن از فروشگاه تخصصی پرواز دیجیتال، مرجع خرید انواع لپ تاپ و گوشی های به روز جهان. `,
    };
  } catch (error) {
    console.error(error);
  }
}

export default async function CategoryDetails({ searchParams }) {
  const id = searchParams.category;
  let category;
  let products;

  try {
    const res = await fetch(
      `${process.env.PUBLIC_BASE_URL}/api/get-data/categories/${id}`
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message);
    }
    category = data;
  } catch (error) {
    console.error(error);
  }

  if (category) {
    try {
      const res = await fetch(
        `${process.env.PUBLIC_BASE_URL}/api/get-data/products`
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      products = data.filter((item) => item.categoryId == id);
    } catch (error) {
      console.error(error);
    }

    return (
      <>
        <section className="px-10 py-2.5 hidden sm:block">
          <div className="flex gap-2.5 text-sm text-blue-400">
            <Link href="/">فروشگاه پرواز دیجیتال</Link>
            <span> / </span>
            <p className="text-black">{category.title}</p>
          </div>
        </section>
        <section className="px-5 my-5 flex flex-col gap-10 text-center sm:grid sm:grid-cols-2 sm:justify-items-center lg:grid-cols-3 xl:grid-cols-4">
          {products.map((item) => (
            <ProductPreview key={item._id} product={item} isCategory={true} />
          ))}
        </section>
      </>
    );
  } else {
    notFound();
  }
}
