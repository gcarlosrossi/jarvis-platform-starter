/**
 * generate-domain.js
 * ----------------------------------------------------
 * Genera un nuevo dominio API basado en un template OpenAPI.
 *
 * Ejemplo:
 *   jarvis generate-domain patient
 */

const fs = require("fs")
const path = require("path")
const renderTemplate = require("../templates/template")

module.exports = function generateDomain() {

   /**
   * Obtener dominio desde CLI
   * jarvis generate-domain patient
   */
  const domain = process.argv[3]

  if (!domain) {
    console.log("❌ Debe especificar un dominio")
    console.log("Ejemplo: jarvis generate-domain patient")
    return
  }
  
  const Domain = domain.charAt(0).toUpperCase() + domain.slice(1)
  const domainPlural = `${domain}s`
  const DomainPlural = `${Domain}s`

  /**
   * Ruta del template de dominio
   */
  const templatePath = path.join(
    __dirname,
    "..",
    "templates",
    "openapi",
    "domain-openapi.yaml"
  )

  if (!fs.existsSync(templatePath)) {
    console.log("❌ Domain template not found")
    console.log(templatePath)
    return
  }

  const template = fs.readFileSync(templatePath, "utf8")

  const content = renderTemplate(template, {
    domain,
    Domain,
    domainPlural,
    DomainPlural
  })

  const outputDir = path.join(process.cwd(), "api", "domains")

  fs.mkdirSync(outputDir, { recursive: true })
  const domainFile = path.join(outputDir, `${domain}.yaml`)

  if (fs.existsSync(domainFile)) {
    console.log(`⚠ El dominio ${domain} ya existe`)
    return
  }

  fs.writeFileSync(domainFile, content)

  console.log(`✅ API domain created: ${domain}`)

  updateRootOpenApi(domain, domainPlural)
}


/**
 * Actualiza el root-openapi.yaml agregando los paths del dominio
 */
function updateRootOpenApi(domain, domainPlural) {

  const rootOpenApiPath = path.join(
    process.cwd(),
    "api",
    "root-openapi.yaml"
  )

  if (!fs.existsSync(rootOpenApiPath)) {
    console.log("⚠ root-openapi.yaml no encontrado")
    return
  }

  let rootOpenApi = fs.readFileSync(rootOpenApiPath, "utf8")

  const basePath = `/${domainPlural}`

  // evitar duplicados
  if (rootOpenApi.includes(basePath)) {
    console.log("ℹ Paths ya registrados en root-openapi.yaml")
    return
  }

  const newPaths = `
  ${basePath}:
    $ref: "./domains/${domain}.yaml#/paths/~1${domainPlural}"

  ${basePath}/{id}:
    $ref: "./domains/${domain}.yaml#/paths/~1${domainPlural}~1{id}"
`

  if (rootOpenApi.includes("paths: {}")) {

    rootOpenApi = rootOpenApi.replace(
      "paths: {}",
      `paths:${newPaths}`
    )

  } else {

    rootOpenApi = rootOpenApi.replace(
      "paths:",
      `paths:${newPaths}`
    )

  }

  fs.writeFileSync(rootOpenApiPath, rootOpenApi)

  console.log("🔗 Paths registrados en root-openapi.yaml")
}