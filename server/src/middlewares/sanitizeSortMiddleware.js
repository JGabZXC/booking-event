import QuerySanitizer from "../sanitizers/querySanitizer.js";

export default (req, res, next) => {
  if (req.query.sort) {
    const sanitizedSort = QuerySanitizer.sanitizeSortQuery(req);

    Object.defineProperty(req, "query", {
      ...Object.getOwnPropertyDescriptor(req, "query"),
      value: { ...req.query, sort: sanitizedSort },
      writable: true,
    });
  }

  if (req.query.page) {
    const sanitzedPage = QuerySanitizer.sanitizePaginationQuery(req);

    Object.defineProperty(req, "query", {
      ...Object.getOwnPropertyDescriptor(req, "query"),
      value: { ...req.query, page: sanitzedPage },
      writable: true,
    });
  }

  if (req.query.limit) {
    const sanitizedLimit = QuerySanitizer.sanitizeLimitQuery(req);

    Object.defineProperty(req, "query", {
      ...Object.getOwnPropertyDescriptor(req, "query"),
      value: { ...req.query, limit: sanitizedLimit },
      writable: true,
    });
  }

  next();
};
