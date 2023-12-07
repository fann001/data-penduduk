const Joi = require('joi');

const DatpenPayloadSchema = Joi.object({
  name: Joi.string().required(),
  region: Joi.string().required(),
  rt: Joi.number().integer().required(),
  rw: Joi.number().integer().required(),
  call: Joi.string().allow('').optional(),
  'content-type': Joi.string().valid(
    'image/apng',
    'image/avif',
    'image/jpeg',
    'image/gif',
    'image/png',
    'image/webp',
  ).required(),
}).unknown();

module.exports = { DatpenPayloadSchema };
