import ListBox from "./ListBox";
import { useSearchParams } from "react-router-dom";

export default function Genre({ genreTypes }) {
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
