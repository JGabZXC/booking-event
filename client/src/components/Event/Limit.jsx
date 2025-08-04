import ListBox from "../UI/ListBox";
import { useSearchParams } from "react-router-dom";

const limitTypes = [
  { value: "10", label: "10" },
  { value: "20", label: "20" },
  { value: "30", label: "30" },
  { value: "40", label: "40" },
  { value: "50", label: "50" },
];

export default function Limit() {
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
