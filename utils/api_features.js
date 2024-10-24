class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  sort() {
    if (this.queryString.sort) {
      const sortedBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortedBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search(modelName) {
    if (this.queryString.search) {
      const searchTerm = this.queryString.search;
      let searchQuery;
      if (modelName === "Product") {
        searchQuery = {
          $or: [
            { title: { $regex: searchTerm, $options: "i" } },
            { description: { $regex: searchTerm, $options: "i" } },
          ],
        };
      } else {
        searchQuery = {
          $or: [{ name: { $regex: searchTerm, $options: "i" } }],
        };
      }
      this.mongooseQuery = this.mongooseQuery.find(searchQuery);
    }
    return this;
  }

  filter() {
    // Prepare filtering
    const productsQuery = { ...this.queryString };
    const excludsFields = ["sort", "limit", "page", "fields", "search"];
    excludsFields.forEach((item) => delete productsQuery[item]);

    // Add $ to request when (gte|gt|lte|lt)
    let queryString = JSON.stringify(productsQuery);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryString));
    return this;
  }

  pagination(countDocuments) {
    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 7;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    const pagination = {};
    pagination.totalNumber = countDocuments;
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocuments / limit);

    if (endIndex < countDocuments) {
      pagination.next = page + 1;
    }
    if (skip > 0) {
      pagination.perv = page - 1;
    }
    this.pagination = pagination;
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    return this;
  }
}

module.exports = ApiFeatures;
