const BUNTING_BASE = ["#8993A6", "#E8C15F", "#A9C6B5", "#D9713C"];
const BUNTING_COLORS = Array.from(
  { length: 100 },
  (_, i) => BUNTING_BASE[i % BUNTING_BASE.length]
);

export default function Bunting() {
  return (
    <div className="flex flex-nowrap overflow-hidden justify-center">
      {BUNTING_COLORS.map((color, i) => (
        <div
          key={i}
          className="shrink-0 w-[34px] h-[58px] mx-[3px] rounded-b-[17px]"
          style={{ background: color }}
        />
      ))}
    </div>
  );
}
