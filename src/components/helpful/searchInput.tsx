import Icon from "./icon";

export default function SearchInput() {
  return (
    <div className="flex items-center justify-between gap-10 rounded-lg border border-white border-opacity-10 p-3">
      <input
        className="bg-transparent text-sm outline-none placeholder:text-sm"
        type="text"
        placeholder="Search for products..."
      />
      <Icon img="/search.svg" w={15} h={15} />
    </div>
  );
}
