const joi = require("joi");

module.exports = joi.object().keys({
	calle: joi
		.string()
		.trim()
		.max(64)
		.required(),
	numero: joi
		.string()
		.trim()
		.max(64)
		.required(),
});
