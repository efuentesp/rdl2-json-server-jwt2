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
	picture: joi
		.string()
		.trim()
		.max(255)
		.optional(),
	yearbuilt: joi
		.number()
		.integer()
		.optional(),
	description: joi
		.string()
		.trim()
		.max(255)
		.optional(),
});
