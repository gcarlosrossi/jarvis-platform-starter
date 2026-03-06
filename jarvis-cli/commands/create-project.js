/**
 * create-project.js
 * Author: Gregorovichz Carlos Rossi
 * Fecha Creación: 05-03-2026
 * ----------------------------------------------------
 * Comando responsable de crear un nuevo proyecto base.
 *
 * Funcionalidades:
 * - Solicita información al usuario mediante CLI
 * - Genera nombre del proyecto con prefijo
 * - Crea estructura de carpetas inicial
 * - Copia template base de OpenAPI
 *
 * Ejemplo:
 *   jarvis create-project
 */

const fs = require("fs");
const path = require("path");
const { default: inquirer } = require("inquirer");

const {
  PREFIXES,
  PROJECT_FOLDERS,
  TEMPLATES
} = require("../utils/constants");

/**
 * Normaliza el nombre del proyecto.
 * Convierte espacios a guiones y elimina caracteres inválidos.
 */
function normalizeProjectName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
}

/**
 * Crea directorio si no existe
 */
function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

/**
 * Solicita información del proyecto al usuario.
 */
async function askProjectInfo() {

  return inquirer.prompt([
    {
      type: "list",
      name: "prefix",
      message: "Seleccione el tipo de microservicio:",
      choices: Object.values(PREFIXES).map((prefix) => ({
        name: prefix.name,
        value: prefix.prefix
      }))
    },
    {
      type: "input",
      name: "name",
      message: "Ingrese el nombre del proyecto:",
      validate: (input) => {

        if (!input.trim()) {
          return "Debe ingresar un nombre";
        }

        if (input.trim().length < 3) {
          return "El nombre debe tener al menos 3 caracteres";
        }

        return true;
      }
    }
  ]);

}

/**
 * Crea la estructura base del proyecto
 */
function createProjectStructure(projectPath) {

  ensureDir(projectPath);

  PROJECT_FOLDERS.forEach(folder => {
    ensureDir(path.join(projectPath, folder));
  });

  console.log("📁 Estructura base creada");
}

/**
 * Copia el template OpenAPI root al nuevo proyecto.
 */
function copyOpenApiTemplate(projectPath) {

  const templatePath = path.join(
    __dirname,
    "..",
    "templates",
    "openapi",
    TEMPLATES.OPENAPI
  );

  if (!fs.existsSync(templatePath)) {
    console.warn("⚠ No se encontró el template openapi.yaml");
    return;
  }

  const destinationPath = path.join(
    projectPath,
    "api",
    TEMPLATES.OPENAPI
  );

  fs.copyFileSync(templatePath, destinationPath);

  console.log("📄 Template OpenAPI copiado");
}

/**
 * Función principal del comando.
 */
async function createProject() {

  console.log("\n🚀 Jarvis CLI - Crear Proyecto\n");

  try {

    const answers = await askProjectInfo();

    const normalizedName = normalizeProjectName(answers.name);

    const projectName = `${answers.prefix}-${normalizedName}`;

    const rootPath = process.cwd();

    const projectPath = path.join(rootPath, projectName);

    console.log(`📦 Nombre del proyecto: ${projectName}\n`);

    if (fs.existsSync(projectPath)) {
      throw new Error(`El proyecto "${projectName}" ya existe`);
    }

    /**
     * Crear estructura base
     */
    createProjectStructure(projectPath);

    /**
     * Copiar template OpenAPI root
     */
    copyOpenApiTemplate(projectPath);

    console.log("\n✅ Proyecto creado correctamente\n");

    console.log("📂 Estructura generada:\n");

    console.log(`
${projectName}
 ├ src
 └ api
    ├ openapi.yaml
    └ domains
`);

    console.log("Siguientes pasos:\n");

    console.log(`  cd ${projectName}`);
    console.log("  jarvis generate-domain <domain>");
    console.log("  jarvis generate-backend\n");

  } catch (error) {

    console.error("\n❌ Error creando el proyecto\n");
    console.error(error.message);

  }

}

module.exports = createProject;