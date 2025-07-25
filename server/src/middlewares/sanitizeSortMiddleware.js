export default (req, res, next) => {
  const allowedFields = ["name", "role", "email", "-name", "-role", "-email"];

  if (req.query.sort) {
    const values = req.query.sort.split(",");
    req.query.sort = values
      .filter((field) => allowedFields.includes(field))
      .join(",");
  }

  next();
};
