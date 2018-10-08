const joi = require("joi");

module.exports = joi.object().keys({
	propertyId: joi
		.string()
		.trim()
		.token()
		.required(),
	floor: joi
		.number()
		.integer()
		.required(),
	unit: joi
		.string()
		.trim()
		.max(64)
		.required(),
	description: joi
		.string()
		.trim()
		.max(255)
		.optional(),
	ownerId: joi
		.string()
		.trim()
		.token()
		.required(),
	tenantId: joi
		.string()
		.trim()
		.token()
		.optional(),
});
