export default function ProductPreview({ product }) {
  return (
    <div className="min-w-[20%] flex flex-col items-center gap-3 px-10 py-5 border-l-2 border-l-gray-200">
      <div>
        <img src={product.currentImage} alt={product.title} width="186px" />
      </div>
      <div className="max-w-[100%]">
        <h4 className="line-clamp-2 text-justify max-w-[100%]">{product.title}</h4>
      </div>
      <div className="flex gap-1 self-end mt-2.5">
          <p className="font-bold">{product.price}</p> <span>تومان</span>
      </div>
    </div>
  );
}
