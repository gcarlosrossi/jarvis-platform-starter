const PREFIXES = {

  DISENO: {
    name: "Diseño",
    prefix: "ds"
  },

  CANAL: {
    name: "Canal",
    prefix: "ch"
  },

  NEGOCIO: {
    name: "Negocio",
    prefix: "bs"
  }

};

const PROJECT_FOLDERS = [
  "src",
  "api",
  "api/domains"
];

const TEMPLATES = {
  OPENAPI: "root-openapi.yaml"
};

module.exports = {
  PREFIXES,
  PROJECT_FOLDERS,
  TEMPLATES
};