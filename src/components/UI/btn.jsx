export function Btn({ children, onClick, color }) {
  let className;
  if (color === "red") {
    className = `bg-red-500 border-red-500 border-2 py-2.5 px-4 rounded-lg text-white hover:text-red-500 hover:bg-transparent`;
  } else {
    className =
      "bg-[#223C78] border-[#223C78] border-2 py-2.5 px-4 rounded-lg text-white hover:text-[#223C78] hover:bg-transparent";
  }
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
