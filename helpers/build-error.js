const buildError = (msg = '', param = '') => {
  return {
    errors: [
      {
        msg,
        param,
      },
    ],
  };
}

module.exports = { buildError };