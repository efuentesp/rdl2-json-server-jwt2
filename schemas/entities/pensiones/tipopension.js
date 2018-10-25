const joi = require("joi");

module.exports = joi.object().keys({
	clave: joi
		.string()
		.trim()
		.max(64)
		.required(),
	nombre: joi
		.string()
		.trim()
		.max(64)
		.required(),
});
