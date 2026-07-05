module.exports = {
  paginate: ({ page = 1, limit = 20 }) => {
    const p = Math.max(1, parseInt(page));
    const l = Math.min(100, Math.max(1, parseInt(limit)));
    return { offset: (p - 1) * l, limit: l, page: p };
  },

  toResponse: (data, meta) => {
    const res = { success: true, data };
    if (meta) res.meta = meta;
    return res;
  },

  toError: (message) => ({ success: false, error: message }),
};
