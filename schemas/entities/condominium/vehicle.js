const joi = require("joi");

module.exports = joi.object().keys({
	unitId: joi
		.string()
		.trim()
		.token()
		.required(),
	licenseplate: joi
		.string()
		.trim()
		.max(64)
		.required(),
	year: joi
		.number()
		.integer()
		.required(),
	make: joi
		.string()
		.trim()
		.max(64)
		.required(),
	model: joi
		.string()
		.trim()
		.max(64)
		.required(),
	color: joi
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
