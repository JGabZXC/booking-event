import ListBox from "../UI/ListBox";
import { useSearchParams } from "react-router-dom";

const sortTypes = [
  { value: "all", label: "All Events" },
  { value: "date", label: "Date" },
  { value: "place", label: "Place" },
  { value: "title", label: "Title" },
  { value: "price", label: "Price" },
  { value: "status", label: "Status" },
];

export default function Sort() {
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
