import ListBox from "../UI/ListBox";
import { useSearchParams } from "react-router-dom";

const sortTypes = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
];

export default function SortType() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortType = searchParams.get("type") || "asc";

  const selectedSortType =
    sortTypes.find((t) => t.value === sortType) ?? sortTypes[0];

  const handleSortTypeChange = (selected) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("type", selected.value);
    setSearchParams(newParams);
  };

  return (
    <ListBox
      types={sortTypes}
      title="Sort Type"
      value={selectedSortType}
      onChange={handleSortTypeChange}
    />
  );
}
