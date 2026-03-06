/**
 * generate-backend.js
 * Author: Gregorovichz Carlos Rossi
 * ----------------------------------------------------
 * Genera microservicios NestJS con arquitectura hexagonal
 * leyendo los dominios definidos en api/domains
 */

const fs = require("fs")
const path = require("path")

module.exports = function generateBackend() {

  console.log("⚙ Generating Hexagonal NestJS backend")

  const domainsPath = path.join(process.cwd(), "api", "domains")

  if (!fs.existsSync(domainsPath)) {
    console.log("❌ No domains found in api/domains")
    return
  }

  const domains = fs.readdirSync(domainsPath)

  domains.forEach(file => {

    const domain = file.replace(".yaml", "")
    const Domain = domain.charAt(0).toUpperCase() + domain.slice(1)

    const serviceRoot = path.join(
      process.cwd(),
      "apps",
      `${domain}-service`
    )

    const src = path.join(serviceRoot, "src")

    createFolders(src)

    generateMain(src)
    generateModule(src)

    generateEntity(src, domain, Domain)
    generateRepository(src, domain, Domain)
    generateRepositoryImpl(src, domain, Domain)

    generateController(src, domain, Domain)
    generateDto(src, domain, Domain)

    generatePackage(serviceRoot)

    console.log(`✔ Service generated: ${domain}-service`)

  })

  console.log("✅ Backend generation completed")

}

/* ---------- Folder Structure ---------- */

function createFolders(src) {

  const folders = [
    "domain/entities",
    "domain/repositories",
    "application/use-cases",
    "infrastructure/controllers",
    "infrastructure/persistence",
    "dto"
  ]

  folders.forEach(folder => {
    fs.mkdirSync(path.join(src, folder), { recursive: true })
  })

}

/* ---------- NestJS Bootstrap ---------- */

function generateMain(src) {

  const code = `
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(3000)
}

bootstrap()
`

  fs.writeFileSync(path.join(src, "main.ts"), code)

}

function generateModule(src) {

  const code = `
import { Module } from '@nestjs/common'

@Module({
  controllers: [],
  providers: []
})
export class AppModule {}
`

  fs.writeFileSync(path.join(src, "app.module.ts"), code)

}

/* ---------- Domain Layer ---------- */

function generateEntity(src, domain, Domain) {

  const code = `
export class ${Domain} {

  id: string
  name: string

}
`

  fs.writeFileSync(
    path.join(src, "domain/entities", `${domain}.entity.ts`),
    code
  )

}

function generateRepository(src, domain, Domain) {

  const code = `
import { ${Domain} } from '../entities/${domain}.entity'

export interface ${Domain}Repository {

  save(entity: ${Domain}): Promise<void>

  findById(id: string): Promise<${Domain} | null>

}
`

  fs.writeFileSync(
    path.join(src, "domain/repositories", `${domain}.repository.ts`),
    code
  )

}

/* ---------- Infrastructure Layer ---------- */

function generateRepositoryImpl(src, domain, Domain) {

  const code = `
import { Injectable } from '@nestjs/common'
import { ${Domain}Repository } from '../../domain/repositories/${domain}.repository'

@Injectable()
export class ${Domain}RepositoryImpl implements ${Domain}Repository {

  async save(entity: any): Promise<void> {}

  async findById(id: string): Promise<any> {
    return null
  }

}
`

  fs.writeFileSync(
    path.join(src, "infrastructure/persistence", `${domain}.repository.impl.ts`),
    code
  )

}

/* ---------- Controller ---------- */

function generateController(src, domain, Domain) {

  const code = `
import { Controller, Get, Post, Param, Body } from '@nestjs/common'

@Controller('${domain}s')
export class ${Domain}Controller {

  @Get()
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id: string) {}

  @Post()
  create(@Body() body: any) {}

}
`

  fs.writeFileSync(
    path.join(src, "infrastructure/controllers", `${domain}.controller.ts`),
    code
  )

}

/* ---------- DTO ---------- */

function generateDto(src, domain, Domain) {

  const code = `
export class Create${Domain}Dto {

  name: string

}
`

  fs.writeFileSync(
    path.join(src, "dto", `create-${domain}.dto.ts`),
    code
  )

}

/* ---------- package.json ---------- */

function generatePackage(serviceRoot) {

  const pkg = `
{
  "name": "service",
  "version": "1.0.0",
  "scripts": {
    "start": "nest start"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.0.0"
  }
}
`

  fs.writeFileSync(
    path.join(serviceRoot, "package.json"),
    pkg
  )

}