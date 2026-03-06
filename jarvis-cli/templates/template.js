/**
 * template.js
 * Author: Gregorovichz Carlos Rossi
 * Fecha Creación: 05-03-2026
 * ----------------------------------------------------
 * Utilidad para procesar templates.
 *
 * Permite reemplazar variables dinámicas dentro
 * de archivos de plantilla.
 *
 * Ejemplo:
 *  template: "Hello {{name}}"
 *  variables: { name: "Jarvis" }
 *
 *  resultado: "Hello Jarvis"
 */

const fs = require("fs")

function renderTemplate(template, variables) {
  let result = template

  for (const key in variables) {
    const regex = new RegExp(`{{${key}}}`, "g")
    result = result.replace(regex, variables[key])
  }

  return result
}

module.exports = renderTemplate