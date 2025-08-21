import ListBox from "./ListBox";
import { useSearchParams } from "react-router-dom";

export default function Sort({ sortTypes }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortType = searchParams.get("sort") || "asc";

  const selectedSortType =
    sortTypes.find((t) => t.value === sortType) ?? sortTypes[0];

  const handleSortTypeChange = (selected) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort", selected.value);
    setSearchParams(newParams);
  };
  return (
    <ListBox
      types={sortTypes}
      title="Sort"
      value={selectedSortType}
      onChange={handleSortTypeChange}
    />
  );
}
