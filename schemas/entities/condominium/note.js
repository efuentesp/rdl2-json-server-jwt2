const joi = require("joi");

module.exports = joi.object().keys({
	note: joi
		.string()
		.trim()
		.max(255)
		.required(),
});
