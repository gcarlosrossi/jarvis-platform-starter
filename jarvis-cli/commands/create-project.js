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
  TEMPLATES,
  CREATE_PROJECT_MESSAGES,
  PROMPT_TYPE,
  PROMPT_NAME,
  RETURN
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
      type: PROMPT_TYPE.LIST,
      name: PROMPT_NAME.PREFIX,
      message: CREATE_PROJECT_MESSAGES.TIPOPROYECTO,
      choices: Object.values(PREFIXES).map((prefix) => ({
        name: prefix.name,
        value: prefix.prefix
      }))
    },
    {
      type: PROMPT_TYPE.INPUT,
      name: PROMPT_NAME.NAME,
      message: CREATE_PROJECT_MESSAGES.NOMBREPROYECTO,
      validate: (input) => {
        if (!input.trim()) {
          return CREATE_PROJECT_MESSAGES.NOMBREPROYECTO_REQUIRED;
        }
        if (input.trim().length < 3) {
          return CREATE_PROJECT_MESSAGES.NOMBREPROYECTO_LONGITUDMINIMA;
        }
        return RETURN.SUCCESS;
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
  console.log(CREATE_PROJECT_MESSAGES.INFO_ESTRUCTURA_CREADA);
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
    console.warn(CREATE_PROJECT_MESSAGES.WARN_TEMPLATE_NOTFOUND);
    return;
  }
  const destinationPath = path.join(
    projectPath,
    "api",
    TEMPLATES.OPENAPI
  );
  fs.copyFileSync(templatePath, destinationPath);
  console.log(CREATE_PROJECT_MESSAGES.INFO_TEMPLATE_COPIADO);
}

/**
 * Función principal del comando.
 */
async function createProject() {

  console.log(CREATE_PROJECT_MESSAGES.INFO_PROJECT_INIT);

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

    /**
     * Copia template project files
     */
    copyProjectTemplates(projectPath)

    console.log(CREATE_PROJECT_MESSAGES.INFO_PROJECT_CREADA);
    console.log(CREATE_PROJECT_MESSAGES.INFO_ESTRUCTURA_GENERADA);
    console.log(`
      ${projectName}
      ├ src
      └ api
          ├ openapi.yaml
          └ domains
    `);

    console.log(CREATE_PROJECT_MESSAGES.INFO_SIGUIENTES_PASOS);
    console.log(`>_   cd ${projectName}`);
    console.log(`>_   jarvis generate-domain ${normalizedName}`);
    console.log(">_   jarvis generate-backend\n");
  } catch (error) {

    console.error(CREATE_PROJECT_MESSAGES.ERROR_PROJECT_CREADA);
    console.error(error.message);

  }

}

function copyProjectTemplates(projectPath) {

  const templatesDir = path.join(
    __dirname,
    "..",
    "templates",
    "project"
  )

  const files = [
    { src: "gitignore", dest: ".gitignore" },
    { src: "package.json", dest: "package.json" },
    { src: "docker-compose.yml", dest: "docker-compose.yml" },
    { src: "README.md", dest: "README.md" }
  ]

  files.forEach(file => {

    const src = path.join(templatesDir, file.src)
    const dest = path.join(projectPath, file.dest)

    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest)
    }

  })

  console.log("📦 Archivos base del proyecto creados")

}

module.exports = createProject;