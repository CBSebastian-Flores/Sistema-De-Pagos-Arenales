export const reglas = {
  nombre:          /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,100}$/,
  apellidos:       /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,100}$/,
  dni:             /^\d{8}$/,
  correo:          /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  contrasena:      /^.{8,}$/,
  fechaNacimiento: /^\d{4}-\d{2}-\d{2}$/,
  genero:          /^(Masculino|Femenino)$/,
  nroPuesto:       /^\d+$/,
}

export function validarCampo(nombre, valor) {
  if (!valor.trim()) return "Este campo es obligatorio"
  if (!reglas[nombre]?.test(valor)) {
    const mensajes = {
      nombre:          "Solo letras y espacios, mínimo 2 caracteres",
      apellidos:       "Solo letras y espacios, mínimo 2 caracteres",
      dni:             "El DNI debe tener exactamente 8 dígitos numéricos",
      correo:          "Ingresa un correo válido",
      contrasena:      "La contraseña debe tener al menos 8 caracteres",
      fechaNacimiento: "Ingresa una fecha válida",
      genero:          "Selecciona un género",
      nroPuesto:       "Ingresa un número de puesto válido",
    }
    return mensajes[nombre] ?? "Valor inválido"
  }
  return null
}

export function validarFormulario(campos) {
  const errores = {}
  for (const [nombre, valor] of Object.entries(campos)) {
    const error = validarCampo(nombre, valor)
    if (error) errores[nombre] = error
  }
  return errores
}