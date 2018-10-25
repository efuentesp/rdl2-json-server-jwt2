const joi = require("joi");

module.exports = joi.object().keys({
	numero: joi
		.number()
		.integer()
		.required(),
	afiliadoId: joi
		.string()
		.trim()
		.token()
		.required(),
	tipoId: joi
		.string()
		.trim()
		.token()
		.required(),
	fecha_solicitud: joi
		.date()
		.required(),
	observaciones: joi
		.string()
		.trim()
		.max(255)
		.optional(),
});
