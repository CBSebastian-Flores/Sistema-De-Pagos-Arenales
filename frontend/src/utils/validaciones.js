export const reglas = {
  nombre: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,100}$/,
  apellidos: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,100}$/,
  dni: /^\d{8}$/,
  correo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  contrasena: /^.{8,}$/,
  confirmarContrasena: /^.{8,}$/,
  fechaNacimiento: /^\d{4}-\d{2}-\d{2}$/,
<<<<<<< HEAD
  genero: /^(Masculino|Femenino|Otro)$/,
  nroPuesto: /^\d+$/,
  telefono: /^\d{9}$/,
=======
  genero:          /^(Masculino|Femenino|Otro)$/, 
  nroPuesto:       /^\d+$/,
  telefono:        /^\d{9}$/,
>>>>>>> 03a6ead3f1b3b740a9c59a93467fa4de8d3eefb3
}

const mensajes = {
  nombre: "Solo letras y espacios, mínimo 2 caracteres",
  apellidos: "Solo letras y espacios, mínimo 2 caracteres",
  dni: "El DNI debe tener exactamente 8 dígitos numéricos",
  correo: "Ingresa un correo válido",
  contrasena: "La contraseña debe tener al menos 8 caracteres",
  confirmarContrasena: "La contraseña debe tener al menos 8 caracteres",
  fechaNacimiento: "Debes ser mayor de 18 años para registrarte",
  genero: "Selecciona un género",
  nroPuesto: "Ingresa un número de puesto válido",
  telefono: "El teléfono debe tener exactamente 9 dígitos",
}

// Campos que no se validan aquí (tienen lógica propia en el formulario)
const camposExcluidos = ['confirmarContrasena', 'correo', 'fechaNacimiento']

export function validarCampo(nombre, valor) {
<<<<<<< HEAD
  // 1. Validación específica para el Correo (Opcional)
  if (nombre === 'correo') {
    if (!valor || !valor.trim()) return null
    return reglas.correo.test(valor) ? null : mensajes.correo
=======
  if (nombre === 'confirmarContrasena') return null
  if (nombre === 'correo' && (!valor || !valor.trim())) return null
  if (!valor || !valor.trim()) return "Este campo es obligatorio"

  if (!reglas[nombre]?.test(valor)) {
    const mensajes = {
      nombre:          "Solo letras y espacios, mínimo 2 caracteres",
      apellidos:       "Solo letras y espacios, mínimo 2 caracteres",
      dni:             "El DNI debe tener exactamente 8 dígitos",
      correo:          "Ingresa un correo válido",
      contrasena:      "La contraseña debe tener al menos 8 caracteres",
      fechaNacimiento: "Ingresa una fecha válida",
      genero:          "Selecciona un género",
      nroPuesto:       "Ingresa un número de puesto válido",
      telefono:        "El teléfono debe tener exactamente 9 dígitos", // 👈 Mensaje corregido
    }
    return mensajes[nombre] ?? "Valor inválido"
>>>>>>> 03a6ead3f1b3b740a9c59a93467fa4de8d3eefb3
  }

  // 2. Validación específica para la Fecha de Nacimiento (Mayoría de edad estricta)
  if (nombre === 'fechaNacimiento') {
    if (!valor || !valor.trim()) return "La fecha de nacimiento es obligatoria"
    if (!reglas.fechaNacimiento.test(valor)) return "Ingresa una fecha válida"

    // Cálculo de mayoría de edad dinámico (Año actual - 18)
    const fechaSeleccionada = new Date(valor)
    const hoy = new Date()
    const fechaLimite = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate())

    if (fechaSeleccionada > fechaLimite) return mensajes.fechaNacimiento
    return null
  }

  // 3. Validación general para campos obligatorios estándar
  if (!valor || !valor.trim()) return "Este campo es obligatorio"
  if (!reglas[nombre]?.test(valor)) return mensajes[nombre] ?? "Valor inválido"
  return null
}

export function validarFormulario(campos) {
  const errores = {}
  for (const [nombre, valor] of Object.entries(campos)) {
    if (camposExcluidos.includes(nombre)) continue
    const error = validarCampo(nombre, valor)
    if (error) errores[nombre] = error
  }

  // Validar manualmente los campos excluidos para asegurar consistencia
  const errorFecha = validarCampo('fechaNacimiento', campos.fechaNacimiento)
  if (errorFecha) errores.fechaNacimiento = errorFecha

  const errorCorreo = validarCampo('correo', campos.correo)
  if (errorCorreo) errores.correo = errorCorreo

  if (!campos.confirmarContrasena) {
    errores.confirmarContrasena = 'Confirma tu contraseña'
  } else if (campos.contrasena !== campos.confirmarContrasena) {
    errores.confirmarContrasena = 'Las contraseñas no coinciden'
  }

  return errores
}