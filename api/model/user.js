const Joi = require('joi');
const util = require('../utils/utils');
const model = require('./model');

class UserService extends model.Model {
  constructor() {
    super({
      tableName: 'users',
      columns: {
        name: 'TEXT NOT NULL',
        email: 'TEXT UNIQUE',
        phone: 'TEXT UNIQUE',
      },
      insertValidator: Joi.object({
        name: Joi.string().min(1).max(64).required(),
        email: Joi.string().email().required(),
        phone: Joi.string().pattern(util.joiPhonePattern).required(),
      }),
      updateValidator: Joi.object({
        name: Joi.string().min(1).max(64),
        email: Joi.string().email(),
        phone: Joi.string().pattern(util.joiPhonePattern),
      })
        .min(1)
        .messages({
          'object.min': `update operation nedd at least one field name or email or phone`,
        }),
    });
  }
}

module.exports = new UserService();
