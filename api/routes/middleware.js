const myError = require('../utils/error');

const responseHandler = (req, res, next) => {
  if (!req.error) {
    res.json({
      state: 'ok',
      msg: '',
      data: req.data,
    });
  } else if (req.error) {
    const err = req.error;
    if (err instanceof myError.RequestError) {
      res.json({
        state: err.name,
        msg: err.message,
      });
    } else {
      res.json({
        name: err.name || 'InternalServerError',
        message: err.message || 'Something went wrong!',
      });
    }
  } else {
    next();
  }
};

module.exports = { responseHandler };
