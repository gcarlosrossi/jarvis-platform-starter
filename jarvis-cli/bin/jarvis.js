#!/usr/bin/env node
/**
 * Jarvis CLI
 * Author: Gregorovichz Carlos Rossi
 * Fecha Creación: 05-03-2026
 * ----------------------------------------
 * Punto de entrada principal del CLI.
 *
 * Este archivo registra los comandos disponibles
 * utilizando la librería Commander y delega la
 * ejecución a los módulos ubicados en /commands.
 *
 * Ejemplo de uso:
 *   jarvis create-project
 *   jarvis generate-domain patient
 */

const { Command } = require("commander")
const createProject = require("../commands/create-project")
const generateDomain = require("../commands/generate-domain")
const generateBackend = require("../commands/generate-backend")

const program = new Command()

program
  .name("jarvis")
  .description("Jarvis Platform CLI")
  .version("1.0.0");
/**
 * Comando: create-project
 * Crea la estructura base de un nuevo proyecto.
 */
program
  .command("create-project")
  .description("Create Project backend")
  .action(createProject)
/**
 * Comando: create-project
 * Crea la estructura base de un nuevo proyecto.
 */
program
  .command("generate-domain <domain>")
  .description("Generate new Domain microservice")
  .action(generateDomain)
/**
 * Comando: generate-backend
 * Genera el backend NestJS a partir del OpenAPI.
 */
program
  .command("generate-backend")
  .description("Generate NestJS backend from OpenAPI")
  .action(generateBackend)

program.parse(process.argv)
