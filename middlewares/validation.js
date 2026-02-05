const { Joi, celebrate } = require("celebrate");
const validator = require("validator");
const clothingValidation = () => {
  celebrate({
    body: Joi.object().keys({
      name: Joi.string()
        .required()
        .custom(validateURL)
        .min(2)
        .max(30)
        .messages({
          "string.min": 'The minimum length of the "name" field is 2',
          "string.max": 'The minimum length of the "name" field is 30',
          "string.empty": 'The "name" field must be filled in',
        }),
      imageUrl: Joi.string().required().custom(validateURL).messages({
        "string.empty": 'The "imageUrl" field must be filled in',
        "string.uri": 'the "imageUrl" field must be a valid url',
      }),
    }),
  });
};

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const userValidation = () => {
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      avatar: Joi.string().required().uri(),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  });
};

const authValidation = () => {
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  });
};

const validateId = () => {
  celebrate({
    params: Joi.object().keys({
      itemId: Joi.string().required().alphanum().length(24),
      userId: Joi.string().required().alphanum().length(24),
    }),
  });
};

module.exports = {
  validateId,
  authValidation,
  userValidation,
  clothingValidation,
};
