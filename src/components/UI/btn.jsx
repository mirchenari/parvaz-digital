export function Btn({ children, onClick }) {
  return (
    <button className="bg-[#223C78] border-[#223C78] border-2 py-2.5 px-4 rounded-lg text-white hover:text-[#223C78] hover:bg-white" onClick={onClick}>
      {children}
    </button>
  );
}
