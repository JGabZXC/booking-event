export const capitalizeFullName = (name) =>
  name
    .trim()
    .split(/\s+/)
    .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
    .join(" ");
