const joi = require("joi");

module.exports = joi.object().keys({
	nss: joi
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
	genero: joi
		.string()
		.valid(
			"MALE",
			"FEMALE"
		)
		.required(),
	observaciones: joi
		.string()
		.trim()
		.max(255)
		.required(),
	fecha_afiliacion: joi
		.date()
		.required(),
	foto: joi
		.string()
		.trim()
		.max(255)
		.required(),
	acta_nacimiento: joi
		.string()
		.trim()
		.max(255)
		.required(),
	correo: joi
		.string()
		.trim()
		.email()
		.max(64)
		.required(),
	semanas_cotizadas: joi
		.number()
		.integer()
		.required(),
	numero: joi
		.number()
		.required(),
	direccioncorreoId: joi
		.string()
		.trim()
		.token()
		.required(),
	domicilioId: joi
		.string()
		.trim()
		.token()
		.required(),
});
