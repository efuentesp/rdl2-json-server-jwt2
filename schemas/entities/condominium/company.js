const joi = require("joi");

module.exports = joi.object().keys({
	name: joi
		.string()
		.trim()
		.max(64)
		.required(),
	address: joi
		.string()
		.trim()
		.max(64)
		.required(),
	city: joi
		.string()
		.trim()
		.max(64)
		.required(),
	postalcode: joi
		.string()
		.trim()
		.max(64)
		.required(),
	country: joi
		.string()
		.trim()
		.max(64)
		.required(),
	state: joi
		.string()
		.trim()
		.max(64)
		.required(),
	logo: joi
		.string()
		.trim()
		.max(64)
		.optional(),
	email: joi
		.string()
		.trim()
		.email()
		.max(64)
		.required(),
	phone1: joi
		.string()
		.trim()
		.max(64)
		.required(),
	phone2: joi
		.string()
		.trim()
		.max(64)
		.optional(),
});
