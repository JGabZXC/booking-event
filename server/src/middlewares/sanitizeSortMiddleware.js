export default (req, res, next) => {
  const allowedFields = ["name", "role", "email", "-name", "-role", "-email"];
  if (req.query.sort) {
    const values = req.query.sort.split(",");

    const sanitized = values
      .filter((field) => allowedFields.includes(field))
      .join(" ");

    Object.defineProperty(req, "query", {
      ...Object.getOwnPropertyDescriptor(req, "query"),
      value: { ...req.query, sort: sanitized },
      writable: true,
    });
  }

  next();
};
