const joi = require("joi");

module.exports = joi.object().keys({
	status: joi
		.string()
		.valid(
			"ACTIVE",
			"DRAFT"
		)
		.required(),
	expirationdate: joi
		.date()
		.timestamp(),
		.required(),
	title: joi
		.string()
		.trim()
		.max(64)
		.required(),
	body: joi
		.string()
		.trim()
		.max(255)
		.required(),
	attachment: joi
		.string()
		.trim()
		.max(255)
		.optional(),
});
