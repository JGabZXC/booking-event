import ListBox from "./ListBox";
import { useSearchParams } from "react-router-dom";

export default function Limit({ limitTypes }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const limit = searchParams.get("limit") || "10";

  const selectedLimit =
    limitTypes.find((t) => t.value === limit) ?? limitTypes[0];

  const handleLimitChange = (selected) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("limit", selected.value);
    setSearchParams(newParams);
  };

  return (
    <ListBox
      types={limitTypes}
      title="Limit"
      value={selectedLimit}
      onChange={handleLimitChange}
    />
  );
}
