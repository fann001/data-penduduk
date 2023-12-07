const InvariantError = require('../../exceptions/InvariantError');
const { DatpenPayloadSchema } = require('./schema');

const DatpenValidator = {
  validateDatpenPayload: (payload) => {
    const validationResult = DatpenPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = DatpenValidator;
