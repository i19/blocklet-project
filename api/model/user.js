const Joi = require('joi').extend(require('@joi/date'));
const util = require('../utils/utils');
const model = require('./model');

class UserService extends model.Model {
  constructor() {
    super({
      tableName: 'users',
      columns: {
        name: 'TEXT NOT NULL',
        birth_day: 'DATE NOT NULL',
        gender: 'TINYINT NOT NULL DEFAULT 0',
        email: 'TEXT UNIQUE',
        phone: 'TEXT UNIQUE',
        home_address: 'TEXT',
        work_address: 'TEXT',
      },
      insertValidator: Joi.object({
        name: Joi.string().min(1).max(32).required(),
        birth_day: Joi.date().less('now').format('YYYY-MM-DD').raw().required(),
        gender: Joi.number().integer().min(0).max(2).required(),
        email: Joi.string().email().required(),
        phone: Joi.string().pattern(util.joiPhonePattern).required(),
        home_address: Joi.string().allow('').optional(),
        work_address: Joi.string().allow('').optional(),
      }),
      updateValidator: Joi.object({
        name: Joi.string().min(1).max(64),
        birth_day: Joi.date().less('now').format('YYYY-MM-DD').raw(),
        gender: Joi.number().integer().min(0).max(1),
        email: Joi.string().email(),
        phone: Joi.string().pattern(util.joiPhonePattern),
        home_address: Joi.string().allow(''),
        work_address: Joi.string().allow(''),
      }),
    });
  }
}

module.exports = new UserService();
