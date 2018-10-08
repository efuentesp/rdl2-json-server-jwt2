const joi = require("joi");

module.exports = joi.object().keys({
	unitId: joi
		.string()
		.trim()
		.token()
		.optional(),
	floor: joi
		.number()
		.integer()
		.required(),
	spot: joi
		.string()
		.trim()
		.max(64)
		.required(),
	description: joi
		.string()
		.trim()
		.max(255)
		.optional(),
});
