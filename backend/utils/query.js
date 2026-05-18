const buildPagination = (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 50);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const paginate = async (modelQuery, countQuery, query) => {
  const { page, limit, skip } = buildPagination(query);
  const [items, total] = await Promise.all([
    modelQuery.skip(skip).limit(limit),
    countQuery,
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
    },
  };
};

module.exports = { buildPagination, paginate };
