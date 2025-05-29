class QueryOptions {
  constructor(query, searchParams) {
    this.query = query;
    this.searchParams = searchParams;
  }

  sort() {
    if (this.searchParams.sort) {
      const sortBy = this.searchParams.sort.split(",").joing(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt"); // Descending order by default
    }
    return this;
  }

  paginate() {
    const page = Number(this.searchParams.page) || 1;
    const limit = Number(this.searchParams.limit) || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export default QueryOptions;
