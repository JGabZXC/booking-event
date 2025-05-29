export const capitalizedFirstLetter = (name) =>
  name
    .split(" ")
    .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
    .join(" ");
