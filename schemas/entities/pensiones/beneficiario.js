const joi = require("joi");

module.exports = joi.object().keys({
	curp: joi
		.string()
		.trim()
		.max(64)
		.required(),
	nombre: joi
		.string()
		.trim()
		.max(64)
		.required(),
	apellido_paterno: joi
		.string()
		.trim()
		.max(64)
		.required(),
	apellido_materno: joi
		.string()
		.trim()
		.max(64)
		.required(),
	fecha_nacimiento: joi
		.date()
		.required(),
	parentesco: joi
		.string()
		.valid(
			"CONYUGE",
			"HIJO",
			"ASCENDIENTE"
		)
		.required(),
	afiliadoId: joi
		.string()
		.trim()
		.token()
		.required(),
});
