import ListBox from "./ListBox";

export default function CustomListBox({
  types,
  title,
  value,
  handleTypesChange,
}) {
  const selectedType = types.find((t) => t.value === value) ?? types[0];
  return (
    <ListBox
      types={types}
      title={title}
      value={selectedType}
      onChange={handleTypesChange}
    />
  );
}
