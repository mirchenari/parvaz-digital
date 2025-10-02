import buildUrl from "@/functions/buildUrl";
import Link from "next/link";

export default function ProductPreview({ product, isCategory }) {
  return (
    <div
      className={`min-w-[270px] sm:max-w-[200px] flex flex-col items-center gap-3 px-10 py-5 ${
        isCategory ? "personal-shadow rounded-2xl" : "border-l-2 border-l-gray-200"
      }`}
    >
      <Link
        href={`/product/${buildUrl(product.title)}?product=${product._id}`}
        className="w-full h-full"
        target="_blank"
      >
        <div className="flex justify-center items-center">
          <img src={product.currentImage} alt={product.title} width="186px" />
        </div>
        <div className="max-w-[100%]">
          <h4 className="line-clamp-3 sm:line-clamp-2 text-justify">
            {product.title}
          </h4>
        </div>
        <div className="flex gap-1 self-end mt-2.5">
          <p className="font-bold">
            {Number(product.price).toLocaleString("fa-IR") + "تومان"}
          </p>
        </div>
      </Link>
    </div>
  );
}
