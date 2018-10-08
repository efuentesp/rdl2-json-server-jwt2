const joi = require("joi");

module.exports = joi.object().keys({
	firstname: joi
		.string()
		.trim()
		.max(64)
		.required(),
	lastname: joi
		.string()
		.trim()
		.max(64)
		.required(),
	email: joi
		.string()
		.trim()
		.email()
		.max(64)
		.optional(),
	homephone: joi
		.string()
		.trim()
		.max(64)
		.optional(),
	cellphone: joi
		.string()
		.trim()
		.max(64)
		.optional(),
	description: joi
		.string()
		.trim()
		.max(255)
		.optional(),
});
