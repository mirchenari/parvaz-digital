export default function Spinner({ isMain }) {
  return (
    <div
      className={`${
        isMain ? "fixed" : "absolute"
      } inset-0 flex items-center justify-center z-50 bg-black/40`}
    >
      <span className="loader"></span>
    </div>
  );
}
