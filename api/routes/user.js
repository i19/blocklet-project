const userService = require('../model/user');
const user = require('express').Router();

user.get('/list', async (req, res, next) => {
  try {
    const { start = 0, step = 10 } = req.query;
    req.data = await userService.paging(start, step);
  } catch (error) {
    req.error = error;
  }
  next();
});

user.get('/info/:uid', async (req, res, next) => {
  try {
    req.data = await userService.getByID(req.params.uid);
  } catch (error) {
    req.error = error;
  }
  next();
});

user.post('/create', async (req, res, next) => {
  try {
    req.data = await userService.create(req.body);
  } catch (error) {
    req.error = error;
  }
  next();
});

user.post('/update/:uid', async (req, res, next) => {
  try {
    await userService.update(req.params.uid, req.body);
  } catch (error) {
    req.error = error;
  }
  next();
});

module.exports = user;
