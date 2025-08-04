import ListBox from "../UI/ListBox";
import { useSearchParams } from "react-router-dom";

const genreTypes = [
  { value: "all", label: "All Types" },
  { value: "concert", label: "Concert" },
  { value: "theater", label: "Theater" },
  { value: "sports", label: "Sports" },
  { value: "exhibition", label: "Exhibition" },
  { value: "festival", label: "Festival" },
  { value: "other", label: "Other" },
];

export default function Genre() {
  const [searchParams, setSearchParams] = useSearchParams();
  const genre = searchParams.get("genre") || "all";

  const selectedGenre =
    genreTypes.find((t) => t.value === genre) ?? genreTypes[0];

  const handleSortTypeChange = (selected) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("genre", selected.value);
    setSearchParams(newParams);
  };

  return (
    <ListBox
      types={genreTypes}
      title="Genre"
      value={selectedGenre}
      onChange={handleSortTypeChange}
    />
  );
}
